import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GRAPHITE, SIGNAL, SURFACES } from "./swatches";

const css = readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

function declaredColors(): Map<string, string> {
  const colors = new Map<string, string>();
  for (const match of css.matchAll(
    /--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi,
  )) {
    colors.set(match[1], match[2].toUpperCase());
  }
  return colors;
}

describe("design-system swatches", () => {
  const declared = declaredColors();
  const documented = [...SURFACES, ...GRAPHITE, ...SIGNAL];

  it.each(documented.map((s) => [s.token, s.hex]))(
    "--color-%s is %s in globals.css",
    (token, hex) => {
      expect(declared.get(token)).toBe(hex);
    },
  );

  it("documents every hex colour token declared in globals.css", () => {
    const documentedTokens = new Set(documented.map((s) => s.token));
    expect(
      [...declared.keys()].filter((t) => !documentedTokens.has(t)),
    ).toEqual([]);
  });
});
