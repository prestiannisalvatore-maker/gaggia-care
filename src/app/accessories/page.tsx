import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { ACCESSORIES } from "@/data/accessories";

export default function AccessoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <PageIntro
        eyebrow="Bar kit"
        title="Accessories"
        description="The tools around the Classic E24 deserve the same quiet discipline as the machine — clean surfaces, dry storage, and no leftover milk or oils."
      />

      <div className="fade-up-delay mt-8">
        <Link
          href="/maintenance"
          className="text-sm font-medium text-copper underline decoration-copper/30 underline-offset-4"
        >
          Log weekly tool cleaning
        </Link>
      </div>

      <section className="mt-12 divide-y divide-[var(--line)] rounded-[28px] border border-[var(--line)] bg-white/70 px-6 shadow-[var(--shadow)]">
        {ACCESSORIES.map((item) => (
          <article key={item.id} className="grid gap-3 py-6 sm:grid-cols-[0.9fr_1.2fr_0.7fr] sm:gap-6">
            <div>
              <h2 className="display text-3xl text-espresso">{item.name}</h2>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-steam">
                {item.frequency}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">{item.role}</p>
            <p className="text-sm leading-relaxed text-ink-soft">{item.care}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
