"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

const BOTTOM_LINKS = [
  { href: "/", label: "Home" },
  { href: "/maintenance", label: "Care" },
  { href: "/recipes", label: "Recipes" },
  { href: "/descaling", label: "Descale" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const moreActive = ["/machine", "/grinder", "/accessories", "/settings"].some(
    (href) => isActive(pathname, href),
  );

  function closeMore() {
    setMoreOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--paper)_92%,transparent)] backdrop-blur-md pt-[env(safe-area-inset-top)]">
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
              const active = isActive(pathname, link.href);
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
        </div>

        <nav
          aria-label="Section navigation"
          className="border-t border-[var(--line)] lg:hidden"
        >
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMore}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-sm transition-colors ${
                    active
                      ? "bg-espresso text-paper"
                      : "bg-white/70 text-ink-soft ring-1 ring-[var(--line)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <nav
        aria-label="Primary mobile"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[color-mix(in_oklab,var(--paper)_94%,transparent)] backdrop-blur-md lg:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-2">
          {BOTTOM_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMore}
                className={`flex min-h-12 flex-col items-center justify-center rounded-2xl px-1 text-[11px] font-medium transition ${
                  active ? "bg-espresso text-paper" : "text-ink-soft"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            className={`flex min-h-12 flex-col items-center justify-center rounded-2xl px-1 text-[11px] font-medium transition ${
              moreOpen || moreActive ? "bg-espresso text-paper" : "text-ink-soft"
            }`}
            aria-expanded={moreOpen}
            aria-controls="mobile-more-menu"
          >
            More
          </button>
        </div>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-espresso/35"
            onClick={() => setMoreOpen(false)}
          />
          <div
            id="mobile-more-menu"
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] border border-[var(--line)] bg-paper px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow)]"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-mist" />
            <p className="text-xs uppercase tracking-[0.18em] text-steam">
              More
            </p>
            <div className="mt-3 grid gap-2">
              {[
                { href: "/machine", label: "Machine" },
                { href: "/grinder", label: "Grinder" },
                { href: "/accessories", label: "Accessories" },
                { href: "/settings", label: "Reminders" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMore}
                  className={`rounded-2xl px-4 py-3.5 text-base transition ${
                    isActive(pathname, link.href)
                      ? "bg-espresso text-paper"
                      : "bg-white/80 text-espresso ring-1 ring-[var(--line)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
