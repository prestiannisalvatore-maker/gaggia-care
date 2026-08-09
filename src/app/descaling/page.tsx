import Link from "next/link";
import { DescaleCompleteButton } from "@/components/DescaleCompleteButton";
import { ManualReference } from "@/components/ManualReference";
import { PageIntro } from "@/components/PageIntro";
import { DESCALING_GUIDE } from "@/data/descaling";

export default function DescalingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <PageIntro
        eyebrow="Primary maintenance"
        title={DESCALING_GUIDE.title}
        description={DESCALING_GUIDE.intro}
      />

      <p className="fade-up-delay mt-4 max-w-3xl text-sm text-ink-soft">
        {DESCALING_GUIDE.intervalNote}
      </p>

      <div className="fade-up-delay mt-8 flex flex-wrap gap-3">
        <DescaleCompleteButton />
        <Link
          href="/maintenance"
          className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-medium text-ink-soft transition hover:bg-mist/60"
        >
          Back to calendar
        </Link>
      </div>

      <div className="mt-8">
        <ManualReference />
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6">
            <h2 className="display text-3xl text-espresso">You will need</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
              {DESCALING_GUIDE.supplies.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-danger/20 bg-[color-mix(in_oklab,var(--danger)_8%,white)] p-6">
            <h2 className="display text-3xl text-espresso">Before you start</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
              {DESCALING_GUIDE.warnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="display text-3xl text-espresso">The process</h2>
          <ol className="mt-6 space-y-6">
            {DESCALING_GUIDE.steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="display text-3xl text-copper">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="border-b border-[var(--line)] pb-6">
                  <h3 className="text-xl font-medium text-espresso">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-[28px] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-deep)_70%,white)] p-6">
            <h3 className="display text-2xl text-espresso">Aftercare</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              {DESCALING_GUIDE.aftercare.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
