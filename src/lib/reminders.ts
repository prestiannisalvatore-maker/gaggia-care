import { todayISO } from "@/lib/dates";
import type { AppState, ComputedTask } from "@/lib/types";

export async function ensureNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

export async function maybeNotifyDueTasks(
  state: AppState,
  tasks: ComputedTask[],
  markNotified: (key: string) => void,
) {
  if (!state.reminders.enabled) return;
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const actionable = tasks.filter(
    (task) => task.status === "overdue" || task.status === "due_soon",
  );

  if (actionable.length === 0) return;

  const key = `${todayISO()}:${actionable.map((task) => task.id).sort().join(",")}`;
  if (state.reminders.lastNotifiedKey === key) return;

  const overdue = actionable.filter((task) => task.status === "overdue").length;
  const dueSoon = actionable.filter((task) => task.status === "due_soon").length;

  const title = "Gaggia Care reminder";
  const body =
    overdue > 0
      ? `${overdue} maintenance item${overdue === 1 ? "" : "s"} overdue` +
        (dueSoon ? `, ${dueSoon} due soon` : "")
      : `${dueSoon} maintenance item${dueSoon === 1 ? "" : "s"} due soon`;

  try {
    new Notification(title, {
      body,
      tag: "gaggia-care-daily",
    });
    markNotified(key);
  } catch {
    // Ignore environments that block constructor notifications.
  }
}
