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
]);

export default eslintConfig;
