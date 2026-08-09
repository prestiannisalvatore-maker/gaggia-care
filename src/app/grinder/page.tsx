import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { GRINDER } from "@/data/grinder";

export default function GrinderPage() {
  return (
    <PageShell
      eyebrow="Guide"
      title={GRINDER.name}
      description={GRINDER.summary}
      backHref="/guides"
      backLabel="All guides"
      actions={
        <Link
          href="/maintenance"
          className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-ink"
        >
          Track in Care
        </Link>
      }
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {GRINDER.care.map((block) => (
          <div
            key={block.title}
            className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6"
          >
            <h2 className="display text-3xl text-ink">{block.title}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-deep)_70%,white)] p-6 sm:p-8">
        <h2 className="display text-3xl text-ink">Dialling tips</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {GRINDER.tips.map((tip) => (
            <li key={tip} className="text-sm leading-relaxed text-ink-soft">
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
