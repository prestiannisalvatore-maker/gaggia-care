"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/maintenance", label: "Calendar" },
  { href: "/recipes", label: "Recipes" },
  { href: "/descaling", label: "Descaling" },
  { href: "/machine", label: "Machine" },
  { href: "/grinder", label: "Grinder" },
  { href: "/accessories", label: "Accessories" },
  { href: "/settings", label: "Reminders" },
];

const BOTTOM_LINKS = [
  { href: "/", label: "Home" },
  { href: "/maintenance", label: "Calendar" },
  { href: "/recipes", label: "Recipes" },
  { href: "/descaling", label: "Descaling" },
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
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
          <Link href="/" className="min-w-0" onClick={closeMore}>
            <span className="display block text-[1.65rem] leading-none text-ink">
              Gaggia Care
            </span>
            <span className="mt-1 block text-[11px] tracking-[0.04em] text-steam">
              Classic E24 care & recipes
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm transition-colors ${
                    active
                      ? "font-semibold text-ink"
                      : "text-steam hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-[0.85rem] h-0.5 rounded-full bg-copper" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm font-medium text-ink xl:hidden"
            aria-expanded={moreOpen}
            aria-controls="site-menu"
          >
            Menu
          </button>
        </div>
      </header>

      {moreOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/20"
            onClick={closeMore}
          />
          <div
            id="site-menu"
            className="absolute inset-x-0 top-0 border-b border-[var(--line)] bg-white px-4 pb-5 pt-[calc(0.75rem+env(safe-area-inset-top))] shadow-[var(--shadow)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Browse</p>
              <button
                type="button"
                onClick={closeMore}
                className="min-h-10 rounded-xl px-3 text-sm text-steam"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMore}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-sm ${
                      active
                        ? "border-copper/40 bg-[color-mix(in_oklab,var(--copper)_10%,white)] font-semibold text-ink"
                        : "border-[var(--line)] bg-paper text-ink-soft"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 backdrop-blur-md xl:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 px-1 py-1.5">
          {BOTTOM_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMore}
                className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] transition ${
                  active ? "font-semibold text-ink" : "text-steam"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${
                    active ? "bg-copper" : "bg-transparent"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] transition ${
              moreOpen || moreActive ? "font-semibold text-ink" : "text-steam"
            }`}
            aria-expanded={moreOpen}
          >
            <span
              className={`h-1 w-1 rounded-full ${
                moreOpen || moreActive ? "bg-copper" : "bg-transparent"
              }`}
            />
            More
          </button>
        </div>
      </nav>
    </>
  );
}
