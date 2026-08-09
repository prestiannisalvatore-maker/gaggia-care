"use client";

import { useCare } from "@/lib/store";

export function DescaleCompleteButton() {
  const { completeTask } = useCare();

  return (
    <button
      type="button"
      onClick={() => completeTask("descale")}
      className="rounded-full bg-espresso px-5 py-3 text-sm font-medium text-paper transition hover:bg-copper-deep"
    >
      Mark descaling complete
    </button>
  );
}
