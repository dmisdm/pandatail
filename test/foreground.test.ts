import { describe, expect, test } from "bun:test";
import { extractTokens } from "../src/extract";
import { tailwindPreset } from "../src/preset";

const SHADCN = `@import "tailwindcss";
@theme {
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-amber-500: #f59e0b;
}`;

describe("shadcn *-foreground tokens", () => {
  test("muted and muted-foreground are both flat leaves", async () => {
    const tokens = await extractTokens({ css: SHADCN });

    const muted = tokens.find((t) => t.cssVar === "--color-muted");
    const mutedFg = tokens.find((t) => t.cssVar === "--color-muted-foreground");

    expect(muted!.path).toEqual(["muted"]);
    expect(mutedFg!.path).toEqual(["muted-foreground"]);
  });

  test("a trailing numeric scale step still nests", async () => {
    const tokens = await extractTokens({ css: SHADCN });
    const amber = tokens.find((t) => t.cssVar === "--color-amber-500");
    expect(amber!.path).toEqual(["amber", "500"]);
  });
});

describe("preset survives shadcn paired tokens", () => {
  const THEME = `@import "tailwindcss";
@theme {
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #fef2f2;
  --color-sidebar-accent-foreground: #0f172a;
  --color-amber-500: #f59e0b;
}`;

  async function colorsOf() {
    const preset = await tailwindPreset({ css: THEME });
    return preset.theme?.tokens?.colors as Record<string, any>;
  }

  test("every X / X-foreground pair keeps both tokens, flat", async () => {
    const colors = await colorsOf();
    expect(colors.muted?.value).toBe("var(--color-muted)");
    expect(colors["muted-foreground"]?.value).toBe("var(--color-muted-foreground)");
    expect(colors.destructive?.value).toBe("var(--color-destructive)");
    expect(colors["destructive-foreground"]?.value).toBe(
      "var(--color-destructive-foreground)",
    );
  });

  test("multi-hyphen semantic names stay flat", async () => {
    const colors = await colorsOf();
    expect(colors["sidebar-accent-foreground"]?.value).toBe(
      "var(--color-sidebar-accent-foreground)",
    );
  });

  test("numeric scales still nest in the built preset", async () => {
    const colors = await colorsOf();
    expect(colors.amber?.["500"]?.value).toBe("var(--color-amber-500)");
  });

  test("a genuine leaf-vs-parent collision throws instead of clobbering", async () => {
    // `--color-brand` wants to be a leaf, `--color-brand-500` wants `brand`
    // to be a group. Panda can't represent both; surface it loudly.
    const css = `@import "tailwindcss";
@theme {
  --color-brand: #000;
  --color-brand-500: #111;
}`;
    await expect(tailwindPreset({ css })).rejects.toThrow(/brand/);
  });
});
