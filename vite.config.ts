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
        functions: 95,
        lines: 50,
        branches: 60,
        statements: 50,
        perFile: true,
      },
    },
  },
});
