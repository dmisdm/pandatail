import type { ExtractedToken } from "./extract";

/**
 * Tailwind v4 ships a single `--spacing: 0.25rem` token and derives every
 * `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` utility from it via
 * `calc(var(--spacing) * N)`. The step names are baked into Tailwind's
 * utility generator, not emitted as theme entries.
 *
 * Panda has no such derivation step — it needs explicit tokens. So when we
 * see `--spacing` in the user's theme we synthesise the standard Tailwind
 * numeric scale here, with values that resolve through the same
 * `var(--spacing)` reference so user overrides flow through.
 */
const TAILWIND_NUMERIC_STEPS = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24,
  28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
] as const;

/** Panda treats numeric width/height tokens as `sizes` not `spacing`. */
const NAMED_SIZES: Record<string, string> = {
  full: "100%",
  screen: "100vw",
  "screen-h": "100vh",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
  auto: "auto",
};

/**
 * Tailwind hardcodes `rounded-full`, `rounded-none`, `rounded-sm`-equivalents
 * into its utility generator rather than emitting `--radius-full` etc. We
 * synthesise them here so `rounded: 'full'` works on the Panda side too.
 */
const NAMED_RADII: Record<string, string> = {
  none: "0",
  full: "9999px",
};

export function synthesiseDerivedTokens(
  hasSpacingBase: boolean,
): ExtractedToken[] {
  const out: ExtractedToken[] = [];

  if (hasSpacingBase) {
    pushNumericScale(out);
  }
  pushNamed(out);
  return out;
}

function pushNumericScale(out: ExtractedToken[]) {
  for (const step of TAILWIND_NUMERIC_STEPS) {
    const name = String(step);
    const value = `calc(var(--spacing) * ${name})`;
    // Use a synthetic cssVar so Panda emits a stable wrapper; the value is
    // the calc() expression, not a `var()` reference, so the result tracks
    // any --spacing override the user makes.
    const cssVar = `--spacing-${name.replace(".", "_")}`;
    out.push({ cssVar, value, category: "spacing", path: [name] });
    out.push({ cssVar, value, category: "sizes", path: [name] });
    // Tailwind's `leading-N` ALSO derives from --spacing (so `leading-6` is
    // `calc(--spacing * 6)` = 1.5rem, not `line-height: 6` unitless). Panda
    // looks up `lineHeight` values in the `lineHeights` category, so mirror
    // the scale there too.
    out.push({ cssVar, value, category: "lineHeights", path: [name] });
  }
}

function pushNamed(out: ExtractedToken[]) {
  for (const [name, value] of Object.entries(NAMED_SIZES)) {
    out.push({
      cssVar: `--sizes-${name.replace(".", "_")}`,
      value,
      category: "sizes",
      path: [name],
    });
  }

  for (const [name, value] of Object.entries(NAMED_RADII)) {
    out.push({
      cssVar: `--radii-${name}`,
      value,
      category: "radii",
      path: [name],
    });
  }
}
