import { describe, expect, it } from "vitest";
import { errorDigest } from "./error-digest";

describe("errorDigest", () => {
  it("returns the digest of a server-forwarded error", () => {
    const error = Object.assign(new Error("An error occurred"), {
      digest: "4106423717",
    });
    expect(errorDigest(error)).toBe("4106423717");
  });

  it.each([
    ["a plain Error", new Error("boom")],
    ["a thrown string", "boom"],
    ["null", null],
    ["undefined", undefined],
    ["a non-string digest", { digest: 42 }],
    ["an empty digest", { digest: "" }],
  ])("returns null for %s", (_label, value) => {
    expect(errorDigest(value)).toBeNull();
  });
});
