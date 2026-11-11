import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Test artefacts:
    "playwright-report/**",
    "test-results/**",
    "qa/**",
  ]),
  // Architecture boundary: the intelligence engine is pure TypeScript. It must
  // not depend on React, Next.js, the database, or any UI/server module, so it
  // stays deterministic and testable in isolation.
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "react",
                "react-dom",
                "react/*",
                "next",
                "next/*",
                "@supabase/*",
                "@/app/*",
                "@/components/*",
                "@/server/*",
              ],
              message:
                "src/domain must stay framework-free: pure TypeScript only.",
            },
          ],
        },
      ],
    },
  },
  // Dependency direction: shared components and utilities must not reach
  // into route code. Routes compose components, never the reverse.
  {
    files: ["src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*"],
              message:
                "Shared components and lib must not import from src/app.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
