import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],

      thresholds: {
        functions: 50,
        lines: 70,
        branches: 65,
        statements: 55,
      },
    },
  },
});
