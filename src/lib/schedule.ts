import { MAINTENANCE_TASKS } from "@/data/tasks";
import {
  addDays,
  addMonths,
  addWeeks,
  daysBetween,
  todayISO,
} from "@/lib/dates";
import type {
  AppState,
  CompletionRecord,
  ComputedTask,
  MaintenanceTask,
  TaskStatus,
} from "@/lib/types";

export function nextDueFrom(
  task: MaintenanceTask,
  lastCompleted: string | null,
  purchaseDate: string,
): string | null {
  if (task.frequencyUnit === "per_use" || task.frequencyUnit === "as_needed") {
    return null;
  }

  const baseline = lastCompleted ?? purchaseDate;

  switch (task.frequencyUnit) {
    case "days":
      return addDays(baseline, task.frequencyValue);
    case "weeks":
      return addWeeks(baseline, task.frequencyValue);
    case "months":
      return addMonths(baseline, task.frequencyValue);
    default:
      return null;
  }
}

export function statusForTask(
  task: MaintenanceTask,
  nextDue: string | null,
  daysBefore: number,
  today = todayISO(),
): { status: TaskStatus; daysUntilDue: number | null } {
  if (task.frequencyUnit === "per_use") {
    return { status: "per_use", daysUntilDue: null };
  }

  if (task.frequencyUnit === "as_needed") {
    return { status: "as_needed", daysUntilDue: null };
  }

  if (!nextDue) {
    return { status: "ok", daysUntilDue: null };
  }

  const daysUntilDue = daysBetween(today, nextDue);

  if (daysUntilDue < 0) {
    return { status: "overdue", daysUntilDue };
  }

  if (daysUntilDue <= daysBefore) {
    return { status: "due_soon", daysUntilDue };
  }

  return { status: "ok", daysUntilDue };
}

export function latestCompletion(
  completions: CompletionRecord[],
  taskId: string,
): string | null {
  const matches = completions
    .filter((entry) => entry.taskId === taskId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  return matches[0]?.completedAt ?? null;
}

export function computeTasks(state: AppState, today = todayISO()): ComputedTask[] {
  return MAINTENANCE_TASKS.map((task) => {
    const lastCompleted = latestCompletion(state.completions, task.id);
    const nextDue = nextDueFrom(task, lastCompleted, state.purchaseDate);
    const { status, daysUntilDue } = statusForTask(
      task,
      nextDue,
      state.reminders.daysBefore,
      today,
    );

    return {
      ...task,
      lastCompleted,
      nextDue,
      status,
      daysUntilDue,
    };
  }).sort((a, b) => {
    const rank = {
      overdue: 0,
      due_soon: 1,
      per_use: 2,
      as_needed: 3,
      ok: 4,
    };
    return rank[a.status] - rank[b.status] || a.title.localeCompare(b.title);
  });
}

export function dueTasksForDate(
  tasks: ComputedTask[],
  iso: string,
): ComputedTask[] {
  return tasks.filter(
    (task) => task.nextDue === iso || task.lastCompleted === iso,
  );
}

export function monthDueMap(
  tasks: ComputedTask[],
  year: number,
  monthIndex: number,
): Record<string, ComputedTask[]> {
  const map: Record<string, ComputedTask[]> = {};

  for (const task of tasks) {
    if (!task.nextDue) continue;
    const [y, m] = task.nextDue.split("-").map(Number);
    if (y === year && m === monthIndex + 1) {
      map[task.nextDue] = map[task.nextDue] ?? [];
      map[task.nextDue].push(task);
    }
  }

  return map;
}
