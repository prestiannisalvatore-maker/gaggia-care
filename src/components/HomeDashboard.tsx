"use client";

import Link from "next/link";
import { MaintenanceCalendar } from "@/components/MaintenanceCalendar";
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
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      <section className="rounded-[28px] border border-[var(--line)] bg-[color-mix(in_oklab,white_72%,var(--paper))] p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-steam">
              This month
            </p>
            <h2 className="display mt-1 text-3xl text-ink sm:text-4xl">
              Your care calendar
            </h2>
          </div>
          <Link
            href="/maintenance"
            className="text-sm font-semibold text-copper underline decoration-copper/30 underline-offset-4"
          >
            Open full calendar
          </Link>
        </div>
        <MaintenanceCalendar compact />
      </section>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-steam">
              Attention
            </p>
            <h2 className="display mt-1 text-3xl text-ink">Needs action</h2>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6">
          {!hydrated ? (
            <p className="text-sm text-ink-soft">Loading your care log…</p>
          ) : attention.length === 0 ? (
            <div>
              <p className="text-lg font-semibold text-ink">All clear</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                Timed maintenance is on track. Keep purging the steam wand after
                every froth.
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
                      <p className="font-medium text-ink">{task.title}</p>
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
                    className="min-h-11 rounded-xl bg-ink px-4 text-sm font-medium text-paper"
                  >
                    Mark done
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            href: "/recipes",
            title: "Recipes",
            body: "Log grind, dose, time, and yield.",
          },
          {
            href: "/descaling",
            title: "Descaling",
            body: "Official every-2-months process.",
          },
          {
            href: "/grinder",
            title: "HiBREW 5G",
            body: "Burr care and deep cleans.",
          },
          {
            href: "/settings",
            title: "Reminders",
            body: "Browser nudges before due dates.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-3xl border border-[var(--line)] bg-white p-5 transition hover:border-copper/35"
          >
            <p className="text-lg font-semibold text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {item.body}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
