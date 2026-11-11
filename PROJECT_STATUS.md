# SignalDesk — Project Status

_Last updated: 2026-11-10_

## Overview

SignalDesk is a customer and pipeline intelligence application. Its central
idea: every score, ranking, and recommendation is produced by a deterministic,
inspectable engine, and every value on screen is labelled by provenance
(**fact**, **derived**, **estimate**, or **generated**). Language-model output,
when added, is always labelled and never produces a score or ranking.

## Current milestone

**Milestone 0 — Foundation: complete and stabilised.** Milestone 1 has not
been started and requires explicit approval.

| Item                      | Value                                                           |
| ------------------------- | --------------------------------------------------------------- |
| Branch                    | `milestone-0` (not pushed; `main` still at the template commit) |
| Milestone 0 commit        | `2fafc67`                                                       |
| Last verified code commit | `121bad2` (all checks in QA_REPORT.md were run at this commit)  |
| Documentation commit      | the commit adding this file, directly after `121bad2`           |

## Architecture

- **Next.js 16 App Router** with `cacheComponents` (Partial Prerendering) and
  `partialPrefetching` enabled. All current routes prerender as static HTML.
- **Three-layer separation**, enforced by ESLint `no-restricted-imports`:
  - `src/domain/` (planned, Milestone 3): pure TypeScript intelligence engine.
    Lint forbids React, Next.js, Supabase, `@/app`, `@/components`,
    `@/server` imports.
  - `src/server/` (planned, Milestone 1): data access, auth, server actions.
  - `src/app/` + `src/components/`: presentation. `src/components` and
    `src/lib` may not import from `src/app`.
- **Client components are minimal** (3): `nav-links.tsx` (reads the pathname),
  `error.tsx`, `global-error.tsx`. Everything else is a Server Component.
- **Navigation state** is read with `usePathname` inside a `Suspense` boundary
  whose fallback is the same list with no active item. Required by Cache
  Components once dynamic segments (e.g. `/accounts/[id]`) exist.
- **Design tokens** live only in `src/app/globals.css` (`@theme`); Tailwind's
  default palette is disabled (`--color-*: initial`). A unit test fails if
  the `/system` reference drifts from the stylesheet.
- **Security headers** are set for every route in `next.config.ts`.

## Directory structure

```
.github/workflows/ci.yml      CI: lint, format, typecheck, unit, build, E2E
scripts/qa-visual.mjs         live route × viewport QA sweep (screenshots → qa/)
src/
  app/
    layout.tsx                root layout: fonts, metadata, viewport
    page.tsx                  redirects / → /today
    not-found.tsx             404
    global-error.tsx          boundary for root-layout failures
    icon.svg                  favicon
    globals.css               design tokens
    (app)/                    workspace shell
      layout.tsx              rail (desktop) + header strip (mobile) + main
      error.tsx               workspace error boundary with retry
      _components/            nav-items, nav-links, shell
      today/ pipeline/ accounts/ reports/ model/   section pages
      system/                 design-system reference (not in nav)
  components/
    brand/wordmark.tsx
    ui/                       page-header, page-body, view-blueprint,
                              provenance, question-list
  lib/                        cx, error-digest
tests/e2e/                    Playwright: shell.spec.ts, quality.spec.ts
qa/                           (gitignored) QA screenshots and results
```

## Dependencies

Runtime (3): `next` 16.4.6, `react` 19.3.0, `react-dom` 19.3.0.

Development (installed versions):

| Package                                | Version                   | Purpose                                |
| -------------------------------------- | ------------------------- | -------------------------------------- |
| typescript                             | 5.9.3                     | types                                  |
| tailwindcss / @tailwindcss/turbopack   | 4.3.3                     | styling (Turbopack loader, no PostCSS) |
| eslint / eslint-config-next            | 9.39.5 / 16.4.6           | linting                                |
| prettier / prettier-plugin-tailwindcss | 3.9.10 / 0.8.1            | formatting, class order                |
| vitest / @vitejs/plugin-react          | 5.1.0 / 6.3.0             | unit and component tests               |
| jsdom                                  | 31.0.0                    | DOM for component tests                |
| @testing-library/react / dom           | 16.3.3 / 10.4.2           | component tests                        |
| @playwright/test                       | 1.65.0                    | E2E                                    |
| @axe-core/playwright                   | 4.14.0                    | accessibility scans                    |
| @types/node / react / react-dom        | 24.19.2 / 19.3.0 / 19.3.0 | types                                  |

