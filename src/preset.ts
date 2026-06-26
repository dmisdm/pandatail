import { definePreset } from "@pandacss/dev";
import { extractTokens, type ExtractedToken } from "./extract";
import { extractTokensSync } from "./extractSync";
import type { PandaTokenCategory } from "./namespaces";

export interface TailwindPresetOptions {
  /**
   * Inline Tailwind v4 CSS source. Either this or {@link cssPath} must be set.
   */
  css?: string;
  /**
   * Path to the user's Tailwind entry CSS (the file containing
   * `@import "tailwindcss"` and any `@theme {}` blocks).
   */
  cssPath?: string;
  /**
   * Base directory for resolving CSS imports.
   */
  base?: string;
}

/** Nested object shape Panda's token category map expects. */
type TokenTree = { [k: string]: TokenTree | { value: string } };

/**
 * Build a PandaCSS preset whose token layer references the CSS custom
 * properties that Tailwind v4 emits from the user's `@theme` blocks.
 *
 * Tailwind owns the values; Panda owns the typed API. There is no value
 * duplication — every Panda token resolves to `var(--<tailwind-name>)`.
 *
 * Async variant — uses Tailwind's own design-system loader for highest
 * fidelity. Prefer {@link tailwindPresetSync} from inside a Panda config,
 * since Panda bundles configs to CJS and disallows top-level `await`.
 */
export async function tailwindPreset(opts: TailwindPresetOptions) {
  const tokens = await loadTokens(opts);
  return buildPreset(tokens);
}

/**
 * Synchronous form of {@link tailwindPreset}. Parses `@theme` blocks via
 * PostCSS instead of invoking Tailwind's loader, so it can be called
 * directly from a `panda.config.ts` without top-level await.
 */
export function tailwindPresetSync(opts: TailwindPresetOptions) {
  const tokens = extractTokensSync(opts);
  return buildPreset(tokens);
}

function buildPreset(tokens: ExtractedToken[]) {
  // Breakpoints feed `theme.breakpoints` (Panda's media-query generator),
  // not `theme.tokens.breakpoints` (typed token references for style props).
  // The two layers don't overlap — split them here.
  const breakpoints: Record<string, string> = {};
  const tokenTokens: ExtractedToken[] = [];
  for (const t of tokens) {
    if (t.category === "breakpoints") {
      breakpoints[t.path.join("-")] = t.value;
    } else {
      tokenTokens.push(t);
    }
  }

  const tokensByCategory = groupByCategory(tokenTokens);
  const theme: Record<string, TokenTree> = {};
  for (const [category, list] of Object.entries(tokensByCategory)) {
    theme[category] = buildTree(list, category);
  }

  return definePreset({
    name: "tailwind",
    theme: {
      tokens: theme as never,
      breakpoints,
    },
  });
}

async function loadTokens(opts: TailwindPresetOptions): Promise<ExtractedToken[]> {
  if (opts.css != null) {
    return extractTokens({ css: opts.css, base: opts.base });
  }
  if (opts.cssPath != null) {
    const { extractTokensFromFile } = await import("./extract");
    return extractTokensFromFile(opts.cssPath);
  }
  throw new Error("tailwindPreset: provide either `css` or `cssPath`");
}

function groupByCategory(
  tokens: ExtractedToken[],
): Partial<Record<PandaTokenCategory, ExtractedToken[]>> {
  const out: Partial<Record<PandaTokenCategory, ExtractedToken[]>> = {};
  for (const t of tokens) {
    (out[t.category] ??= []).push(t);
  }
  return out;
}

function buildTree(tokens: ExtractedToken[], category: string): TokenTree {
  const root: TokenTree = {};
  for (const t of tokens) {
    let cursor: TokenTree = root;
    for (let i = 0; i < t.path.length - 1; i++) {
      const seg = t.path[i]!;
      const next = cursor[seg];
      if (next && "value" in next) {
        // A leaf already lives here but this token wants to nest *under* it.
        // Panda can't represent a token that is both a value and a group, so
        // fail loudly rather than silently overwriting one with the other.
        throw new Error(
          `pandatail: token path collision in '${category}' at ` +
            `'${t.path.slice(0, i + 1).join(".")}': ` +
            `'${t.path.join(".")}' nests under a token that is already a leaf.`,
        );
      }
      if (!next) {
        const fresh: TokenTree = {};
        cursor[seg] = fresh;
        cursor = fresh;
      } else {
        cursor = next;
      }
    }
    const leaf = t.path[t.path.length - 1]!;
    const existing = cursor[leaf];
    if (existing && !("value" in existing)) {
      // The mirror image: a group already lives here but this token wants the
      // same name as a leaf.
      throw new Error(
        `pandatail: token path collision in '${category}' at ` +
          `'${t.path.join(".")}': a leaf token clashes with an existing group.`,
      );
    }
    cursor[leaf] = { value: t.value };
  }
  return root;
}
