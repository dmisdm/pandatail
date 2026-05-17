import { defineConfig } from "@pandacss/dev";
import { tailwindPresetSync } from "../src";
import { join } from "node:path";

export default defineConfig({
  preflight: false,
  jsxFramework: "react",
  // `<tw.div bg="brand.500" maxW="sm">` reads as a typed Tailwind class string.
  jsxFactory: "tw",
  jsxStyleProps: "all",
  include: ["./src/**/*.{ts,tsx}"],
  exclude: [],
  presets: [
    "@pandacss/preset-base",
    tailwindPresetSync({ cssPath: join(__dirname, "src/tailwind.css") }),
  ],
  outdir: "styled-system",
  eject: true,

  /*
   * Named typography presets. Each entry bundles fontSize / lineHeight /
   * letterSpacing / fontWeight / textTransform together so a single prop
   * (`textStyle="display-2xl"`) sets the whole text rhythm at once. Two
   * shorthands are exposed for evaluating the DX: `t` (terse) and
   * `textPreset` (verbose). Both resolve to the same Panda utility.
   */
  theme: {
    extend: {
      textStyles: {
        "display-2xl": {
          value: {
            fontSize: "6xl",
            lineHeight: "tight",
            letterSpacing: "tight",
            fontWeight: "semibold",
          },
        },
        "display-xl": {
          value: {
            fontSize: "5xl",
            lineHeight: "tight",
            letterSpacing: "tight",
            fontWeight: "semibold",
          },
        },
        "display-lg": {
          value: {
            fontSize: "4xl",
            lineHeight: "tight",
            letterSpacing: "tight",
            fontWeight: "semibold",
          },
        },
        "heading-lg": {
          value: {
            fontSize: "2xl",
            lineHeight: "snug",
            fontWeight: "semibold",
          },
        },
        "heading-md": {
          value: {
            fontSize: "xl",
            lineHeight: "snug",
            fontWeight: "semibold",
          },
        },
        "body-lg": {
          value: { fontSize: "lg", lineHeight: "relaxed" },
        },
        "body-md": {
          value: { fontSize: "base", lineHeight: "normal" },
        },
        caption: {
          value: { fontSize: "sm", color: "zinc.500" },
        },
        eyebrow: {
          value: {
            fontSize: "xs",
            fontWeight: "medium",
            letterSpacing: "wide",
            textTransform: "uppercase",
            color: "zinc.500",
          },
        },
      },
    },
  },

  /*
   * Tailwind-shaped style-prop names.
   *
   * Panda's analyser reads the keys here as JSX style props on `<tw.…>`, so
   * `<tw.div items="center" leading={6} tracking="wide" text="zinc.500">` is
   * statically extracted with no runtime adapter.
   *
   * Where Tailwind's name is a clean alias of an existing CSS property
   * (`leading` → `lineHeight`, `items` → `alignItems`) we extend the
   * existing utility with a `shorthand`. Where it's a whole new pattern
   * (`spaceY` → adjacent-sibling margin-top) we declare a fresh utility
   * whose transform returns the literal selector — so the emitted CSS
   * matches Tailwind's `space-y-*` rule exactly, not a `flexDir + gap`
   * approximation.
   */
  utilities: {
    extend: {
      alignItems: { shorthand: "items" },
      justifyContent: { shorthand: "justify" },
      lineHeight: { shorthand: "leading" },
      letterSpacing: { shorthand: "tracking" },
      // Deliberately NOT aliasing `color` → `text`. Tailwind muscle memory
      // says `text-xs` (font size) before `text-red-500` (color), so making
      // `text="xs"` resolve to color would silently misread a value users
      // expect to be a size. Keep `color` and `fontSize` as separate props.

      /*
       * Custom typed utility. `<tw.div elevation={2}>` is type-checked to
       * the four declared levels; an unknown level is a TS error, not a
       * silent miss. The transform owns the actual CSS, so a future
       * redesign of the elevation scale lands here and the consuming
       * components don't move.
       */
      elevation: {
        className: "elevation",
        values: {
          0: "none",
          1: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          2: "0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          3: "0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06)",
          4: "0 24px 56px -8px rgba(0, 0, 0, 0.18), 0 8px 16px -4px rgba(0, 0, 0, 0.08)",
        },
        transform(value: string) {
          return { boxShadow: value };
        },
      },

      spaceY: {
        className: "space-y",
        values: "spacing",
        transform(value: string) {
          return { "& > * + *": { marginTop: value } };
        },
      },
      spaceX: {
        className: "space-x",
        values: "spacing",
        transform(value: string) {
          return { "& > * + *": { marginLeft: value } };
        },
      },
    },
  },
});
