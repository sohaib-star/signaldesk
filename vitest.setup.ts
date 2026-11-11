import { afterEach } from "vitest";

// Unmount React trees between tests. Only loaded when a DOM is present so
// Node-environment tests don't pull in Testing Library.
afterEach(async () => {
  if (typeof document === "undefined") return;
  const { cleanup } = await import("@testing-library/react");
  cleanup();
});
