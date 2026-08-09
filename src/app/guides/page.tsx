import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { MACHINE } from "@/data/machine";
import { GUIDE_LINKS } from "@/lib/nav";

export default function GuidesPage() {
  return (
    <PageShell
      eyebrow="Library"
      title="Guides"
      description="Everything about the machine, descaling, grinder, and tools — kept here so Brew and Care stay focused."
    >
      <div className="grid gap-3">
        {GUIDE_LINKS.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-start justify-between gap-4 rounded-3xl border border-[var(--line)] bg-white px-5 py-5 transition hover:border-copper/35 hover:bg-[color-mix(in_oklab,var(--copper)_5%,white)]"
          >
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.16em] text-steam">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-ink group-hover:text-ink">
                {link.label}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {link.description}
              </p>
            </div>
            <span className="mt-1 text-steam transition group-hover:text-copper">
              →
            </span>
          </Link>
        ))}

        <a
          href={MACHINE.manual.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-4 rounded-3xl border border-[var(--line)] bg-white px-5 py-5 transition hover:border-copper/35"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-steam">
              Reference
            </p>
            <h2 className="mt-2 text-xl font-semibold text-ink">
              Official AU manual (PDF)
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {MACHINE.manual.citation}
            </p>
          </div>
          <span className="mt-1 text-steam transition group-hover:text-copper">
            →
          </span>
        </a>
      </div>
    </PageShell>
  );
}
