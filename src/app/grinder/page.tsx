import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { GRINDER } from "@/data/grinder";

export default function GrinderPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        eyebrow="Grinder"
        title={GRINDER.name}
        description={GRINDER.summary}
      />

      <div className="fade-up-delay mt-8">
        <Link
          href="/maintenance"
          className="text-sm font-medium text-copper underline decoration-copper/30 underline-offset-4"
        >
          Track grinder tasks on the schedule
        </Link>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {GRINDER.care.map((block) => (
          <div
            key={block.title}
            className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6"
          >
            <h2 className="display text-3xl text-espresso">{block.title}</h2>
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

      <section className="mt-12 rounded-[28px] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-deep)_70%,white)] p-6 sm:p-8">
        <h2 className="display text-3xl text-espresso">Dialling tips</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {GRINDER.tips.map((tip) => (
            <li key={tip} className="text-sm leading-relaxed text-ink-soft">
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
