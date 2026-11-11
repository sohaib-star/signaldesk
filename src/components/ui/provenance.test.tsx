// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PROVENANCE, ProvenanceLegend, ProvenanceMark } from "./provenance";

describe("provenance", () => {
  it("defines exactly four kinds with distinct glyphs", () => {
    const kinds = Object.values(PROVENANCE);
    expect(Object.keys(PROVENANCE)).toEqual([
      "fact",
      "derived",
      "estimate",
      "generated",
    ]);
    expect(new Set(kinds.map((k) => k.glyph)).size).toBe(kinds.length);
  });

  it("exposes the label, not the glyph, to assistive technology", () => {
    const { container } = render(<ProvenanceMark kind="estimate" />);
    expect(screen.getByText("Estimate")).toBeDefined();
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      "≈",
    );
  });

  it("renders a legend term for every kind", () => {
    render(<ProvenanceLegend />);
    for (const { label } of Object.values(PROVENANCE)) {
      expect(screen.getByText(label)).toBeDefined();
    }
  });
});
