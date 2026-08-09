import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { ACCESSORIES } from "@/data/accessories";

export default function AccessoriesPage() {
  return (
    <PageShell
      eyebrow="Guide"
      title="Accessories"
      description="The tools around the Classic E24 deserve the same quiet discipline as the machine — clean surfaces, dry storage, and no leftover milk or oils."
      backHref="/guides"
      backLabel="All guides"
      actions={
        <Link
          href="/maintenance"
          className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-ink"
        >
          Log tool cleaning
        </Link>
      }
    >
      <section className="divide-y divide-[var(--line)] rounded-[1.75rem] border border-[var(--line)] bg-white px-4 sm:px-6">
        {ACCESSORIES.map((item) => (
          <article
            key={item.id}
            className="grid gap-3 py-5 sm:grid-cols-[0.9fr_1.2fr_0.7fr] sm:gap-6 sm:py-6"
          >
            <div>
              <h2 className="display text-2xl text-ink sm:text-3xl">
                {item.name}
              </h2>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-steam">
                {item.frequency}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">{item.role}</p>
            <p className="text-sm leading-relaxed text-ink-soft">{item.care}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
