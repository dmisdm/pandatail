import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { extractTokens, extractTokensFromFile } from "../src/extract";
import { tailwindPreset } from "../src/preset";

const FIXTURE = join(import.meta.dir, "fixtures/basic.css");

describe("extractTokens", () => {
  test("projects @theme entries into Panda categories", async () => {
    const tokens = await extractTokensFromFile(FIXTURE);

    const brand500 = tokens.find((t) => t.cssVar === "--color-brand-500");
    expect(brand500).toBeDefined();
    expect(brand500!.category).toBe("colors");
    expect(brand500!.path).toEqual(["brand", "500"]);

    const gutter = tokens.find((t) => t.cssVar === "--spacing-gutter");
    expect(gutter!.category).toBe("spacing");
    expect(gutter!.path).toEqual(["gutter"]);

    const pill = tokens.find((t) => t.cssVar === "--radius-pill");
    expect(pill!.category).toBe("radii");
    expect(pill!.path).toEqual(["pill"]);

    const font = tokens.find((t) => t.cssVar === "--font-display");
    expect(font!.category).toBe("fonts");
    expect(font!.path).toEqual(["display"]);
  });

  test("inline css works without file", async () => {
    const tokens = await extractTokens({
      css: `@import "tailwindcss"; @theme { --color-x-1: #fff; }`,
    });
    expect(tokens.some((t) => t.cssVar === "--color-x-1")).toBe(true);
  });
});

describe("tailwindPreset", () => {
  test("builds a Panda preset with var() references", async () => {
    const preset = await tailwindPreset({ cssPath: FIXTURE });

    const colors = preset.theme?.tokens?.colors as Record<string, unknown> | undefined;
    expect(colors).toBeDefined();
    const brand = (colors as Record<string, Record<string, { value: string }>>).brand;
    expect(brand["500"]?.value).toBe("var(--color-brand-500)");

    const radii = preset.theme?.tokens?.radii as Record<string, { value: string }>;
    expect(radii.pill?.value).toBe("var(--radius-pill)");
  });
});
