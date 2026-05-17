import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { extractTokensSync } from "../src/extractSync";
import { tailwindPresetSync } from "../src/preset";

const FIXTURE = join(import.meta.dir, "fixtures/basic.css");

describe("extractTokensSync", () => {
  test("matches the async extractor for user @theme entries", () => {
    const tokens = extractTokensSync({ cssPath: FIXTURE });
    const brand500 = tokens.find((t) => t.cssVar === "--color-brand-500");
    expect(brand500?.category).toBe("colors");
    expect(brand500?.path).toEqual(["brand", "500"]);
  });

  test("follows @import \"tailwindcss\" and picks up defaults", () => {
    const tokens = extractTokensSync({ cssPath: FIXTURE });
    expect(tokens.some((t) => t.cssVar === "--color-blue-500")).toBe(true);
    expect(tokens.some((t) => t.cssVar === "--radius-md")).toBe(true);
  });

  test("token values always reference the source CSS var", () => {
    // ExtractedToken.value is always `var(--…)`, never the raw Tailwind value,
    // so user @theme overrides flow through at runtime without re-extraction.
    const tokens = extractTokensSync({
      css: `@import "tailwindcss"; @theme { --color-blue-500: #000; }`,
    });
    const blue = tokens.find((t) => t.cssVar === "--color-blue-500");
    expect(blue?.value).toBe("var(--color-blue-500)");
  });
});

describe("decimal-step preservation", () => {
  test("spacing.0.5 stays a single leaf, not nested under spacing.0", () => {
    const preset = tailwindPresetSync({ cssPath: FIXTURE });
    const spacing = preset.theme?.tokens?.spacing as Record<string, unknown>;
    // Tailwind's `p-0.5` step. As a Panda token the key is literally "0.5",
    // not a nested {"0": {"5": ...}}.
    const leaf = spacing["0.5"] as { value: string };
    expect(typeof leaf?.value).toBe("string");
    expect(leaf.value).toContain("0.5");
  });
});

describe("tailwindPresetSync", () => {
  test("emits var() references in the preset", () => {
    const preset = tailwindPresetSync({ cssPath: FIXTURE });
    const colors = preset.theme?.tokens?.colors as Record<
      string,
      Record<string, { value: string }>
    >;
    expect(colors.brand?.["500"]?.value).toBe("var(--color-brand-500)");
    expect(colors.blue?.["500"]?.value).toBe("var(--color-blue-500)");
  });
});