Node: `.nvmrc` pins **24** (CI and Vercel target); `engines` is `>=24`.
Verified on Node 24.22.2 (clean clone) and Node 26.3.0 (local).

## Completed functionality (Milestone 0)

- Workspace shell: ink navigation rail (≥1024px), header with section strip
  (<1024px), skip link, active-section marking (also in forced-colors mode).
- Sections: Today, Pipeline, Accounts, Reports, Model. Each states plainly
  that no data source is connected and lists its planned contents. **No
  sample, placeholder, or fabricated data anywhere.**
- Planned differentiators recorded in the UI: scoring laboratory (Model),
  evidence explorer (Today), scenario simulator (Pipeline).
- Provenance convention (fact / derived / estimate / generated) with marks
  and legend.
- `/system` design-system reference: colour tokens, contrast rules, type
  specimen, provenance marks.
- 404 page, workspace error boundary with retry and digest reference,
  global error boundary.
- Tooling: lint (with architecture boundaries), Prettier, typecheck, Vitest,
  Playwright + axe at three viewports, CI workflow, live QA sweep script.

## Remaining work

Milestones 1–7 as approved: data model and auth (M1), workspace CRUD (M2),
intelligence engine (M3), Today queue (M4), reports (M5), Claude layer (M6),
hardening and deploy (M7). Must-preserve features: interactive scoring
laboratory, evidence explorer, scenario simulator (never writes real data).

## Known technical risks

1. **Cache Components is new.** Authenticated routes read cookies, which must
   sit behind `Suspense`; instant-navigation validation will flag them. The
   bundled guide `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`
   describes the pattern (`'use cache: private'`).
2. **Supabase SSR docs assume `middleware.ts`.** Next 16 renamed it to
   `proxy.ts`; Proxy may only do optimistic redirects.
3. **CSP is partial.** `script-src` is not restricted (nonces would force
   dynamic rendering). Revisit in M1 when routes become dynamic anyway.
4. **Dev-tool advisory:** `minimatch` (moderate ReDoS) via `typescript-eslint`;
   no upstream fix yet. Lint-time only. See QA_REPORT.md.
5. **CI has not run on GitHub** (nothing pushed). The pipeline was reproduced
   locally in a clean clone on Node 24 and passed every stage.
6. **No Docker or Supabase CLI on this machine.** Blocks the local-database
   workflow for M1 until one is chosen (see readiness review).

## Running the project

```bash
nvm use               # optional: Node 24 per .nvmrc (Node ≥24 works)
npm install
npm run dev           # http://localhost:3000 → redirects to /today
```

Production build:

```bash
npm run build
npm run start         # http://localhost:3000
```

## Running tests and checks

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run typecheck     # next typegen && tsc --noEmit
npm test              # Vitest: unit + component (47 tests)
npm run check         # all four of the above

npx playwright install chromium     # first time only
npm run build && npm run test:e2e   # Playwright + axe, 3 viewports (66 tests)

