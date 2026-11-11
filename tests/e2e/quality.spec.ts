import { expect, test } from "@playwright/test";

const ROUTES = [
  "/today",
  "/pipeline",
  "/accounts",
  "/reports",
  "/model",
  "/system",
];

for (const path of ROUTES) {
  test(`${path} loads without console errors, exceptions, or overflow`, async ({
    page,
  }) => {
    const problems: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        problems.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
    page.on("response", (res) => {
      if (res.status() >= 400) problems.push(`${res.status()} ${res.url()}`);
    });

    await page.goto(path, { waitUntil: "networkidle" });

    expect(problems).toEqual([]);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test.describe("narrowest supported width (WCAG reflow, 320px)", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("every section link is fully visible without scrolling", async ({
    page,
  }) => {
    await page.goto("/today");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Today", "Pipeline", "Accounts", "Reports", "Model"]) {
      await expect(nav.getByRole("link", { name: label })).toBeInViewport({
        ratio: 1,
      });
    }
  });
});

test("skip link is the first tab stop and moves focus to main content", async ({
  page,
}) => {
  await page.goto("/today");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("primary navigation is operable by keyboard with a visible focus ring", async ({
  page,
}) => {
  await page.goto("/today");
  const pipeline = page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Pipeline" });

  // Tab until the Pipeline link has focus (skip link, wordmark, Today, Pipeline).
  for (
    let i = 0;
    i < 6 && !(await pipeline.evaluate((el) => el === document.activeElement));
    i++
  ) {
    await page.keyboard.press("Tab");
  }
  await expect(pipeline).toBeFocused();
  const outline = await pipeline.evaluate((el) => {
    const s = getComputedStyle(el);
    return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
  });
  expect(outline.style).toBe("solid");
  expect(outline.width).toBeGreaterThanOrEqual(2);

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/pipeline$/);
});

test("responses carry baseline security headers", async ({ request }) => {
  const res = await request.get("/today");
  const headers = res.headers();
  expect(headers["x-powered-by"]).toBeUndefined();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
});

test("serves the SignalDesk icon instead of the template favicon", async ({
  page,
  request,
}) => {
  await page.goto("/today");
  const href = await page
    .locator('link[rel="icon"]')
    .first()
    .getAttribute("href");
  expect(href).toMatch(/icon\.svg/);
  const icon = await request.get(href!);
  expect(icon.status()).toBe(200);
  expect(await icon.text()).toContain("#e8590c");
  expect((await request.get("/favicon.ico")).status()).toBe(404);
});

test.describe("forced-colors mode (Windows High Contrast)", () => {
  test.use({ forcedColors: "active" });

  test("the current section keeps a visible marker", async ({ page }) => {
    await page.goto("/pipeline");
    const current = page
      .getByRole("navigation", { name: "Primary" })
      .locator('[aria-current="page"]');
    // Forced colors strips backgrounds, so the marker must be a border.
    const marker = await current.evaluate((el) => {
      for (const pseudo of ["::before", "::after"]) {
        const s = getComputedStyle(el, pseudo);
        if (s.content === "none") continue;
        const width = Math.max(
          parseFloat(s.borderLeftWidth),
          parseFloat(s.borderBottomWidth),
        );
        const style =
          parseFloat(s.borderLeftWidth) > 0
            ? s.borderLeftStyle
            : s.borderBottomStyle;
        return { width, style };
      }
      return null;
    });
    expect(marker).not.toBeNull();
    expect(marker!.width).toBeGreaterThanOrEqual(2);
    expect(marker!.style).toBe("solid");
  });
});
