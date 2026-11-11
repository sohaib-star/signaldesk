import { cx } from "@/lib/cx";

/**
 * The SignalDesk mark: a ledger with one flagged line. The orange stroke is
 * the only decorative use of signal orange in the product, and it stands for
 * the same thing as everywhere else: the line that needs attention.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 18 18"
        className="size-[1.125rem] shrink-0"
        fill="none"
      >
        <rect x="0.5" y="0.5" width="17" height="17" stroke="currentColor" />
        <path d="M4 5.5h10M4 12.5h10" stroke="currentColor" opacity="0.55" />
        <path d="M4 9h6.5" stroke="var(--color-signal)" strokeWidth="2" />
      </svg>
      <span className="font-display text-[1.3125rem] leading-none font-medium tracking-tight">
        SignalDesk
      </span>
    </span>
  );
}
