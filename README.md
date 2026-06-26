# pandatail

A **PandaCSS preset** that mirrors every token in your Tailwind v4
`@theme { … }` block into typed Panda style props.

## Install

```
npm install -D @dmisdm/pandatail
```

Then install Panda itself if you don't have it:

```sh
npm install -D @pandacss/dev
npx panda init --postcss
```

- Tailwind owns the values; Panda owns the typed API. There is **no value
  duplication** — every Panda token resolves to `var(--<tailwind-name>)`.
- Default Tailwind palettes (`blue.500`, `mauve.300`, …) and your custom
  `@theme` additions (`brand.500`, `--radius-pill`, …) are typed
  automatically.
- Tailwind utilities and Panda style props coexist in the same JSX. Refactor
  one side at a time.

```tsx
// CSS — your @theme block is the single source of truth
@import "tailwindcss";
@theme {
  --color-brand-500: oklch(0.62 0.21 260);
  --radius-pill: 999px;
}

// TSX — Panda autocomplete & TS errors against the same tokens
<tw.span bg="brand.500" rounded="pill" px={3} py={1} color="white">
  New release
</tw.span>
```

Tailwind v4 (`tailwindcss@^4`) is a peer dependency and is loaded from your
existing setup — the preset doesn't require its own copy.

## Configure

```ts
// panda.config.ts
import { defineConfig } from "@pandacss/dev";
import { tailwindPresetSync } from "@dmisdm/pandatail";

export default defineConfig({
  preflight: false, // Tailwind already ships preflight
  jsxFramework: "react",
  presets: [
    "@pandacss/preset-base",
    tailwindPresetSync({ cssPath: "./src/tailwind.css" }),
  ],
  include: ["./src/**/*.{ts,tsx}"],
  outdir: "styled-system",
});
```

Then:

```sh
npx panda codegen
```

## How it works

The preset reads your Tailwind entry CSS, finds every `--*` token inside
`@theme { … }` blocks (including the ones Tailwind itself ships in
`tailwindcss/theme.css`), and registers each one as a Panda token whose value
is a `var()` reference back to the CSS variable.

Namespaces map to Panda categories:

| Tailwind namespace | Panda category                      |
| ------------------ | ----------------------------------- |
| `--color-*`        | `colors`                            |
| `--spacing-*`      | `spacing` + `sizes`                 |
| `--radius-*`       | `radii`                             |
| `--shadow-*`       | `shadows`                           |
| `--text-*`         | `fontSizes`                         |
| `--font-*`         | `fonts`                             |
| `--font-weight-*`  | `fontWeights`                       |
| `--leading-*`      | `lineHeights`                       |
| `--tracking-*`     | `letterSpacings`                    |
| `--breakpoint-*`   | `theme.breakpoints` (media queries) |
| `--container-*`    | `sizes`                             |

Tailwind derives numeric scales (`p-4`, `leading-6`) from the single
`--spacing` token; the preset synthesises those steps into Panda's
`spacing`, `sizes`, and `lineHeights` categories so the typed APIs match
Tailwind's coverage.

## API

```ts
import {
  tailwindPreset, // async — uses Tailwind's design-system loader
  tailwindPresetSync, // sync — call from panda.config.ts (recommended)
  extractTokens,
  extractTokensSync,
} from "@dmisdm/pandatail";
```

Use `tailwindPresetSync` in `panda.config.ts` — Panda bundles configs to CJS
and rejects top-level `await`.

## License

MIT
