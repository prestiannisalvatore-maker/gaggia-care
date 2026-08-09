"use client";

import { useMemo, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { getCalendarCells, monthLabel, todayISO } from "@/lib/dates";
import { monthDueMap } from "@/lib/schedule";
import { useCare } from "@/lib/store";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MaintenanceCalendar() {
  const { tasks } = useCare();
  const today = todayISO();
  const initial = new Date();
  const [cursor, setCursor] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });
  const [selected, setSelected] = useState<string>(today);

  const cells = useMemo(
    () => getCalendarCells(cursor.year, cursor.month),
    [cursor],
  );

  const dueMap = useMemo(
    () => monthDueMap(tasks, cursor.year, cursor.month),
    [tasks, cursor],
  );

  const selectedTasks = dueMap[selected] ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="display text-2xl text-espresso sm:text-3xl">
            {monthLabel(cursor.year, cursor.month)}
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            <button
              type="button"
              className="min-h-11 rounded-full border border-[var(--line)] px-3 py-2 text-sm hover:bg-mist/60"
              onClick={() =>
                setCursor((prev) => {
                  const date = new Date(prev.year, prev.month - 1, 1);
                  return { year: date.getFullYear(), month: date.getMonth() };
                })
              }
            >
              Prev
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-[var(--line)] px-3 py-2 text-sm hover:bg-mist/60"
              onClick={() =>
                setCursor({
                  year: initial.getFullYear(),
                  month: initial.getMonth(),
                })
              }
            >
              Today
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-[var(--line)] px-3 py-2 text-sm hover:bg-mist/60"
              onClick={() =>
                setCursor((prev) => {
                  const date = new Date(prev.year, prev.month + 1, 1);
                  return { year: date.getFullYear(), month: date.getMonth() };
                })
              }
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.12em] text-steam sm:text-xs sm:tracking-[0.14em]">
          {WEEKDAYS.map((day, index) => (
            <div key={`${day}-${index}`} className="py-2">
              <span className="sm:hidden">{day}</span>
              <span className="hidden sm:inline">{WEEKDAYS_FULL[index]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (!cell.iso || cell.day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-11 sm:min-h-16 lg:min-h-20"
                />
              );
            }

            const due = dueMap[cell.iso] ?? [];
            const isSelected = selected === cell.iso;
            const isToday = cell.iso === today;
            const hasOverdue = due.some((task) => task.status === "overdue");
            const hasDueSoon = due.some((task) => task.status === "due_soon");

            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelected(cell.iso!)}
                className={`flex min-h-11 flex-col items-center justify-start rounded-xl border p-1.5 text-left transition sm:min-h-16 sm:items-stretch sm:rounded-2xl sm:p-2 lg:min-h-20 ${
                  isSelected
                    ? "border-espresso bg-espresso text-paper"
                    : "border-transparent bg-white/50 hover:border-mist hover:bg-white/80"
                }`}
              >
                <div className="flex w-full items-center justify-center gap-1 sm:justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isToday && !isSelected ? "text-copper" : ""
                    }`}
                  >
                    {cell.day}
                  </span>
                  {due.length > 0 ? (
                    <span
                      className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                        hasOverdue
                          ? "bg-danger"
                          : hasDueSoon
                            ? "bg-warn"
                            : isSelected
                              ? "bg-paper"
                              : "bg-ok"
                      } ${hasOverdue || hasDueSoon ? "pulse-soft" : ""}`}
                    />
                  ) : null}
                </div>
                <div
                  className={`mt-1 hidden space-y-1 text-[10px] leading-tight sm:block ${
                    isSelected ? "text-paper/80" : "text-ink-soft"
                  }`}
                >
                  {due.slice(0, 2).map((task) => (
                    <div key={task.id} className="truncate">
                      {task.title}
                    </div>
                  ))}
                  {due.length > 2 ? <div>+{due.length - 2} more</div> : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="rounded-[24px] border border-[var(--line)] bg-white/70 p-5 shadow-[var(--shadow)] sm:rounded-[28px] sm:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-steam">
          Selected day
        </p>
        <h3 className="display mt-2 text-2xl text-espresso sm:text-3xl">
          {selected}
        </h3>
        <div className="mt-5 space-y-4 sm:mt-6">
          {selectedTasks.length === 0 ? (
            <p className="text-sm leading-relaxed text-ink-soft">
              No scheduled maintenance due on this day. Daily wipe-downs and
              steam purges still apply whenever you brew.
            </p>
          ) : (
            selectedTasks.map((task) => (
              <div
                key={task.id}
                className="border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-espresso">{task.title}</p>
                  <StatusPill status={task.status} />
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {task.frequencyLabel}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
