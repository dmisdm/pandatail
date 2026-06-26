/**
 * Mapping from Tailwind v4 theme namespace prefix to PandaCSS token category.
 *
 * The prefix is the part after `--` and before the trailing identifier.
 * Order matters: longer, more specific prefixes must come before shorter ones
 * (e.g. `font-weight` before `font`) so longest-prefix-wins.
 */
export type PandaTokenCategory =
  | "colors"
  | "fonts"
  | "fontSizes"
  | "fontWeights"
  | "letterSpacings"
  | "lineHeights"
  | "spacing"
  | "sizes"
  | "radii"
  | "shadows"
  | "dropShadows"
  | "blurs"
  | "borders"
  | "aspectRatios"
  | "easings"
  | "animations"
  | "durations"
  | "breakpoints";

export interface NamespaceMapping {
  /** Tailwind namespace prefix, without leading `--`, without trailing `-`. */
  prefix: string;
  /** Panda token category this namespace projects into. */
  category: PandaTokenCategory;
}

export const TAILWIND_NAMESPACES: NamespaceMapping[] = [
  { prefix: "font-weight", category: "fontWeights" },
  { prefix: "inset-shadow", category: "shadows" },
  { prefix: "drop-shadow", category: "dropShadows" },
  { prefix: "text-shadow", category: "shadows" },
  { prefix: "color", category: "colors" },
  { prefix: "spacing", category: "spacing" },
  { prefix: "font", category: "fonts" },
  { prefix: "text", category: "fontSizes" },
  { prefix: "tracking", category: "letterSpacings" },
  { prefix: "leading", category: "lineHeights" },
  { prefix: "breakpoint", category: "breakpoints" },
  // Tailwind v4's `--container-*` scale powers `max-w-sm`, `max-w-prose`, …
  // — same scale Panda's `maxW`, `minW`, `w`, `h` read from `sizes`.
  { prefix: "container", category: "sizes" },
  { prefix: "radius", category: "radii" },
  { prefix: "shadow", category: "shadows" },
  { prefix: "blur", category: "blurs" },
  { prefix: "aspect", category: "aspectRatios" },
  { prefix: "ease", category: "easings" },
  { prefix: "animate", category: "animations" },
  { prefix: "perspective", category: "sizes" },
];

/**
 * Derive a token's nested Panda path from the post-namespace remainder.
 *
 * Only a *trailing numeric scale step* nests (`amber-500` → `['amber','500']`);
 * everything else stays a single flat segment with hyphens preserved
 * (`muted-foreground` → `['muted-foreground']`). Splitting every hyphen — as we
 * used to — collapsed shadcn's paired `--color-X` / `--color-X-foreground`
 * tokens onto colliding leaf/parent paths, silently dropping one of each pair.
 */
export function deriveTokenPath(rest: string): string[] {
  const lastDash = rest.lastIndexOf("-");
  if (lastDash > 0) {
    const after = rest.slice(lastDash + 1);
    if (/^\d+$/.test(after)) {
      return [rest.slice(0, lastDash), after];
    }
  }
  return [rest];
}

export function matchNamespace(
  themeKey: string,
): { mapping: NamespaceMapping; rest: string } | null {
  if (!themeKey.startsWith("--")) return null;
  const stripped = themeKey.slice(2);
  // Skip Tailwind's paired-metadata convention (`--text-3xl--line-height`,
  // `--color-blue-500--alpha`, …). A double-dash inside the name means the
  // suffix is associated metadata for another token; Panda has its own way
  // of expressing those, and naively flattening them clobbers the parent leaf.
  if (stripped.includes("--")) return null;
  for (const mapping of TAILWIND_NAMESPACES) {
    if (stripped === mapping.prefix) {
      return { mapping, rest: "DEFAULT" };
    }
    const withDash = `${mapping.prefix}-`;
    if (stripped.startsWith(withDash)) {
      return { mapping, rest: stripped.slice(withDash.length) };
    }
  }
  return null;
}
