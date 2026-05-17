import { describe, expect, test } from "bun:test";
import { extractTokens } from "../src/extract";

describe("default tailwind theme", () => {
  test("picks up built-in color palette", async () => {
    const tokens = await extractTokens({
      css: `@import "tailwindcss";`,
    });

    const blue500 = tokens.find((t) => t.cssVar === "--color-blue-500");
    expect(blue500).toBeDefined();
    expect(blue500!.category).toBe("colors");
    expect(blue500!.path).toEqual(["blue", "500"]);

    const red50 = tokens.find((t) => t.cssVar === "--color-red-50");
    expect(red50).toBeDefined();
  });

  test("picks up built-in radius, shadow, font-weight scales", async () => {
    const tokens = await extractTokens({ css: `@import "tailwindcss";` });

    const radiusMd = tokens.find((t) => t.cssVar === "--radius-md");
    expect(radiusMd?.category).toBe("radii");

    const shadowLg = tokens.find((t) => t.cssVar === "--shadow-lg");
    expect(shadowLg?.category).toBe("shadows");

    const bold = tokens.find((t) => t.cssVar === "--font-weight-bold");
    expect(bold?.category).toBe("fontWeights");
    expect(bold?.path).toEqual(["bold"]);
  });
});
