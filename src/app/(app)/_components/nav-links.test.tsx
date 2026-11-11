// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavLinks } from "./nav-links";

describe("NavLinks", () => {
  it("renders one link per section", () => {
    render(<NavLinks pathname="/today" variant="rail" />);
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  it("marks only the current section with aria-current", () => {
    render(<NavLinks pathname="/accounts/acc_42" variant="strip" />);
    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveProperty("textContent", "03Accounts");
    expect(current[0].getAttribute("href")).toBe("/accounts");
  });

  it("marks nothing while the pathname is unresolved (Suspense fallback)", () => {
    render(<NavLinks pathname={null} variant="rail" />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("aria-current")).toBeNull();
    }
  });

  it("hides section numbers from the accessible name", () => {
    render(<NavLinks pathname={null} variant="rail" />);
    expect(screen.getByRole("link", { name: "Pipeline" })).toBeDefined();
  });
});
