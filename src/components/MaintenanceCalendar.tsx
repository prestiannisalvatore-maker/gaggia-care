"use client";

import { useMemo, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { getCalendarCells, monthLabel, todayISO } from "@/lib/dates";
import { monthDueMap } from "@/lib/schedule";
import { useCare } from "@/lib/store";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="display text-3xl text-espresso">
            {monthLabel(cursor.year, cursor.month)}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm hover:bg-mist/60"
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
              className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm hover:bg-mist/60"
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
              className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm hover:bg-mist/60"
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

        <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-[0.14em] text-steam">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (!cell.iso || cell.day === null) {
              return <div key={`empty-${index}`} className="min-h-20" />;
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
                className={`min-h-20 rounded-2xl border p-2 text-left transition ${
                  isSelected
                    ? "border-espresso bg-espresso text-paper"
                    : "border-transparent bg-white/50 hover:border-mist hover:bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isToday && !isSelected ? "text-copper" : ""
                    }`}
                  >
                    {cell.day}
                  </span>
                  {due.length > 0 ? (
                    <span
                      className={`h-2 w-2 rounded-full ${
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
                  className={`mt-2 space-y-1 text-[10px] leading-tight ${
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

      <aside className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.18em] text-steam">
          Selected day
        </p>
        <h3 className="display mt-2 text-3xl text-espresso">{selected}</h3>
        <div className="mt-6 space-y-4">
          {selectedTasks.length === 0 ? (
            <p className="text-sm leading-relaxed text-ink-soft">
              No scheduled maintenance due on this day. Daily wipe-downs and
              steam purges still apply whenever you brew.
            </p>
          ) : (
            selectedTasks.map((task) => (
              <div key={task.id} className="border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-espresso">{task.title}</p>
                  <StatusPill status={task.status} />
                </div>
                <p className="mt-1 text-sm text-ink-soft">{task.frequencyLabel}</p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
