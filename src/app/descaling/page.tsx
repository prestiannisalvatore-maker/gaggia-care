import { DescaleCompleteButton } from "@/components/DescaleCompleteButton";
import { ManualReference } from "@/components/ManualReference";
import { PageShell } from "@/components/PageShell";
import { DESCALING_GUIDE } from "@/data/descaling";

export default function DescalingPage() {
  return (
    <PageShell
      eyebrow="Guide"
      title={DESCALING_GUIDE.title}
      description={DESCALING_GUIDE.intro}
      backHref="/guides"
      backLabel="All guides"
      actions={<DescaleCompleteButton />}
    >
      <p className="max-w-3xl text-sm text-ink-soft">
        {DESCALING_GUIDE.intervalNote}
      </p>

      <div className="mt-6">
        <ManualReference variant="compact" />
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6">
            <h2 className="display text-3xl text-ink">You will need</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
              {DESCALING_GUIDE.supplies.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-danger/20 bg-[color-mix(in_oklab,var(--danger)_8%,white)] p-6">
            <h2 className="display text-3xl text-ink">Before you start</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
              {DESCALING_GUIDE.warnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="display text-3xl text-ink">The process</h2>
          <ol className="mt-6 space-y-6">
            {DESCALING_GUIDE.steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="display text-3xl text-copper">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="border-b border-[var(--line)] pb-6">
                  <h3 className="text-xl font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-[1.75rem] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-deep)_70%,white)] p-6">
            <h3 className="display text-2xl text-ink">Aftercare</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              {DESCALING_GUIDE.aftercare.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
