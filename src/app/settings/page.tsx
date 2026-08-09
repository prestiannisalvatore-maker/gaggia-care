"use client";

import { useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { ensureNotificationPermission } from "@/lib/reminders";
import { useCare } from "@/lib/store";

export default function SettingsPage() {
  const {
    state,
    updatePurchaseDate,
    updateReminders,
    updateNotes,
    resetAll,
  } = useCare();
  const [permission, setPermission] = useState<string>("unknown");

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <PageIntro
        eyebrow="Reminders & data"
        title="Stay ahead of scale and milk"
        description="Enable browser notifications so this device can nudge you when descaling or weekly cleans are due. Progress is stored locally in your browser."
      />

      <section className="fade-up-delay mt-10 space-y-8 rounded-[28px] border border-[var(--line)] bg-white/70 p-6 shadow-[var(--shadow)] sm:p-8">
        <div>
          <label className="text-sm font-medium text-espresso" htmlFor="purchase">
            Machine purchase date
          </label>
          <p className="mt-1 text-sm text-ink-soft">
            Used as the baseline for tasks you have not logged yet.
          </p>
          <input
            id="purchase"
            type="date"
            value={state.purchaseDate}
            onChange={(event) => updatePurchaseDate(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-[var(--line)] bg-paper px-4 py-3"
          />
        </div>

        <div className="border-t border-[var(--line)] pt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-espresso">
                Browser reminders
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Shows a notification when tasks are overdue or due soon.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state.reminders.enabled}
              onClick={() =>
                updateReminders({ enabled: !state.reminders.enabled })
              }
              className={`relative h-8 w-14 rounded-full transition ${
                state.reminders.enabled ? "bg-espresso" : "bg-mist"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-paper transition ${
                  state.reminders.enabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <label className="mt-6 block text-sm font-medium text-espresso" htmlFor="daysBefore">
            Remind me this many days before due
          </label>
          <input
            id="daysBefore"
            type="number"
            min={1}
            max={30}
            value={state.reminders.daysBefore}
            onChange={(event) =>
              updateReminders({
                daysBefore: Math.max(1, Number(event.target.value) || 1),
              })
            }
            className="mt-3 w-32 rounded-2xl border border-[var(--line)] bg-paper px-4 py-3"
          />

          <button
            type="button"
            className="mt-6 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-medium transition hover:bg-mist/60"
            onClick={async () => {
              const result = await ensureNotificationPermission();
              setPermission(result);
              if (result === "granted") {
                updateReminders({ enabled: true });
              }
            }}
          >
            Allow notifications on this device
          </button>
          {permission !== "unknown" ? (
            <p className="mt-3 text-sm text-steam">Permission: {permission}</p>
          ) : null}
        </div>

        <div className="border-t border-[var(--line)] pt-8">
          <label className="text-sm font-medium text-espresso" htmlFor="notes">
            Personal notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={state.customNotes}
            onChange={(event) => updateNotes(event.target.value)}
            placeholder="Water hardness, preferred recipes, gasket replacement dates…"
            className="mt-3 w-full rounded-2xl border border-[var(--line)] bg-paper px-4 py-3"
          />
        </div>

        <div className="border-t border-[var(--line)] pt-8">
          <p className="text-sm font-medium text-espresso">Reset local data</p>
          <p className="mt-1 text-sm text-ink-soft">
            Clears completions, notes, and reminder settings on this browser.
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all local Gaggia Care data on this browser?",
                )
              ) {
                resetAll();
              }
            }}
            className="mt-4 rounded-full border border-danger/30 px-5 py-3 text-sm font-medium text-danger transition hover:bg-danger/5"
          >
            Reset everything
          </button>
        </div>
      </section>
    </div>
  );
}
