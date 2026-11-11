#!/usr/bin/env node
/**
 * Live visual and runtime QA sweep.
 *
 * Visits every route at several viewports in real Chromium against a running
 * server, records console errors, uncaught exceptions, failed requests,
 * horizontal overflow, clipped navigation and active-navigation state, and
 * saves full-page screenshots.
 *
 * Usage:  node scripts/qa-visual.mjs [baseUrl] [label]
 *   baseUrl  default http://localhost:3000
 *   label    output subfolder, default "run"
 *
 * Output: qa/<label>/screenshots/<viewport>/<route>.png and qa/<label>/results.json
 * (qa/ is gitignored). Exits non-zero if any check fails.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const label = process.argv[3] ?? "run";
const outDir = path.join("qa", label);

const ROUTES = [
  { path: "/today", nav: "Today" },
  { path: "/pipeline", nav: "Pipeline" },
  { path: "/accounts", nav: "Accounts" },
  { path: "/reports", nav: "Reports" },
  { path: "/model", nav: "Model" },
  { path: "/system", nav: null },
  { path: "/does-not-exist", nav: null, expectStatus: 404 },
];

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900, isMobile: false },
  { name: "tablet-768", width: 768, height: 1024, isMobile: true },
  { name: "mobile-390", width: 390, height: 844, isMobile: true },
  // WCAG 1.4.10 reflow: content must work at 320 CSS px.
  { name: "reflow-320", width: 320, height: 640, isMobile: true },
];

const results = [];
let failures = 0;

const browser = await chromium.launch();
try {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      deviceScaleFactor: vp.isMobile ? 2 : 1,
    });
    for (const route of ROUTES) {
      const page = await context.newPage();
      const consoleMessages = [];
      const pageErrors = [];
      const failedRequests = [];

      page.on("console", (msg) => {
        // Chromium logs any 4xx document response as a console error. For a
        // route whose 404 is the expected outcome, that one line is not a defect.
        const expectedStatusLog =
          route.expectStatus &&
          msg.text().includes(`status of ${route.expectStatus}`) &&
          msg.location().url === baseUrl + route.path;
        if (expectedStatusLog) return;
        if (msg.type() === "error" || msg.type() === "warning") {
          consoleMessages.push(`${msg.type()}: ${msg.text()}`);
        }
      });
      page.on("pageerror", (err) => pageErrors.push(String(err)));
      page.on("requestfailed", (req) =>
        failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`),
      );
      page.on("response", (res) => {
        const isDocument = res.request().resourceType() === "document";
        if (res.status() >= 400 && !(isDocument && route.expectStatus)) {
          failedRequests.push(`${res.status()} ${res.url()}`);
        }
      });

      const response = await page.goto(baseUrl + route.path, {
        waitUntil: "networkidle",
      });
      await page.evaluate(() => document.fonts.ready);

      const layout = await page.evaluate(() => {
        const doc = document.documentElement;
        const vw = doc.clientWidth;
        // Elements that extend past the viewport edge, excluding descendants
        // of intentionally scrollable containers.
        const offenders = [];
        for (const el of document.body.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          let scroller = el.parentElement;
          let inScroller = false;
          while (scroller) {
            const ox = getComputedStyle(scroller).overflowX;
            if (ox === "auto" || ox === "scroll" || ox === "hidden") {
              inScroller = true;
              break;
            }
            scroller = scroller.parentElement;
          }
          if (!inScroller && (r.right > vw + 1 || r.left < -1)) {
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} [${Math.round(r.left)}–${Math.round(r.right)}]`,
            );
          }
        }

        // Visible primary nav: are all links fully inside the viewport?
        const navs = [
          ...document.querySelectorAll('nav[aria-label="Primary"]'),
        ].filter((n) => n.offsetParent !== null);
        const nav = navs[0];
        const clippedNavLinks = nav
          ? [...nav.querySelectorAll("a")]
              .filter((a) => {
                const r = a.getBoundingClientRect();
                return r.right > vw + 1 || r.left < -1;
              })
              .map((a) => a.textContent)
          : [];
        const current = nav
          ? [...nav.querySelectorAll('[aria-current="page"]')].map(
              (a) => a.textContent,
            )
          : [];

        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: vw,
          horizontalOverflow: doc.scrollWidth > vw,
          offenders: offenders.slice(0, 10),
          visiblePrimaryNavs: navs.length,
          clippedNavLinks,
          current,
          title: document.title,
          h1: document.querySelector("h1")?.textContent ?? null,
        };
      });

      const slug = route.path.replace(/\//g, "") || "root";
      const shotDir = path.join(outDir, "screenshots", vp.name);
      await mkdir(shotDir, { recursive: true });
      const screenshot = path.join(shotDir, `${slug}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });

      const problems = [];
      const status = response?.status() ?? 0;
      if (status !== (route.expectStatus ?? 200))
        problems.push(`HTTP ${status}`);
      if (consoleMessages.length) problems.push("console messages");
      if (pageErrors.length) problems.push("page errors");
      if (failedRequests.length) problems.push("failed requests");
      if (layout.horizontalOverflow) problems.push("horizontal overflow");
      if (layout.offenders.length) problems.push("elements outside viewport");
      if (layout.clippedNavLinks.length) problems.push("clipped nav links");
      if (route.nav) {
        if (layout.visiblePrimaryNavs !== 1)
          problems.push(`${layout.visiblePrimaryNavs} visible primary navs`);
        const expected =
          layout.current.length === 1 && layout.current[0].endsWith(route.nav);
        if (!expected)
          problems.push(`active nav = ${JSON.stringify(layout.current)}`);
      }

      if (problems.length) failures++;
      results.push({
        viewport: vp.name,
        route: route.path,
        status,
        problems,
        consoleMessages,
        pageErrors,
        failedRequests,
        layout,
        screenshot,
      });
      console.log(
        `${problems.length ? "✗" : "✓"} ${vp.name.padEnd(13)} ${route.path.padEnd(16)} ${problems.join(", ")}`,
      );
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

await mkdir(outDir, { recursive: true });
await writeFile(
  path.join(outDir, "results.json"),
  JSON.stringify({ baseUrl, at: new Date().toISOString(), results }, null, 2),
);
console.log(
  `\n${results.length - failures}/${results.length} route×viewport checks clean. Results: ${outDir}/results.json`,
);
process.exit(failures ? 1 : 0);
