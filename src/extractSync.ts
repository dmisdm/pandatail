import postcss, { type AtRule, type Declaration, type Root } from "postcss";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { deriveTokenPath, matchNamespace } from "./namespaces";
import { synthesiseDerivedTokens } from "./derivedScales";
import type { ExtractedToken } from "./extract";

// `createRequire` only needs a real filename to anchor relative requires; we
// always override the search path via the `paths` option below, so the anchor
// just has to be valid. `process.cwd()` works in both ESM and CJS bundling.
const requireFromHere = createRequire(`${process.cwd()}/__pandatail_anchor__`);

export interface ExtractSyncOptions {
  /** Inline CSS source. Either this or {@link cssPath} must be set. */
  css?: string;
  /** Path to the user's Tailwind entry CSS. */
  cssPath?: string;
  /** Base dir for resolving `@import` relative paths. */
  base?: string;
}

/**
 * Synchronous token extraction. Walks the user's CSS, follows `@import` to
 * `tailwindcss` (and friends) by reading those files from disk, and collects
 * every `--*` declaration that appears inside an `@theme {}` block.
 *
 * This sidesteps Tailwind's async design-system loader so it can be called
 * from inside PandaCSS configs (which Panda bundles to CJS — no top-level
 * await).
 */
export function extractTokensSync(opts: ExtractSyncOptions): ExtractedToken[] {
  let css: string;
  let base: string;
  if (opts.css != null) {
    css = opts.css;
    base = opts.base ?? process.cwd();
  } else if (opts.cssPath != null) {
    const abs = resolve(opts.cssPath);
    css = readFileSync(abs, "utf8");
    base = dirname(abs);
  } else {
    throw new Error("extractTokensSync: provide either `css` or `cssPath`");
  }

  const decls = new Map<string, string>();
  collectThemeDecls(css, base, decls, new Set());

  const out: ExtractedToken[] = [];
  for (const [cssVar, rawValue] of decls) {
    const matched = matchNamespace(cssVar);
    if (!matched) continue;
    if (matched.rest === "DEFAULT") continue;
    out.push({
      cssVar,
      // Breakpoints feed `@media (min-width: …)`, which doesn't accept
      // `var()`. Everything else routes through the CSS variable.
      value:
        matched.mapping.category === "breakpoints"
          ? rawValue
          : `var(${cssVar})`,
      category: matched.mapping.category,
      path: deriveTokenPath(matched.rest),
    });
  }
  out.push(...synthesiseDerivedTokens(decls.has("--spacing")));
  return out;
}

function collectThemeDecls(
  css: string,
  basedir: string,
  decls: Map<string, string>,
  seen: Set<string>,
) {
  const root: Root = postcss.parse(css);
  root.walkAtRules((rule: AtRule) => {
    if (rule.name === "import") {
      const id = parseImportTarget(rule.params);
      if (!id) return;
      const path = resolveCssImport(id, basedir);
      if (!path || seen.has(path)) return;
      seen.add(path);
      const content = readFileSync(path, "utf8");
      collectThemeDecls(content, dirname(path), decls, seen);
    } else if (rule.name === "theme") {
      rule.walkDecls((d: Declaration) => {
        if (d.prop.startsWith("--")) {
          // Last write wins — matches Tailwind's override semantics where
          // a user `@theme` block overrides the default.
          decls.set(d.prop, d.value);
        }
      });
    }
  });
}

function parseImportTarget(params: string): string | null {
  // Forms accepted: `"tailwindcss"`, `'tailwindcss/theme'`, `url("./x.css")`
  const trimmed = params.trim();
  const urlMatch = /^url\(\s*["']?([^"')]+)["']?\s*\)/.exec(trimmed);
  if (urlMatch) return urlMatch[1]!;
  const quoteMatch = /^["']([^"']+)["']/.exec(trimmed);
  if (quoteMatch) return quoteMatch[1]!;
  return null;
}

function resolveCssImport(id: string, basedir: string): string | null {
  if (id.startsWith(".") || id.startsWith("/")) {
    return resolve(basedir, id);
  }
  const candidates = [`${id}/index.css`, `${id}.css`, id];
  for (const candidate of candidates) {
    try {
      return requireFromHere.resolve(candidate, { paths: [basedir] });
    } catch {}
  }
  return null;
}
