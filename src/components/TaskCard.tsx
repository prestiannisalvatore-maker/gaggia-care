"use client";

import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";
import { formatDisplayDate } from "@/lib/dates";
import { useCare } from "@/lib/store";
import type { ComputedTask } from "@/lib/types";

export function TaskCard({ task }: { task: ComputedTask }) {
  const { completeTask, undoLastCompletion } = useCare();

  return (
    <article className="group border-b border-[var(--line)] py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="display text-2xl text-espresso">{task.title}</h3>
            <StatusPill status={task.status} />
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
            {task.description}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.14em] text-steam">
            <span>{task.equipmentLabel}</span>
            <span>{task.frequencyLabel}</span>
            {task.nextDue ? <span>Next: {formatDisplayDate(task.nextDue)}</span> : null}
            {task.lastCompleted ? (
              <span>Last: {formatDisplayDate(task.lastCompleted)}</span>
            ) : (
              <span>Not logged yet</span>
            )}
          </div>
          {task.manualSection ? (
            <p className="text-xs leading-relaxed text-steam">
              Manual: {task.manualSection}
            </p>
          ) : null}
          {task.guideHref ? (
            <Link
              href={task.guideHref}
              className="inline-flex text-sm font-medium text-copper underline decoration-copper/30 underline-offset-4 transition hover:decoration-copper"
            >
              View guide
            </Link>
          ) : null}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => completeTask(task.id)}
            className="min-h-11 rounded-full bg-espresso px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-copper-deep"
          >
            Mark done
          </button>
          {task.lastCompleted ? (
            <button
              type="button"
              onClick={() => undoLastCompletion(task.id)}
              className="min-h-11 rounded-full border border-[var(--line)] px-4 py-2.5 text-sm text-ink-soft transition hover:bg-mist/60"
            >
              Undo
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
