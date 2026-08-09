import { ManualReference } from "@/components/ManualReference";
import { PageIntro } from "@/components/PageIntro";
import { MACHINE } from "@/data/machine";

export default function MachinePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <PageIntro
        eyebrow="The machine"
        title={MACHINE.name}
        description={MACHINE.summary}
      />

      <div className="fade-up-delay mt-8">
        <ManualReference />
      </div>

      <section className="fade-up-delay mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div>
            <h2 className="display text-3xl text-espresso">
              Why it earns the counter
            </h2>
            <div className="mt-6 divide-y divide-[var(--line)]">
              {MACHINE.highlights.map((item) => (
                <div key={item.title} className="py-5 first:pt-0">
                  <h3 className="text-lg font-medium text-espresso">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="display text-3xl text-espresso">Daily ritual</h2>
            <ol className="mt-6 space-y-3">
              {MACHINE.dailyRitual.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 text-sm leading-relaxed text-ink-soft"
                >
                  <span className="display text-xl text-copper">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="display text-3xl text-espresso">
              {MACHINE.brewGroupCleaning.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {MACHINE.brewGroupCleaning.intro} Full steps from the AU manual are
              on the{" "}
              <a
                href="/maintenance#brew-group"
                className="font-medium text-copper underline decoration-copper/30 underline-offset-4"
              >
                Cleaning and maintenance
              </a>{" "}
              page.
            </p>
          </div>
        </div>

        <aside className="h-fit space-y-6">
          <div className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6 shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.18em] text-steam">
              Specs at a glance
            </p>
            <dl className="mt-6 space-y-4">
              {MACHINE.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3"
                >
                  <dt className="text-sm text-steam">{spec.label}</dt>
                  <dd className="text-right text-sm font-medium text-espresso">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-deep)_70%,white)] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-steam">
              Front-panel map
            </p>
            <ul className="mt-4 space-y-2">
              {MACHINE.controls.map((control) => (
                <li
                  key={control.id}
                  className="flex gap-3 text-sm text-ink-soft"
                >
                  <span className="display w-6 text-copper">{control.id}</span>
                  <span>{control.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-steam">
              Numbering follows the overview diagram in the official AU manual.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
