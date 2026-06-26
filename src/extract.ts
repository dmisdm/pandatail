import { __unstable__loadDesignSystem } from "tailwindcss";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { deriveTokenPath, matchNamespace, type PandaTokenCategory } from "./namespaces";
import { synthesiseDerivedTokens } from "./derivedScales";

const requireFromHere = createRequire(`${process.cwd()}/__pandatail_anchor__`);

/**
 * Resolve a bare specifier like `tailwindcss` or `tailwindcss/theme` to a
 * concrete CSS file path. Tailwind's design-system loader passes bare ids
 * straight through to `loadStylesheet`, so we have to resolve them ourselves.
 */
function resolveStylesheet(id: string, basedir: string): string {
  if (id.startsWith(".") || id.startsWith("/")) {
    return resolve(basedir, id);
  }
  const candidates = [`${id}/index.css`, `${id}.css`, id];
  for (const candidate of candidates) {
    try {
      return requireFromHere.resolve(candidate, { paths: [basedir] });
    } catch {}
  }
  throw new Error(`pandatail: cannot resolve stylesheet '${id}' from ${basedir}`);
}

/**
 * A single Tailwind theme entry resolved to its CSS-variable reference and
 * the Panda category it should be projected into.
 */
export interface ExtractedToken {
  /**
   * Source CSS variable. Informational — kept so consumers can introspect
   * which Tailwind var a Panda token came from. The actual Panda token value
   * is in {@link ExtractedToken.value}.
   */
  cssVar: string;
  /**
   * Value Panda should emit for this token. Typically `var(--color-blue-500)`
   * (a reference to Tailwind's CSS variable, so user overrides flow through),
   * but synthesised tokens may use `calc(...)` or literal expressions.
   */
  value: string;
  /** Panda token category, e.g. `colors`. */
  category: PandaTokenCategory;
  /**
   * Nested path inside the category, as an array of segments. Stored as
   * segments (not a dot-joined string) so step names containing literal
   * dots — `spacing.0.5` is a *single* leaf at path `['0.5']`, not a leaf
   * nested under `0` — round-trip without ambiguity.
   */
  path: string[];
}

export interface ExtractOptions {
  /**
   * Inline CSS source. Typically `@import "tailwindcss";` plus any `@theme {}`
   * blocks the user has authored. Required.
   */
  css: string;
  /**
   * Base directory for resolving `@import` / `@source` relative paths.
   * Defaults to `process.cwd()`.
   */
  base?: string;
}

/**
 * Load a Tailwind v4 design system from CSS source and project its resolved
 * theme into a flat list of {@link ExtractedToken}s ready for Panda.
 */
export async function extractTokens(opts: ExtractOptions): Promise<ExtractedToken[]> {
  const base = opts.base ?? process.cwd();

  const ds = await __unstable__loadDesignSystem(opts.css, {
    base,
    loadStylesheet: async (id: string, basedir: string) => {
      const path = resolveStylesheet(id, basedir);
      const content = await readFile(path, "utf8");
      return { path, base: dirname(path), content };
    },
    loadModule: async () => {
      throw new Error("loadModule is not supported in pandatail extraction");
    },
  });

  const themeEntries = new Map<string, string>();
  for (const [key, entry] of ds.theme.entries()) themeEntries.set(key, entry.value);

  const out: ExtractedToken[] = [];
  for (const [key, rawValue] of themeEntries) {
    const matched = matchNamespace(key);
    if (!matched) continue;
    if (matched.rest === "DEFAULT") continue;
    out.push({
      cssVar: key,
      // Breakpoints feed `@media (min-width: …)`, which doesn't accept
      // `var()`. Everything else routes through the CSS variable so user
      // @theme overrides flow through at runtime.
      value:
        matched.mapping.category === "breakpoints" ? rawValue : `var(${key})`,
      category: matched.mapping.category,
      path: deriveTokenPath(matched.rest),
    });
  }
  out.push(...synthesiseDerivedTokens(themeEntries.has("--spacing")));
  return out;
}

/** Convenience: load CSS from a file path then extract. */
export async function extractTokensFromFile(
  path: string,
): Promise<ExtractedToken[]> {
  const css = await readFile(path, "utf8");
  return extractTokens({ css, base: dirname(resolve(path)) });
}
