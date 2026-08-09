import Image from "next/image";
import Link from "next/link";
import { HomeDashboard } from "@/components/HomeDashboard";

export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-espresso text-paper">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2400&q=80"
          alt="Fresh espresso poured into a demitasse"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="hero-veil absolute inset-0" />
        <div className="grain absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-24 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="fade-up max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-paper/70">
              Home barista companion
            </p>
            <h1 className="display mt-4 text-[2.75rem] leading-[0.95] sm:text-7xl">
              Gaggia Care
            </h1>
            <p className="fade-up-delay mt-5 max-w-lg text-base leading-relaxed text-paper/80 sm:text-lg">
              Maintenance, descaling, and daily ritual for your Classic E24 —
              purchased August 2026 — plus the HiBREW 5G and the tools beside it.
            </p>
            <div className="fade-up-delay-2 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/maintenance"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-paper px-5 py-3 text-sm font-medium text-espresso transition hover:bg-white"
              >
                View maintenance calendar
              </Link>
              <Link
                href="/recipes"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-paper/35 px-5 py-3 text-sm font-medium text-paper transition hover:bg-paper/10"
              >
                Log espresso recipes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeDashboard />
    </>
  );
}
