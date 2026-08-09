"use client";

import Link from "next/link";
import { useCare } from "@/lib/store";

export function ReminderBanner() {
  const { hydrated, tasks, state } = useCare();

  if (!hydrated) return null;

  const overdue = tasks.filter((task) => task.status === "overdue");
  const dueSoon = tasks.filter((task) => task.status === "due_soon");

  if (overdue.length === 0 && dueSoon.length === 0) return null;

  return (
    <div className="border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--copper)_8%,white)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-ink-soft">
          {overdue.length > 0 ? (
            <>
              <span className="font-semibold text-danger">
                {overdue.length} overdue
              </span>
              {dueSoon.length > 0 ? " · " : null}
            </>
          ) : null}
          {dueSoon.length > 0 ? (
            <span className="font-semibold text-warn">
              {dueSoon.length} due soon
            </span>
          ) : null}
          {!state.reminders.enabled ? (
            <span className="text-steam"> · Reminders are off</span>
          ) : null}
        </p>
        <Link href="/maintenance" className="font-semibold text-copper">
          Open Care →
        </Link>
      </div>
    </div>
  );
}
