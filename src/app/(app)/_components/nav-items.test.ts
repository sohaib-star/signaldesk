import { describe, expect, it } from "vitest";
import { NAV_ITEMS, getNavItem, isActive } from "./nav-items";

describe("NAV_ITEMS", () => {
  it("lists the five sections in the agreed order", () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      "Today",
      "Pipeline",
      "Accounts",
      "Reports",
      "Model",
    ]);
  });

  it("numbers sections sequentially and uses unique hrefs", () => {
    expect(NAV_ITEMS.map((item) => item.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
    expect(new Set(NAV_ITEMS.map((item) => item.href)).size).toBe(
      NAV_ITEMS.length,
    );
  });
});

describe("isActive", () => {
  it.each([
    ["/accounts", "/accounts", true],
    ["/accounts/acc_123", "/accounts", true],
    ["/accounts/acc_123/deals", "/accounts", true],
    ["/accountsx", "/accounts", false],
    ["/", "/accounts", false],
    ["/today", "/accounts", false],
  ])("pathname %s against %s → %s", (pathname, href, expected) => {
    expect(isActive(pathname, href)).toBe(expected);
  });

  it("treats an unresolved pathname as no active section", () => {
    expect(isActive(null, "/today")).toBe(false);
  });
});

describe("getNavItem", () => {
  it("returns the item for a known href", () => {
    expect(getNavItem("/model").label).toBe("Model");
  });
});
