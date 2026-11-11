# SignalDesk — Milestone 0 QA Report

_Date: 2026-11-10 · Branch: `milestone-0` · Verified at commit `121bad2`_

All results below are from commands actually run during this session. Counts
are copied from tool output, not estimated.

## Summary

| Check                                               | Result                                                     |
| --------------------------------------------------- | ---------------------------------------------------------- |
| Lint (`npm run lint`)                               | ✅ exit 0, no errors or warnings                           |
| Prettier (`npm run format:check`)                   | ✅ exit 0, all files formatted                             |
| TypeScript (`npm run typecheck`)                    | ✅ exit 0                                                  |
| Unit tests (Vitest, Node)                           | ✅ 37 / 37                                                 |
| Component tests (Vitest, jsdom)                     | ✅ 10 / 10                                                 |
| E2E + accessibility (Playwright)                    | ✅ 66 / 66 (22 tests × 3 viewports), 0 skipped             |
| E2E flakiness run (`--repeat-each=3`)               | ✅ 189 / 189 (run before the forced-colors test was added) |
| Production build                                    | ✅ exit 0, 9 routes, all static                            |
| Live sweep: dev server, Chromium                    | ✅ 28 / 28 route × viewport checks clean                   |
| Live sweep: production, Chromium / Firefox / WebKit | ✅ 28 / 28 each                                            |
| CI pipeline reproduced on Node 24 in a clean clone  | ✅ every stage passed                                      |
| Production dependency vulnerabilities               | ✅ 0                                                       |
| Dev dependency vulnerabilities                      | ⚠️ 7 moderate, one root cause, no upstream fix (see below) |

## Environment

- macOS (Darwin 24.2.0), Node 26.3.0, npm 11.16.0 (local)
- Node 24.22.2 (CI simulation, via `npx node@24`)
- Browsers (Playwright 1.65.0): Chromium headless shell 158.0.8127.18,
  Firefox 159.0, WebKit 27.2
- Next.js 16.4.6 (Turbopack), React 19.3.0

## Commands executed and results

Git:

| Command                                  | Result                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| `git status`, `git branch -a`, `git log` | `main` only, one template commit, M0 changes uncommitted |
| `git switch -c milestone-0`              | branch created (did not previously exist)                |
| `git add -A && git commit`               | `2fafc67` Milestone 0 (44 files)                         |
| 7 further commits                        | stabilisation fixes, listed under "Bugs fixed"           |

Checks (final run at `121bad2`):

| Command                                                                                                     | Result                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                                                                              | exit 0                                                                                                                                                          |
| `npm run format:check`                                                                                      | exit 0 — "All matched files use Prettier code style!"                                                                                                           |
| `npm run typecheck`                                                                                         | exit 0 — "Types generated successfully", tsc clean                                                                                                              |
| `npx vitest run --reporter=verbose`                                                                         | exit 0 — "Test Files 7 passed (7), Tests 47 passed (47)"                                                                                                        |
| `npm run build`                                                                                             | exit 0 — "Compiled successfully"; routes `/`, `/_not-found`, `/accounts`, `/icon.svg`, `/model`, `/pipeline`, `/reports`, `/system`, `/today`, all `○ (Static)` |
| `npm run test:e2e`                                                                                          | exit 0 — "66 passed"                                                                                                                                            |
| `npx playwright test --repeat-each=3`                                                                       | "189 passed" (63 tests × 3; forced-colors test added afterwards)                                                                                                |
| `node scripts/qa-visual.mjs http://localhost:3000 final-dev`                                                | "28/28 route×viewport checks clean"                                                                                                                             |
| `QA_BROWSER={chromium,firefox,webkit} node scripts/qa-visual.mjs http://localhost:3100 final-prod-<engine>` | 28/28 clean for each engine                                                                                                                                     |
| `npm audit --omit=dev`                                                                                      | "found 0 vulnerabilities"                                                                                                                                       |
| `npm audit --json`                                                                                          | 7 moderate, 0 high, 0 critical (all dev)                                                                                                                        |
| `npm audit fix --dry-run`                                                                                   | would only add `fsevents`; does **not** resolve the advisory                                                                                                    |
| `npm ls --all`                                                                                              | exit 0, dependency tree consistent                                                                                                                              |
| Clean clone + Node 24.22.2: `npm ci`, `lint`, `format:check`, `typecheck`, `test`, `build`, `test:e2e`      | all passed; 47 unit, 66 E2E                                                                                                                                     |
| `npx js-yaml .github/workflows/ci.yml`                                                                      | valid; 11 steps in expected order                                                                                                                               |

