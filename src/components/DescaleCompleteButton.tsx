"use client";

import { useCare } from "@/lib/store";

export function DescaleCompleteButton() {
  const { completeTask } = useCare();

  return (
    <button
      type="button"
      onClick={() => completeTask("descale")}
      className="min-h-11 rounded-2xl bg-ink px-4 text-sm font-medium text-paper transition hover:bg-copper-deep"
    >
      Mark descaling complete
    </button>
  );
}
