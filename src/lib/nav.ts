export const PRIMARY_NAV = [
  {
    href: "/",
    label: "Home",
    shortLabel: "Home",
    description: "Today’s overview",
  },
  {
    href: "/recipes",
    label: "Brew",
    shortLabel: "Brew",
    description: "Recipes & dialling",
  },
  {
    href: "/maintenance",
    label: "Care",
    shortLabel: "Care",
    description: "Calendar & cleaning",
  },
  {
    href: "/guides",
    label: "Guide",
    shortLabel: "Guide",
    description: "Machine & how-tos",
  },
] as const;

export const GUIDE_LINKS = [
  {
    href: "/descaling",
    label: "Descaling",
    description: "Official every-2-months process with Gaggia descaler.",
  },
  {
    href: "/machine",
    label: "Your Classic E24",
    description: "Machine overview, daily ritual, and brew-group clean.",
  },
  {
    href: "/grinder",
    label: "HiBREW 5G",
    description: "Keep the grinder clean so dialling stays predictable.",
  },
  {
    href: "/accessories",
    label: "Accessories",
    description: "Tamper, WDT, pitcher, and the rest of the bar kit.",
  },
  {
    href: "/settings",
    label: "Reminders & data",
    description: "Notifications, purchase date, and local reset.",
  },
] as const;

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/guides") {
    return (
      pathname === "/guides" ||
      GUIDE_LINKS.some((link) => pathname.startsWith(link.href))
    );
  }
  return pathname.startsWith(href);
}
