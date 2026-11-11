import { describe, expect, it } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cx(false, null)).toBe("");
  });
});
