import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Honour the `@/*` alias from tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    // Pure logic (most tests, and all future `domain/` tests) runs in Node.
    // Component tests opt into the DOM with a `@vitest-environment jsdom` docblock.
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
});
