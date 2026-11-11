# SignalDesk

Customer and pipeline intelligence with explainable, auditable recommendations.
Every score and recommendation is computed by a deterministic engine whose
formulas and inputs can be inspected. Language-model output, when added, is
always labelled and never produces a score or a ranking.

**Status: Milestone 0 (foundation).** The application shell, design system,
and tooling exist. No data source, authentication, or business logic is
connected yet, and no view shows sample data.

## Requirements

- Node.js 24 or later (`.nvmrc` pins 24, the CI and deploy target)
- npm

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The root redirects to **Today**. The design
system reference is at <http://localhost:3000/system>.

## Scripts

| Script                 | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Development server (Turbopack)                                 |
| `npm run build`        | Production build                                               |
| `npm run start`        | Serve the production build                                     |
| `npm run lint`         | ESLint (Next.js rules plus architecture boundaries)            |
| `npm run typecheck`    | Generate route types, then `tsc --noEmit`                      |
| `npm run format`       | Format with Prettier (sorts Tailwind classes)                  |
| `npm run format:check` | Verify formatting                                              |
| `npm test`             | Unit and component tests (Vitest)                              |
| `npm run test:watch`   | Vitest in watch mode                                           |
| `npm run test:e2e`     | End-to-end and accessibility tests (Playwright, needs a build) |
| `npm run check`        | Lint, format check, typecheck, and unit tests                  |

First-time end-to-end setup:

```bash
npx playwright install chromium
npm run build && npm run test:e2e
```

## Structure

```
src/
  app/
    (app)/               workspace shell layout and sections
      _components/       navigation and shell
      today/ pipeline/ accounts/ reports/ model/
      system/            design-system reference (not in navigation)
  components/
    brand/               wordmark
    ui/                  design-system primitives
  lib/                   small framework-free utilities
tests/e2e/               Playwright specs
```

Planned layers, introduced in later milestones: `src/domain/` (pure
intelligence engine, lint-enforced to be framework-free) and `src/server/`
(data access, auth, and server actions).

## Stack

Next.js 16 (App Router, Cache Components, Partial Prefetching), React 19,
TypeScript, Tailwind CSS 4 (via the Turbopack loader), Vitest, and Playwright.
Supabase (PostgreSQL) and the Claude API come in later milestones.
