"use client";

import Link from "next/link";
import { ManualReference } from "@/components/ManualReference";
import { StatusPill } from "@/components/StatusPill";
import { formatDisplayDate } from "@/lib/dates";
import { useCare } from "@/lib/store";

export function HomeDashboard() {
  const { hydrated, tasks, completeTask } = useCare();

  const attention = tasks.filter(
    (task) => task.status === "overdue" || task.status === "due_soon",
  );
  const nextScheduled = tasks
    .filter((task) => task.nextDue)
    .slice()
    .sort((a, b) => (a.nextDue ?? "").localeCompare(b.nextDue ?? ""))[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-steam">
            Care status
          </p>
          <h2 className="display mt-2 text-4xl text-espresso">
            What needs attention
          </h2>
        </div>
        <Link
          href="/maintenance"
          className="text-sm font-medium text-copper underline decoration-copper/30 underline-offset-4"
        >
          Open full schedule
        </Link>
      </div>

      <div className="mt-6">
        <ManualReference variant="compact" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6 shadow-[var(--shadow)]">
          {!hydrated ? (
            <p className="text-sm text-ink-soft">Loading your care log…</p>
          ) : attention.length === 0 ? (
            <div>
              <p className="display text-3xl text-espresso">All clear</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                Scheduled maintenance is on track. Keep purging the steam wand
                after every froth and wiping down after each session.
              </p>
              {nextScheduled?.nextDue ? (
                <p className="mt-4 text-sm text-steam">
                  Next up: {nextScheduled.title} on{" "}
                  {formatDisplayDate(nextScheduled.nextDue)}
                </p>
              ) : null}
            </div>
          ) : (
            <ul className="divide-y divide-[var(--line)]">
              {attention.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-espresso">{task.title}</p>
                      <StatusPill status={task.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      {task.nextDue
                        ? `Due ${formatDisplayDate(task.nextDue)}`
                        : task.frequencyLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => completeTask(task.id)}
                    className="rounded-full bg-espresso px-4 py-2 text-sm font-medium text-paper transition hover:bg-copper-deep"
                  >
                    Mark done
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              href: "/recipes",
              title: "Espresso recipes",
              body: "Log grind, dose, time, and yield — then refine toward superb.",
            },
            {
              href: "/descaling",
              title: "Descaling guide",
              body: "Every 2 months with Gaggia Descaler — official AU steps.",
            },
            {
              href: "/grinder",
              title: "HiBREW 5G care",
              body: "Burr brushing, deep cleans, and dialling-in after service.",
            },
            {
              href: "/settings",
              title: "Reminders",
              body: "Enable browser notifications before tasks fall overdue.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[24px] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-deep)_65%,white)] p-5 transition hover:border-copper/40 hover:bg-white"
            >
              <p className="display text-2xl text-espresso">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
