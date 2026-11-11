export type NavItem = {
  href: string;
  label: string;
  /** Two-digit section number, shown in the rail and page eyebrow. */
  index: string;
  /** Short label shown after the index in the page eyebrow. */
  summary: string;
};

export const NAV_ITEMS = [
  {
    href: "/today",
    label: "Today",
    index: "01",
    summary: "Your priorities",
  },
  {
    href: "/pipeline",
    label: "Pipeline",
    index: "02",
    summary: "Open deals",
  },
  {
    href: "/accounts",
    label: "Accounts",
    index: "03",
    summary: "Companies and contacts",
  },
  {
    href: "/reports",
    label: "Reports",
    index: "04",
    summary: "Performance over time",
  },
  {
    href: "/model",
    label: "Model",
    index: "05",
    summary: "How scoring works",
  },
] as const satisfies readonly NavItem[];

export type NavHref = (typeof NAV_ITEMS)[number]["href"];

/** A section is active on its own path and on any path nested beneath it. */
export function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavItem(href: NavHref): NavItem {
  const item = NAV_ITEMS.find((candidate) => candidate.href === href);
  if (!item) throw new Error(`Unknown nav item: ${href}`);
  return item;
}
