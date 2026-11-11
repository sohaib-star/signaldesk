import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { ActiveNavLinks, NavLinks } from "./nav-links";

/**
 * Desktop navigation rail (lg and up). The outer column carries the ink
 * background for the full height of the grid; the inner panel stays pinned
 * to the viewport while the page scrolls.
 */
export function Rail() {
  return (
    <div className="hidden border-r border-ink-rule bg-ink text-paper lg:block">
      <RailPanel />
    </div>
  );
}

function RailPanel() {
  return (
    <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto">
      <Link
        href="/today"
        className="block px-5 pt-6 pb-9"
        aria-label="SignalDesk home"
      >
        <Wordmark />
      </Link>

      <nav aria-label="Primary">
        <p className="px-5 pb-2 font-mono text-eyebrow text-graphite-400 uppercase">
          Workspace
        </p>
        <Suspense fallback={<NavLinks pathname={null} variant="rail" />}>
          <ActiveNavLinks variant="rail" />
        </Suspense>
      </nav>

      <div className="mt-auto border-t border-ink-rule px-5 py-5">
        <DataSourceStatus />
      </div>
    </div>
  );
}

/** Compact header with a scrollable section strip (below lg). */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-10 bg-ink text-paper lg:hidden">
      <div className="flex h-12 items-center justify-between px-4">
        <Link href="/today" aria-label="SignalDesk home">
          <Wordmark />
        </Link>
        <span className="font-mono text-eyebrow text-graphite-400 uppercase">
          Not connected
        </span>
      </div>
      <nav aria-label="Primary" className="border-t border-ink-rule">
        <Suspense fallback={<NavLinks pathname={null} variant="strip" />}>
          <ActiveNavLinks variant="strip" />
        </Suspense>
      </nav>
    </header>
  );
}

/**
 * States plainly that no data is connected. Until Milestone 1 nothing in the
 * workspace is backed by records, and the UI must not imply otherwise.
 */
function DataSourceStatus() {
  return (
    <div>
      <p className="font-mono text-eyebrow text-graphite-400 uppercase">
        Data source
      </p>
      <p className="mt-1.5 flex items-center gap-2 text-sm text-paper">
        <span
          aria-hidden="true"
          className="size-2 border border-graphite-400"
        />
        Not connected
      </p>
      <p className="mt-2 text-xs leading-relaxed text-graphite-400">
        No data has been added yet. Nothing you see here is sample data.
      </p>
    </div>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:text-sm focus:text-ink"
    >
      Skip to content
    </a>
  );
}
