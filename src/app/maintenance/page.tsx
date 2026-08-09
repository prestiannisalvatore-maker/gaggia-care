"use client";

import { useState } from "react";
import { MaintenanceCalendar } from "@/components/MaintenanceCalendar";
import { ManualCleaningGuide } from "@/components/ManualCleaningGuide";
import { PageShell } from "@/components/PageShell";
import { TaskCard } from "@/components/TaskCard";
import { useCare } from "@/lib/store";

const TABS = [
  { id: "calendar", label: "Calendar" },
  { id: "tasks", label: "Tasks" },
  { id: "guide", label: "Cleaning" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function MaintenancePage() {
  const { tasks, hydrated } = useCare();
  const [tab, setTab] = useState<TabId>("calendar");

  const machineTasks = tasks.filter((task) => task.equipment === "machine");
  const otherTasks = tasks.filter((task) => task.equipment !== "machine");

  const scheduled = machineTasks.filter(
    (task) =>
      task.frequencyUnit === "days" ||
      task.frequencyUnit === "weeks" ||
      task.frequencyUnit === "months",
  );
  const sessionTasks = machineTasks.filter(
    (task) =>
      task.frequencyUnit === "per_use" || task.frequencyUnit === "as_needed",
  );

  return (
    <PageShell
      eyebrow="Care"
      title="Maintenance"
      description="Calendar first. Tasks and the official cleaning guide sit one tap away when you need them."
    >
      <div
        role="tablist"
        aria-label="Maintenance views"
        className="flex gap-1 rounded-2xl border border-[var(--line)] bg-white p-1"
      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`min-h-11 flex-1 rounded-xl px-3 text-sm transition ${
                active
                  ? "bg-[color-mix(in_oklab,var(--copper)_14%,white)] font-semibold text-ink"
                  : "text-steam hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "calendar" ? (
        <section className="mt-6 rounded-[1.75rem] border border-[var(--line)] bg-[color-mix(in_oklab,white_72%,var(--paper))] p-4 sm:p-6">
          <MaintenanceCalendar />
        </section>
      ) : null}

      {tab === "tasks" ? (
        <div className="mt-6 space-y-10">
          <section>
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Timed requirements
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">
              {hydrated
                ? "Due dates roll forward from your purchase date and each completion."
                : "Loading saved progress…"}
            </p>
            <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white px-4 py-2 sm:px-6">
              {scheduled.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Each use & as needed
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">
              Habits from the manual that are not fixed calendar intervals.
            </p>
            <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white px-4 py-2 sm:px-6">
              {sessionTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Grinder & accessories
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">
              Extra care for your HiBREW 5G and bar tools.
            </p>
            <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white px-4 py-2 sm:px-6">
              {otherTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {tab === "guide" ? (
        <section className="mt-6">
          <ManualCleaningGuide />
        </section>
      ) : null}
    </PageShell>
  );
}