## Unit and component tests (47)

| File                                           | Env   | Tests |
| ---------------------------------------------- | ----- | ----- |
| `src/app/(app)/_components/nav-items.test.ts`  | node  | 10    |
| `src/app/(app)/system/swatches.test.ts`        | node  | 18    |
| `src/lib/error-digest.test.ts`                 | node  | 7     |
| `src/lib/cx.test.ts`                           | node  | 2     |
| `src/app/(app)/_components/nav-links.test.tsx` | jsdom | 4     |
| `src/app/(app)/error.test.tsx`                 | jsdom | 3     |
| `src/components/ui/provenance.test.tsx`        | jsdom | 3     |

## E2E tests (22 tests × desktop 1440 / tablet 768 / mobile 390 = 66)

`tests/e2e/shell.spec.ts`: root redirect; navigation reaches every section
and marks exactly one current; "not connected" state shown; unknown route
returns 404 page; axe WCAG 2.0/2.1/2.2 A/AA scan on `/today`, `/pipeline`,
`/accounts`, `/reports`, `/model`, `/system`.

`tests/e2e/quality.spec.ts`: per route, no console errors or warnings, no
uncaught exceptions, no failed requests, no horizontal overflow (6 routes);
all five nav links fully visible at 320px; skip link is the first tab stop
and focuses `main`; nav operable by keyboard with a ≥2px solid focus ring;
security headers present and `X-Powered-By` absent; SVG icon served and
`/favicon.ico` gone; current-section marker survives forced-colors mode.

## Accessibility results

