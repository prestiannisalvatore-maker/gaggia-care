"use client";

import { useMemo, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import {
  formatDisplayDate,
  getCalendarCells,
  monthLabel,
  todayISO,
} from "@/lib/dates";
import { monthDueMap } from "@/lib/schedule";
import { useCare } from "@/lib/store";
import type { ComputedTask } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function statusTone(tasks: ComputedTask[]) {
  if (tasks.some((task) => task.status === "overdue")) {
    return {
      cell: "bg-[color-mix(in_oklab,var(--danger)_14%,white)] ring-danger/25",
      dot: "bg-danger",
      label: "Overdue",
    };
  }
  if (tasks.some((task) => task.status === "due_soon")) {
    return {
      cell: "bg-[color-mix(in_oklab,var(--warn)_16%,white)] ring-warn/25",
      dot: "bg-warn",
      label: "Due soon",
    };
  }
  return {
    cell: "bg-[color-mix(in_oklab,var(--ok)_12%,white)] ring-ok/20",
    dot: "bg-ok",
    label: "Scheduled",
  };
}

export function MaintenanceCalendar({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { tasks, completeTask, hydrated } = useCare();
  const today = todayISO();
  const initial = new Date();
  const [cursor, setCursor] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });
  const [selected, setSelected] = useState<string>(today);

  const scheduledTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.frequencyUnit === "days" ||
          task.frequencyUnit === "weeks" ||
          task.frequencyUnit === "months",
      ),
    [tasks],
  );

  const cells = useMemo(
    () => getCalendarCells(cursor.year, cursor.month),
    [cursor],
  );

  const dueMap = useMemo(
    () => monthDueMap(scheduledTasks, cursor.year, cursor.month),
    [scheduledTasks, cursor],
  );

  const selectedTasks = dueMap[selected] ?? [];

  const upcoming = useMemo(() => {
    return scheduledTasks
      .filter((task) => task.nextDue)
      .slice()
      .sort((a, b) => (a.nextDue ?? "").localeCompare(b.nextDue ?? ""))
      .slice(0, compact ? 4 : 8);
  }, [scheduledTasks, compact]);

  const monthEventCount = Object.values(dueMap).reduce(
    (total, list) => total + list.length,
    0,
  );

  return (
    <div className={compact ? "space-y-5" : "space-y-6"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-steam">
            Maintenance calendar
          </p>
          <h2 className="display mt-1 text-3xl text-ink sm:text-4xl">
            {monthLabel(cursor.year, cursor.month)}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            {hydrated
              ? `${monthEventCount} due date${monthEventCount === 1 ? "" : "s"} this month`
              : "Loading schedule…"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          {[
            {
              label: "Prev",
              onClick: () =>
                setCursor((prev) => {
                  const date = new Date(prev.year, prev.month - 1, 1);
                  return { year: date.getFullYear(), month: date.getMonth() };
                }),
            },
            {
              label: "Today",
              onClick: () => {
                setCursor({
                  year: initial.getFullYear(),
                  month: initial.getMonth(),
                });
                setSelected(today);
              },
            },
            {
              label: "Next",
              onClick: () =>
                setCursor((prev) => {
                  const date = new Date(prev.year, prev.month + 1, 1);
                  return { year: date.getFullYear(), month: date.getMonth() };
                }),
            },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-3 text-sm text-ink hover:bg-paper"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" /> Overdue
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-warn" /> Due soon
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-ok" /> Scheduled
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full ring-2 ring-copper" /> Today
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white p-3 sm:p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-steam">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2">
                <span className="sm:hidden">{day.slice(0, 1)}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, index) => {
              if (!cell.iso || cell.day === null) {
                return <div key={`empty-${index}`} className="min-h-14 sm:min-h-[4.5rem]" />;
              }

              const due = dueMap[cell.iso] ?? [];
              const isSelected = selected === cell.iso;
              const isToday = cell.iso === today;
              const tone = due.length ? statusTone(due) : null;

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => setSelected(cell.iso!)}
                  className={`min-h-14 rounded-2xl p-1.5 text-left transition sm:min-h-[4.5rem] sm:p-2 ${
                    isSelected
                      ? "bg-ink text-paper shadow-sm"
                      : tone
                        ? `${tone.cell} ring-1`
                        : "bg-paper/70 hover:bg-paper"
                  } ${isToday && !isSelected ? "ring-2 ring-copper" : ""}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-sm font-semibold">{cell.day}</span>
                    {due.length > 0 ? (
                      <span
                        className={`mt-1 h-2 w-2 rounded-full ${
                          isSelected ? "bg-paper" : tone?.dot
                        }`}
                      />
                    ) : null}
                  </div>
                  {due.length > 0 ? (
                    <p
                      className={`mt-1 line-clamp-2 text-[10px] leading-tight sm:text-[11px] ${
                        isSelected ? "text-paper/80" : "text-ink-soft"
                      }`}
                    >
                      {due.length === 1
                        ? due[0].title
                        : `${due.length} tasks due`}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <aside className="rounded-3xl border border-[var(--line)] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-steam">
              Selected day
            </p>
            <h3 className="mt-2 text-lg font-semibold text-ink">
              {formatDisplayDate(selected)}
            </h3>
            <div className="mt-4 space-y-3">
              {selectedTasks.length === 0 ? (
                <p className="text-sm leading-relaxed text-ink-soft">
                  Nothing scheduled for this day. Daily cleans still apply when
                  you brew.
                </p>
              ) : (
                selectedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-[var(--line)] bg-paper/80 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{task.title}</p>
                      <StatusPill status={task.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      {task.frequencyLabel}
                    </p>
                    {!compact ? (
                      <button
                        type="button"
                        onClick={() => completeTask(task.id)}
                        className="mt-3 min-h-10 rounded-xl bg-ink px-3 text-sm font-medium text-paper"
                      >
                        Mark done
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </aside>

          <aside className="rounded-3xl border border-[var(--line)] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-steam">
              Coming up
            </p>
            <div className="mt-4 space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-ink-soft">No timed tasks yet.</p>
              ) : (
                upcoming.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-ink">{task.title}</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {task.nextDue
                          ? formatDisplayDate(task.nextDue)
                          : task.frequencyLabel}
                      </p>
                    </div>
                    <StatusPill status={task.status} />
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
