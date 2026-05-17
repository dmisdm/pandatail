import { defineConfig } from "@pandacss/dev";
import { tailwindPresetSync } from "../../src";
import { join } from "node:path";

export default defineConfig({
  preflight: false,
  include: ["./src/**/*.{ts,tsx}"],
  presets: [
    tailwindPresetSync({ cssPath: join(__dirname, "tailwind.css") }),
  ],
  outdir: "styled-system",
  eject: true,
});
