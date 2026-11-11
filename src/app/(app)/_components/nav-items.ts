export type NavItem = {
  href: string;
  label: string;
  /** Two-digit section number, shown in the rail and page eyebrow. */
  index: string;
  /** One line: the question this section answers. */
  summary: string;
};

export const NAV_ITEMS = [
  {
    href: "/today",
    label: "Today",
    index: "01",
    summary: "What needs a decision now, and why",
  },
  {
    href: "/pipeline",
    label: "Pipeline",
    index: "02",
    summary: "Where revenue is moving, and where it is stuck",
  },
  {
    href: "/accounts",
    label: "Accounts",
    index: "03",
    summary: "Every company, contact, and interaction",
  },
  {
    href: "/reports",
    label: "Reports",
    index: "04",
    summary: "Defined metrics, compared over time",
  },
  {
    href: "/model",
    label: "Model",
    index: "05",
    summary: "How scores and recommendations are computed",
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
