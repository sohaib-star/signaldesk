// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorkspaceError from "./error";

describe("WorkspaceError", () => {
  it("announces the failure and retries on request", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const retry = vi.fn();
    render(<WorkspaceError error={new Error("boom")} retry={retry} />);

    expect(screen.getByRole("alert")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("shows the server digest as a reference, never the message", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const error = Object.assign(new Error("secret internal detail"), {
      digest: "abc123",
    });
    render(<WorkspaceError error={error} retry={() => {}} />);

    expect(screen.getByText("Reference: abc123")).toBeDefined();
    expect(screen.getByText(/quote the reference below/)).toBeDefined();
    expect(screen.queryByText(/secret internal detail/)).toBeNull();
  });

  it("omits the reference line when there is no digest", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<WorkspaceError error="thrown string" retry={() => {}} />);
    expect(screen.queryByText(/Reference:/)).toBeNull();
    // Regression: the copy must not point to a reference that isn't shown.
    expect(screen.queryByText(/reference below/)).toBeNull();
  });
});
