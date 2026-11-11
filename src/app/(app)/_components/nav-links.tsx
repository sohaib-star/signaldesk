"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { NAV_ITEMS, isActive } from "./nav-items";

type Variant = "rail" | "strip";

const listStyles: Record<Variant, string> = {
  rail: "flex flex-col",
  strip: "flex overflow-x-auto px-2 [scrollbar-width:none]",
};

const linkStyles: Record<Variant, { base: string; active: string }> = {
  rail: {
    base: "relative flex items-baseline gap-3 px-5 py-2 text-[0.9375rem] text-graphite-300 transition-colors hover:bg-ink-raised hover:text-paper",
    active:
      "bg-ink-raised text-paper before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-paper",
  },
  strip: {
    base: "relative flex items-baseline gap-1.5 px-3 py-2.5 text-sm whitespace-nowrap text-graphite-300 transition-colors hover:text-paper",
    active:
      "text-paper after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-paper",
  },
};

/**
 * Presentational navigation list. Receives the pathname rather than reading
 * it, so it can also render as the Suspense fallback (no active item) while
 * the pathname is unresolved during prerendering.
 */
export function NavLinks({
  pathname,
  variant,
}: {
  pathname: string | null;
  variant: Variant;
}) {
  const styles = linkStyles[variant];
  return (
    <ul className={listStyles[variant]}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cx(styles.base, active && styles.active)}
            >
              <span
                aria-hidden="true"
                className={cx(
                  "font-mono text-eyebrow text-graphite-400",
                  // Narrow screens: drop numbers so all five sections fit.
                  variant === "strip" && "max-sm:hidden",
                )}
              >
                {item.index}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Navigation list that marks the current section. Wrap in Suspense. */
export function ActiveNavLinks({ variant }: { variant: Variant }) {
  const pathname = usePathname();
  return <NavLinks pathname={pathname} variant={variant} />;
}
