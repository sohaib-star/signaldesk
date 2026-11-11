import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SECTIONS = [
  { label: "Today", path: "/today" },
  { label: "Pipeline", path: "/pipeline" },
  { label: "Accounts", path: "/accounts" },
  { label: "Reports", path: "/reports" },
  { label: "Model", path: "/model" },
] as const;

test("root redirects to Today", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Today");
});

test("primary navigation reaches every section and marks it current", async ({
  page,
}) => {
  await page.goto("/today");
  // Only one of the two Primary navs (rail or mobile strip) is visible at a
  // time; hidden elements are excluded from the accessibility tree.
  const nav = page.getByRole("navigation", { name: "Primary" });

  for (const section of SECTIONS) {
    await nav.getByRole("link", { name: section.label }).click();
    await expect(page).toHaveURL(new RegExp(`${section.path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      section.label,
    );
    await expect(page).toHaveTitle(`${section.label} · SignalDesk`);
    await expect(
      nav.getByRole("link", { name: section.label }),
    ).toHaveAttribute("aria-current", "page");
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  }
});

test("views state plainly that no data is connected", async ({ page }) => {
  await page.goto("/pipeline");
  await expect(
    page.getByRole("heading", { name: "Not connected yet" }),
  ).toBeVisible();
});

test("unknown routes render the not-found page", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found",
  );
});

for (const path of [...SECTIONS.map((s) => s.path), "/system"]) {
  test(`${path} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
