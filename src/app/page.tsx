import Link from "next/link";
import { HomeDashboard } from "@/components/HomeDashboard";

export default function Home() {
  return (
    <>
      <section className="border-b border-[var(--line)] bg-[linear-gradient(180deg,#f7f8fa_0%,#eef1f4_100%)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-steam">
              Classic E24 · August 2026
            </p>
            <h1 className="display mt-3 text-5xl leading-[0.95] text-ink sm:text-6xl">
              Gaggia Care
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              A clear calendar for machine care, official descaling steps, and a
              place to refine espresso recipes until they taste superb.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/maintenance"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-5 text-sm font-medium text-paper"
            >
              Open calendar
            </Link>
            <Link
              href="/recipes"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-ink"
            >
              Log a recipe
            </Link>
          </div>
        </div>
      </section>

      <HomeDashboard />
    </>
  );
}
