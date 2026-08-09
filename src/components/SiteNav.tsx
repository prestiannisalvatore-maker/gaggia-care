"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/machine", label: "Machine" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/descaling", label: "Descaling" },
  { href: "/recipes", label: "Recipes" },
  { href: "/grinder", label: "Grinder" },
  { href: "/accessories", label: "Accessories" },
  { href: "/settings", label: "Reminders" },
];

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--paper)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex min-w-0 flex-col">
          <span className="display text-xl leading-none text-espresso transition-colors group-hover:text-copper sm:text-2xl">
            Gaggia Care
          </span>
          <span className="truncate text-[11px] uppercase tracking-[0.18em] text-steam">
            Classic E24 · Aug 2026
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-espresso text-paper"
                    : "text-ink-soft hover:bg-mist/70 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="lg:hidden">
          <label className="sr-only" htmlFor="mobile-nav">
            Navigate
          </label>
          <select
            id="mobile-nav"
            className="rounded-full border border-[var(--line)] bg-paper px-3 py-2 text-sm"
            value={
              LINKS.find((link) =>
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href),
              )?.href ?? "/"
            }
            onChange={(event) => {
              router.push(event.target.value);
            }}
          >
            {LINKS.map((link) => (
              <option key={link.href} value={link.href}>
                {link.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
