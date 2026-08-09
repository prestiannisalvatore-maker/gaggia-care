import type { TaskStatus } from "@/lib/types";

const STYLES: Record<TaskStatus, string> = {
  overdue: "bg-danger/12 text-danger ring-danger/20",
  due_soon: "bg-warn/12 text-warn ring-warn/20",
  ok: "bg-ok/12 text-ok ring-ok/20",
  per_use: "bg-steam/12 text-steam ring-steam/20",
  as_needed: "bg-steam/12 text-steam ring-steam/20",
};

const LABELS: Record<TaskStatus, string> = {
  overdue: "Overdue",
  due_soon: "Due soon",
  ok: "On track",
  per_use: "Each use",
  as_needed: "As needed",
};

export function StatusPill({
  status,
  label,
}: {
  status: TaskStatus;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {label ?? LABELS[status]}
    </span>
  );
}
