"use client";

import { MaintenanceCalendar } from "@/components/MaintenanceCalendar";
import { ManualCleaningGuide } from "@/components/ManualCleaningGuide";
import { PageIntro } from "@/components/PageIntro";
import { TaskCard } from "@/components/TaskCard";
import { useCare } from "@/lib/store";

export default function MaintenancePage() {
  const { tasks, hydrated } = useCare();

  const machineTasks = tasks.filter((task) => task.equipment === "machine");
  const otherTasks = tasks.filter((task) => task.equipment !== "machine");

  const scheduled = machineTasks.filter(
    (task) =>
      task.frequencyUnit === "days" ||
      task.frequencyUnit === "weeks" ||
      task.frequencyUnit === "months",
  );
  const sessionTasks = machineTasks.filter(
    (task) =>
      task.frequencyUnit === "per_use" || task.frequencyUnit === "as_needed",
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <PageIntro
        eyebrow="Lifecycle care"
        title="Cleaning and maintenance"
        description="Requirements below follow the Gaggia Classic E24 AU operating instructions chapter “Cleaning and maintenance”. Use the calendar and task log to track each item over the life of the machine."
      />

      <section className="fade-up-delay mt-12">
        <ManualCleaningGuide />
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl text-espresso">Maintenance calendar</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Scheduled due dates for timed manual requirements such as daily filter
          cleaning, monthly brew-group cleaning, and descaling every 2 months.
        </p>
        <div className="mt-8">
          <MaintenanceCalendar />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl text-espresso">
          Timed requirements from the manual
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          {hydrated
            ? "Due dates roll forward from your purchase date and each time you mark a task done."
            : "Loading saved progress…"}
        </p>
        <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/70 px-6 py-2 shadow-[var(--shadow)]">
          {scheduled.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl text-espresso">
          Each use & as needed
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          These match manual instructions that are not on a fixed calendar
          interval — after frothing, regularly, or when required.
        </p>
        <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/70 px-6 py-2">
          {sessionTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl text-espresso">
          Grinder & accessories
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Extra care items for your HiBREW 5G and bar tools. These are not part
          of the Gaggia E24 manual.
        </p>
        <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/70 px-6 py-2">
          {otherTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  );
}
