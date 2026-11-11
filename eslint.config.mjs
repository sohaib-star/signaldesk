import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** Layers that must stay framework-free (src/lib may be used by src/domain). */
const PURE_LAYERS = ["src/domain", "src/lib"];

const PURE_MESSAGE =
  "src/domain and src/lib must stay framework-free: pure TypeScript only.";

const NO_JSX = ["JSXElement", "JSXFragment"].map((selector) => ({
  selector,
  message: `${PURE_MESSAGE} JSX belongs in src/components or src/app.`,
}));

/**
 * Matches relative import specifiers that pass through any of the given
 * directory names, e.g. "../app/x" or "../../server/db".
 */
function relativeInto(...dirs) {
  return `^\\.{1,2}/(?:.*/)?(?:${dirs.join("|")})(?:/|$)`;
}

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
  // Architecture boundary: src/domain (the future intelligence engine) and
  // src/lib (the helpers it may use) are pure TypeScript. They must not
  // depend on React, Next.js, the database, or any UI or server module, so
  // they stay deterministic and testable in isolation. Each restriction is
  // proven by src/architecture.test.ts.
  {
    files: PURE_LAYERS.map((dir) => `${dir}/**/*.{ts,tsx}`),
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "react",
                "react/*",
                "react-dom",
                "react-dom/*",
                "next",
                "next/*",
                "@next/*",
                "server-only",
                "client-only",
                "@supabase/*",
                "@/app/*",
                "@/components/*",
                "@/server/*",
              ],
              message: PURE_MESSAGE,
            },
            {
              // Relative paths into the same layers would otherwise bypass
              // the alias patterns above.
              regex: relativeInto("app", "components", "server"),
              message: PURE_MESSAGE,
            },
          ],
        },
      ],
      "no-restricted-syntax": ["error", ...NO_JSX],
    },
  },
  // Pure layers are .ts only. JSX needs no React import under the automatic
  // runtime, so the import ban alone cannot keep components out.
  {
    files: PURE_LAYERS.map((dir) => `${dir}/**/*.tsx`),
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message: `${PURE_MESSAGE} Use a .ts file.`,
        },
        ...NO_JSX,
      ],
    },
  },
  // Dependency direction: shared components must not reach into route
  // code. Routes compose components, never the reverse.
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*"],
              message: "Shared components must not import from src/app.",
            },
            {
              regex: relativeInto("app"),
              message: "Shared components must not import from src/app.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