- axe-core: **0 violations** on all 6 content routes at all 3 viewports
  (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`).
- Reflow at 320px: no horizontal overflow; all navigation visible.
- Keyboard: skip link, tab order, visible focus ring, Enter activates links.
- Forced-colors (Windows High Contrast) emulation: current section marked.
- Contrast of every text colour pairing in use was computed. Lowest:
  signal-strong on paper 5.03:1 ("Error" label) and graphite-400 on
  ink-raised 5.18:1 (section number on the active rail row); all others
  ≥ 5.84:1. WCAG AA requires 4.5:1.
- **Not done:** manual screen-reader testing (VoiceOver/NVDA).

## Browser testing

The Claude in Chrome extension was not connected, so **all live browser
testing used Playwright driving real browser engines** (headless) against the
running application: the Next.js dev server on `localhost:3000` and the
production server (`next start`) on `localhost:3100`.

Routes: `/today`, `/pipeline`, `/accounts`, `/reports`, `/model`, `/system`,
`/does-not-exist`, plus `/` (redirect) in E2E.

Viewports: 1440×900 (desktop), 768×1024 (tablet), 390×844 (mobile),
320×640 (WCAG reflow).

Each sweep checks HTTP status, console errors/warnings, uncaught page errors,
failed requests (4xx/5xx), horizontal overflow, elements outside the
viewport, clipped navigation, exactly one visible primary nav, and correct
active section.

Interactions exercised: navigation clicks across all sections (all
viewports), keyboard Tab/Enter, skip link, 404 link, error boundary and
**Retry** (live, see below), client-side navigation after an error.

**Error boundary, live:** a temporary route that throws on the client was
added, exercised in the dev server, and deleted (never committed). Result:
boundary rendered inside the shell, navigation remained usable, Retry
re-rendered successfully. The first attempt used a flawed fixture
(module-level counter consumed by server rendering and React's automatic
re-render); the fixture was replaced with a deterministic one.

**Console errors:** none, except Chromium's own
`Failed to load resource: … 404` line when loading the intentional 404 page.
The sweep script ignores exactly that line for routes whose expected status
is 404. **Hydration warnings:** none (checked in dev, where React reports
them). **Network errors:** none.

**Performance (production, `/today`, local):** TTFB 18 ms, FCP 44 ms, load
65 ms; HTML 5,963 bytes gzipped; client navigation to `/pipeline` issued 0
requests (prefetched). Fonts: 168.6 KB → 136.7 KB after the italic fix.

## Visual QA

Screenshots of every route at every viewport were captured and inspected,
not only saved. Findings are listed under bugs 1–3 and 12–13. Final
production screenshots were reviewed in Chromium, Firefox, and WebKit;
rendering is consistent across engines. Dev-server screenshots show the
Next.js dev indicator ("N" badge), which is absent in production.

## Bugs discovered and fixed

| #   | Bug                                                                                 | Severity | Fix                                                      | Commit                                 |
| --- | ----------------------------------------------------------------------------------- | -------- | -------------------------------------------------------- | -------------------------------------- |
| 1   | "Model" clipped off the mobile nav strip at 320px (WCAG 1.4.10 reflow)              | High     | labels distributed evenly below `sm`; regression test    | `fa426a7`                              |
| 2   | Desktop rail ended at viewport height on long pages                                 | Medium   | ink background on full-height column, sticky inner panel | `fa426a7`                              |
| 3   | `/system` swatch grid showed grey filler cells and an overhanging border            | Medium   | borders on cells                                         | `fa426a7`                              |
| 4   | `/system` omitted 3 declared tokens; hex values duplicated without a check          | Low      | swatch module + drift test                               | `fa426a7`                              |
| 5   | Dead code: unused `dark` swatch field                                               | Low      | removed                                                  | `fa426a7`                              |
| 6   | Template Next.js favicon still served                                               | Medium   | `icon.svg` SignalDesk mark                               | `fa426a7` (deletion), `323f023` (icon) |
| 7   | No boundary for root-layout errors                                                  | Medium   | `global-error.tsx`                                       | `d2de651`                              |
| 8   | Error copy said "quote the reference below" with no reference shown                 | Low      | conditional copy; regression test                        | `d2de651`                              |
| 9   | No security headers; `X-Powered-By` exposed                                         | Medium   | headers + `poweredByHeader: false`; E2E test             | `323f023`                              |
| 10  | Fixed DOM id in `ViewBlueprint` would collide if reused                             | Low      | `useId`                                                  | `b763740`                              |
| 11  | README called the workspace "authenticated"                                         | Low      | corrected                                                | `b763740`                              |
| 12  | Newsreader italic preloaded but unused; Instrument Sans italic used but synthesised | Medium   | load the used italic only                                | `34e572b`                              |
| 13  | Current section indistinguishable in forced-colors mode                             | High     | markers drawn as borders; E2E test                       | `a89041e`                              |
| 14  | Own test gap: keyboard tests skipped on touch viewports                             | Low      | skip removed; now run on all 3                           | `77040a1`                              |

Also added: an ESLint rule forbidding `src/components` and `src/lib` from
importing `src/app` (`b763740`).

## Security audit

- Production dependencies: **0 vulnerabilities**.
- Development dependencies: **7 moderate**, one root cause:
  `minimatch` 10.2.6 (GHSA-g3hv-75wg-m249, ReDoS via glob patterns) required
  as `^10.2.2` by `@typescript-eslint/typescript-estree` 8.72.2, the latest
  release. `npm audit fix` cannot resolve it (dry run only adds `fsevents`).
  Forcing `minimatch@11` via `overrides` would put an undeclared major version
  under the parser. Risk is negligible: lint-time only, matching globs from
  this repository's own config. **Accepted; revisit when typescript-eslint
  updates.**
- Install scripts: only `fsevents` (optional, dev, macOS); npm 11's
  allow-scripts warning is harmless.
- Secrets: no `.env` files, no credentials in tracked files or history.
  `process.env` is read only for `CI` in `playwright.config.ts`.
- Server/client boundary: 3 client components; no server data crosses it.
- Headers: CSP (`frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
  `script-src` is deliberately unrestricted (see limitations).

## Copy revision (editorial pass)

Every visible string was rewritten to sound natural and speak to the user
directly. This covers page intros, nav eyebrows, margin notes, empty states,
the "coming to this page" lists, provenance descriptions, error screens, the
404 page, accessible labels and the site description. Functionality, layout,
and architecture are unchanged. No data, counts, or claims were added.

Examples:

| Where          | Before                                                                                                 | After                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Today intro    | A short, ranked list of the decisions that need you, each with the records and calculations behind it. | Here’s what needs your attention today.                                    |
| Pipeline intro | Every open deal by stage, with stalls and slipped dates marked against explicit thresholds.            | See where your deals stand and which ones are falling behind.              |
| Model intro    | The complete, inspectable definition of how SignalDesk scores accounts… Nothing is hidden behind it.   | See exactly how accounts are scored and why each recommendation appears.   |
| Today eyebrow  | 01 / What needs a decision now, and why                                                                | 01 / Your priorities                                                       |
| Margin heading | This view answers                                                                                      | Questions it answers                                                       |
| List heading   | Planned contents                                                                                       | Coming to this page                                                        |
| Model note     | Principle: Intelligence here is deterministic first…                                                   | How AI is used: Scores and rankings come from clear rules you can inspect… |
| Error heading  | This view failed to load                                                                               | This page didn’t load                                                      |
| 404 heading    | No such page                                                                                           | Page not found                                                             |

Technical terms are kept only where they explain a calculation, for example
_weighted value_. Design-reference details such as contrast ratios stay on
`/system`, the internal design reference.

Test updates were limited to string matches on copy that changed: the 404
heading in `tests/e2e/shell.spec.ts`, and the error-reference sentence in
`error.test.tsx`. No assertion was removed or loosened. The regression test
that the copy never mentions a reference that isn't shown still passes.

Results after the rewrite (all run on the final copy):

| Check                                           | Result                          |
| ----------------------------------------------- | ------------------------------- |
| `npm run check` (lint, format, typecheck, unit) | ✅ exit 0, 47 / 47 tests        |
| `npm run build`                                 | ✅ exit 0, 9 routes, all static |
| E2E + axe (Playwright, 3 viewports)             | ✅ 66 / 66                      |
| Live sweep, production, Chromium                | ✅ 28 / 28 clean                |
| Live sweep, dev server, Chromium                | ✅ 28 / 28 clean                |

The screenshots were reviewed manually at 1440 and 320, and line wrapping is
fine. Firefox and WebKit were not re-swept after this copy-only change.

## Remaining limitations

1. **No headed, real-device, or Claude in Chrome testing.** All browser
   testing was headless Playwright. Not tested on physical iOS/Android.
2. **`global-error.tsx` was not exercised.** Triggering it requires the root
   layout to fail; it is not unit tested either.
3. **CI has not run on GitHub.** The branch is not pushed; the pipeline was
   reproduced locally in a clean clone on Node 24.
4. **No manual screen-reader pass**; axe covers automatable rules only.
5. **Partial CSP**: a strict `script-src` needs nonces, which would make
   every route dynamic. Planned for when M1 makes routes dynamic.
6. **Dev-tool advisory** (`minimatch`) remains, as explained above.
7. **Commit grouping:** the favicon deletion landed in `fa426a7` instead of
   `323f023`, because it was already staged. The commits were not regrouped.
8. **Local warning:** a stray `~/package-lock.json` outside the repository
   makes Next.js print a root-detection warning. Harmless; not modified.

## Screenshot locations (gitignored, not committed)

| Folder                    | Contents                                                               |
| ------------------------- | ---------------------------------------------------------------------- |
| `qa/baseline-dev/`        | first sweep before fixes (shows bugs 1–3)                              |
| `qa/pass2-dev/`           | after layout fixes; `error-boundary.png`, `signal-row.png`             |
| `qa/final-dev/`           | final dev-server sweep                                                 |
| `qa/final-prod-chromium/` | final production sweep; `extra/` has forced-colors and italic evidence |
| `qa/final-prod-firefox/`  | final production sweep, Firefox                                        |
| `qa/final-prod-webkit/`   | final production sweep, WebKit                                         |
| `qa/copy-prod/`           | production sweep after the copy rewrite                                |
| `qa/copy-dev/`            | dev-server sweep after the copy rewrite                                |

Each sweep folder has `screenshots/<viewport>/<route>.png` and
`results.json` with per-check details.

## Final Git state

- Branch `milestone-0`. Last verified code commit **`121bad2`**. The
  documentation commit follows it. The final hash is reported in the
  hand-off message.
- Working tree clean after the documentation commit.
- Before the first push to GitHub, the author and committer email on all
  commits was changed from a personal address to the GitHub no-reply
  address, using `git filter-branch --env-filter`, with the owner's
  approval. File contents, messages and dates are unchanged. Every hash
  changed, and the hashes quoted in this report and in `PROJECT_STATUS.md`
  were updated to match. The copy revision is now `9145561`, previously
  `7124e38`.
