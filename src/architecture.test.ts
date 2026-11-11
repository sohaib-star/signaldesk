/**
 * Proves the architecture boundaries in eslint.config.mjs actually fire.
 * Code is linted from memory with a virtual file path, so no files are
 * created in src/domain (which does not exist until a later milestone).
 */
import { ESLint } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

let eslint: ESLint;

beforeAll(() => {
  eslint = new ESLint();
});

async function lint(filePath: string, code: string) {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.filter((m) => m.severity === 2);
}

async function violations(filePath: string, code: string) {
  const errors = await lint(filePath, code);
  return errors.filter(
    (m) =>
      m.ruleId === "no-restricted-imports" ||
      m.ruleId === "no-restricted-syntax",
  );
}

const useImport = (specifier: string) =>
  `import * as probe from "${specifier}";\nexport const used = probe;\n`;

const FORBIDDEN_IN_PURE_LAYERS = [
  // Frameworks and runtime markers
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "next",
  "next/link",
  "next/headers",
  "@next/env",
  "server-only",
  "client-only",
  "@supabase/supabase-js",
  // Other layers by alias
  "@/app/(app)/_components/nav-items",
  "@/components/ui/provenance",
  "@/server/db",
];

/** Relative paths reaching the same layers (gap 1). */
const RELATIVE_BYPASSES = [
  "../app/(app)/_components/nav-items",
  "../../app/layout",
  "../components/ui/provenance",
  "../server/db",
  "./nested/../../server/dal",
];

describe.each([
  { layer: "src/domain", file: "src/domain/scoring/probe.ts" },
  { layer: "src/lib", file: "src/lib/probe.ts" },
])("$layer stays framework-free", ({ file }) => {
  it.each(FORBIDDEN_IN_PURE_LAYERS)("blocks %s", async (specifier) => {
    expect(await violations(file, useImport(specifier))).toHaveLength(1);
  });

  it.each(RELATIVE_BYPASSES)("blocks relative path %s", async (specifier) => {
    expect(await violations(file, useImport(specifier))).toHaveLength(1);
  });

  it("blocks .tsx files even without JSX", async () => {
    const tsx = file.replace(/\.ts$/, ".tsx");
    const errors = await violations(tsx, "export const x = 1;\n");
    expect(errors.map((m) => m.message)).toEqual([
      expect.stringContaining("Use a .ts file."),
    ]);
  });

  it("blocks JSX elements and fragments", async () => {
    const tsx = file.replace(/\.ts$/, ".tsx");
    const code =
      "export const A = () => <div />;\nexport const B = () => <></>;\n";
    const messages = (await violations(tsx, code)).map((m) => m.message);
    expect(messages.filter((m) => m.includes("JSX belongs"))).toHaveLength(2);
  });

  it.each([
    "./weights",
    "../signals/recency",
    "@/lib/cx",
    "@/domain/scoring/model",
    "node:crypto",
  ])("allows pure import %s", async (specifier) => {
    // No errors of any kind, not just from the boundary rules.
    expect(await lint(file, useImport(specifier))).toEqual([]);
  });

  it("allows ordinary pure TypeScript", async () => {
    const code = [
      'import { cx } from "@/lib/cx";',
      "export type Weight = { signal: string; value: number };",
      "export function total(weights: readonly Weight[]): number {",
      "  return weights.reduce((sum, w) => sum + w.value, 0);",
      "}",
      "export const label = cx('a', 'b');",
      "",
    ].join("\n");
    expect(await lint(file, code)).toEqual([]);
  });
});

describe("src/components does not import route code", () => {
  const file = "src/components/ui/probe.tsx";

  it.each(["@/app/(app)/_components/nav-items", "../../app/layout"])(
    "blocks %s",
    async (specifier) => {
      expect(await violations(file, useImport(specifier))).toHaveLength(1);
    },
  );

  it.each(["react", "next/link", "@/lib/cx", "./page-header"])(
    "allows %s",
    async (specifier) => {
      expect(await violations(file, useImport(specifier))).toEqual([]);
    },
  );
});
