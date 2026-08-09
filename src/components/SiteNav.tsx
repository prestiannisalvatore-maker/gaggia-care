"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, PRIMARY_NAV } from "@/lib/nav";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
          <Link href="/" className="min-w-0">
            <span className="display block text-[1.7rem] leading-none text-ink">
              Gaggia Care
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {PRIMARY_NAV.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-[color-mix(in_oklab,var(--copper)_14%,white)] font-semibold text-ink"
                      : "text-steam hover:bg-paper hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <nav
        aria-label="Primary mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-2">
          {PRIMARY_NAV.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-h-[3.4rem] flex-col items-center justify-center gap-1 rounded-2xl px-1 transition ${
                  active ? "text-ink" : "text-steam"
                }`}
              >
                <span
                  className={`h-1 w-5 rounded-full transition ${
                    active ? "bg-copper" : "bg-transparent"
                  }`}
                />
                <span
                  className={`text-[12px] ${active ? "font-semibold" : "font-medium"}`}
                >
                  {link.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