# Live visual sweep against a running server (screenshots → qa/<label>/)
npm run qa:visual -- http://localhost:3000 my-run
QA_BROWSER=webkit npm run qa:visual -- http://localhost:3000 my-run-webkit
```

---

## Milestone 1 plan (not started)

**Objective:** a real, multi-tenant data foundation: schema, Row Level
Security, authentication, generated types, and a deterministic demo dataset.
No UI beyond sign-in and the data-source status.

| Area               | Deliverable                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Supabase           | `supabase/` project config, migrations in SQL, local stack for development and CI                                 |
| Schema             | organizations, memberships, accounts, contacts, pipeline_stages, deals, deal_stage_history, activities, audit_log |
| Isolation          | `org_id` on every tenant table; RLS enabled and forced; composite foreign keys                                    |
| Auth               | Supabase Auth (email OTP or magic link), `proxy.ts` session refresh, DAL session checks                           |
| Server layer       | `src/server/db` (clients, generated types), `src/server/auth`, `src/server/dal`, `server-only`                    |
| Validation         | Zod schemas for every action input and for environment variables                                                  |
| Seed               | deterministic, scenario-based generator with fixed seed; clearly a demo organisation                              |
| Tests              | RLS isolation tests, DAL tests against local DB, E2E sign-in                                                      |
| Definition of done | user A cannot read or write org B (proven by tests); types regenerate cleanly; CI runs DB tests                   |

## Milestone 1 readiness review — missing requirements and recommendations

_Recommendations only. Nothing below has been implemented._

### Decisions needed from you before starting

1. **Local database runtime.** Docker and the Supabase CLI are not installed
   here. Options: install Docker Desktop / OrbStack / Colima plus the
   Supabase CLI (recommended: migrations and RLS tests run locally and in
   CI), or use a hosted Supabase development project (simpler setup, but RLS
   tests then need network access and a disposable project).
2. **Demo access for reviewers.** A portfolio app needs a way in without
   registration. Recommend a read-only demo organisation with a one-click
   demo session, separate from real sign-up.
3. **Sign-up policy.** Open sign-up creating a personal organisation, or
   invite-only. Recommend open sign-up with personal org; invites later.
4. **Currency and time zone.** Recommend one currency per organisation and an
   organisation time zone that defines "today".

### Supabase setup

- Keep the schema in `supabase/migrations/*.sql`; never edit an applied
  migration. Seed data comes from a script, not migrations.
- Supabase now offers publishable/secret API keys alongside the legacy
  anon/service-role keys. Confirm the current recommendation in Supabase's
  docs at implementation time and use the server-only secret key exclusively
  in seed scripts, never in request handling.

### Schema and organisation isolation

- Every tenant table carries `org_id uuid not null`.
- **Gap in the original proposal:** a single-column foreign key such as
  `deals.account_id → accounts.id` does not stop a deal in org A from
  referencing an account in org B. Use composite keys: `unique (org_id, id)`
  on parents, `foreign key (org_id, account_id) references accounts (org_id, id)`
  on children.
- Money as `bigint` minor units plus `currency char(3)`; `check (amount >= 0)`.
- All timestamps `timestamptz`. Enumerations as Postgres enums or checked
  text.
- Write `deal_stage_history` with a trigger on `deals.stage_id` change, so
  history cannot be skipped by application code.
- Index `(org_id, …)` on every frequently filtered column.

### Row Level Security

- `enable` and `force row level security` on every tenant table; no policy
  means deny.
- One helper, `private.is_member(org uuid)`, `security definer`,
  `set search_path = ''`, in a schema not exposed through the API.
- Use `(select auth.uid())` in policies so Postgres evaluates it once per
  statement.
- Separate policies per command (`select`, `insert`, `update`, `delete`);
  `with check` on writes so rows cannot be moved to another org.
- Revoke table privileges from `anon`.

### Authentication and authorisation

- `proxy.ts` refreshes the Supabase session cookie and redirects
  unauthenticated users. Real authorisation happens in the DAL
  (`requireMember(orgId)`) on every read and action, with RLS as defence in
  depth.
- With Cache Components, session reads go inside `Suspense`; follow the
  bundled authentication-with-cache-components guide.
- Roles: `owner`, `member`. Decide now which actions are owner-only
  (recommended: editing pipeline stages and, later, the scoring model).

### Validation

- Zod schema per Server Action input; actions return a typed result and never
  throw to the client.
- Validate environment variables once at startup with Zod, in a
  `server-only` module, failing fast with a clear message.
- Mirror critical rules as database constraints, not only in Zod.

### Audit logging

- `audit_log (org_id, actor_id, action, target_type, target_id, diff jsonb, at)`.
- Write from the DAL for user-intent events (stage change, dismissal);
  triggers for invariants (stage history).
- Insert-only for members; no update or delete policies.

### Migrations and generated types

- `supabase gen types typescript --local > src/server/db/database.types.ts`,
  committed.
- CI regenerates types and fails if `git diff` is non-empty, so schema and
  types cannot drift.
- CI resets the local database from migrations and seed before DB tests.

### Testing strategy

- RLS isolation tests: two users, two organisations; assert every table
  denies cross-org select, insert, update, and delete. These are the most
  important tests of the milestone.
- DAL tests against the local database.
- Seed determinism test: same seed, same rows (hash comparison).
- E2E: sign-in, sign-out, unauthenticated redirect, demo session.

### Environment configuration

- Add `.env.example` (already permitted by `.gitignore`) listing variable
  names only, never values.
- Expose to the browser only the Supabase URL and publishable key
  (`NEXT_PUBLIC_*`); everything else server-only.
- Vercel: separate environment variables for Preview and Production.

### Engineering requirements still missing

- Structured server logging (request id, org id, no PII).
- Rate limiting for future AI endpoints (M6).
- Nonce-based CSP once routes are dynamic.
- Error-reporting service (currently `console.error`).
- Branch protection and required CI checks once the repository is pushed.
