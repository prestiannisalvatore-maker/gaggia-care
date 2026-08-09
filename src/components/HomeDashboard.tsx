"use client";

import Link from "next/link";
import { analyzeRecipes } from "@/lib/analysis";
import { formatDisplayDate } from "@/lib/dates";
import { drinkTypeLabel } from "@/lib/recipes";
import { useCare } from "@/lib/store";
import { tasteResultLabel } from "@/lib/taste";

export function HomeDashboard() {
  const { hydrated, tasks, state, completeTask } = useCare();

  const attention = tasks.filter(
    (task) => task.status === "overdue" || task.status === "due_soon",
  );
  const nextCare = tasks
    .filter((task) => task.nextDue)
    .slice()
    .sort((a, b) => (a.nextDue ?? "").localeCompare(b.nextDue ?? ""))[0];

  const analysis = analyzeRecipes(state.recipes);
  const latest = analysis.latestRecipe;
  const topSuggestion = analysis.suggestions[0];

  const focus =
    !hydrated
      ? {
          kind: "loading" as const,
          title: "Loading your bar…",
          body: "Pulling up care and recipes from this browser.",
        }
      : attention.length > 0
        ? {
            kind: "care" as const,
            title:
              attention.length === 1
                ? attention[0].title
                : `${attention.length} care items need you`,
            body:
              attention.length === 1
                ? attention[0].nextDue
                  ? `Due ${formatDisplayDate(attention[0].nextDue)} · ${attention[0].frequencyLabel}`
                  : attention[0].frequencyLabel
                : "Start with the highest priority job, then come back for the rest.",
          }
        : latest?.tasteResult && latest.tasteResult !== "balanced"
          ? {
              kind: "brew" as const,
              title: topSuggestion?.title ?? "Dial in the next shot",
              body:
                topSuggestion?.detail ??
                `Last ${drinkTypeLabel(latest.drinkType)} tasted ${tasteResultLabel(latest.tasteResult)}.`,
            }
          : {
              kind: "clear" as const,
              title: "You’re clear for coffee",
              body: nextCare?.nextDue
                ? `Next care: ${nextCare.title} on ${formatDisplayDate(nextCare.nextDue)}.`
                : "Care is on track. Log a shot whenever you brew.",
            };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-[2rem] border border-[var(--line)] bg-white p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-steam">
          Today
        </p>
        <h1 className="display mt-2 text-[2.4rem] leading-[1.05] text-ink sm:text-5xl">
          {focus.title}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
          {focus.body}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {focus.kind === "care" && attention[0] ? (
            <>
              <button
                type="button"
                onClick={() => completeTask(attention[0].id)}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-medium text-paper"
              >
                Mark “{attention[0].title}” done
              </button>
              <Link
                href="/maintenance"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-paper px-5 text-sm font-medium text-ink"
              >
                Open Care
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/recipes"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-medium text-paper"
              >
                Log a shot
              </Link>
              <Link
                href="/maintenance"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-paper px-5 text-sm font-medium text-ink"
              >
                Open Care
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/recipes"
          className="rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(165deg,#fff_0%,#f7f3ee_100%)] p-6 transition hover:border-copper/40"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-steam">Brew</p>
          <h2 className="display mt-2 text-3xl text-ink">Recipes</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {hydrated && latest
              ? `Latest: ${drinkTypeLabel(latest.drinkType)}${
                  latest.tasteResult
                    ? ` · ${tasteResultLabel(latest.tasteResult)}`
                    : ""
                }`
              : "Grind, dose, yield, taste — then let the coach suggest the next tweak."}
          </p>
        </Link>

        <Link
          href="/maintenance"
          className="rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(165deg,#fff_0%,#f1f5f8_100%)] p-6 transition hover:border-copper/40"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-steam">Care</p>
          <h2 className="display mt-2 text-3xl text-ink">Calendar</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {hydrated && attention.length > 0
              ? `${attention.length} item${attention.length === 1 ? "" : "s"} need attention.`
              : nextCare?.nextDue
                ? `Next: ${nextCare.title} · ${formatDisplayDate(nextCare.nextDue)}`
                : "Descaling, backflush, and daily habits in one place."}
          </p>
        </Link>
      </section>

      {hydrated && attention.length > 1 ? (
        <section className="rounded-[1.75rem] border border-[var(--line)] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-steam">
                Also due
              </p>
              <h2 className="display mt-1 text-2xl text-ink">Quick finish</h2>
            </div>
            <Link
              href="/maintenance"
              className="text-sm font-semibold text-copper"
            >
              See all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--line)]">
            {attention.slice(0, 3).map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{task.title}</p>
                  <p className="text-sm text-steam">
                    {task.nextDue
                      ? formatDisplayDate(task.nextDue)
                      : task.frequencyLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => completeTask(task.id)}
                  className="shrink-0 rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-medium text-ink"
                >
                  Done
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-[1.75rem] border border-[var(--line)] bg-white p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-steam">
          Need a how-to?
        </p>
        <h2 className="display mt-1 text-2xl text-ink">Guides</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Descaling, machine overview, grinder care, accessories, and reminders
          live in Guide — so Home stays about what to do next.
        </p>
        <Link
          href="/guides"
          className="mt-5 inline-flex min-h-11 items-center rounded-2xl border border-[var(--line)] bg-paper px-4 text-sm font-medium text-ink"
        >
          Browse guides
        </Link>
      </section>
    </div>
  );
}
