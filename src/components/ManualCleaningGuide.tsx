import { MANUAL_CLEANING } from "@/data/cleaning";
import { ManualReference } from "@/components/ManualReference";

export function ManualCleaningGuide() {
  return (
    <section id="manual-cleaning" className="scroll-mt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-steam">
            From the official manual · pp. {MANUAL_CLEANING.pages}
          </p>
          <h2 className="display mt-2 text-4xl text-espresso">
            {MANUAL_CLEANING.chapter}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
            {MANUAL_CLEANING.intro}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <ManualReference variant="compact" />
      </div>

      <div className="mt-10 space-y-8">
        {MANUAL_CLEANING.sections.map((section) => (
          <article
            key={section.id}
            id={section.id}
            className="scroll-mt-28 border-b border-[var(--line)] pb-8 last:border-b-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="display text-3xl text-espresso">{section.title}</h3>
              <p className="text-xs uppercase tracking-[0.16em] text-copper">
                {section.frequency}
              </p>
            </div>
            <ol className="mt-4 space-y-3">
              {section.steps.map((step, index) => (
                <li
                  key={`${section.id}-${index}`}
                  className="flex gap-4 text-sm leading-relaxed text-ink-soft"
                >
                  <span className="display shrink-0 text-lg text-copper">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-[28px] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-deep)_70%,white)] p-6">
        <h3 className="display text-2xl text-espresso">Related manual notes</h3>
        <ul className="mt-4 space-y-4">
          {MANUAL_CLEANING.generalCare.map((note) => (
            <li key={note.title}>
              <p className="font-medium text-espresso">{note.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-steam">
                {note.source}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {note.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
