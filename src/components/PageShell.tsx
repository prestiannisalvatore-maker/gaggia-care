import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  backHref,
  backLabel = "Back",
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-steam transition hover:text-ink"
        >
          <span aria-hidden>←</span>
          {backLabel}
        </Link>
      ) : null}

      <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-8">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-steam">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="display mt-2 text-[2.35rem] leading-[1.05] text-ink sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-[1.05rem]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="w-full sm:w-auto">{actions}</div> : null}
      </header>

      <div className="pt-8">{children}</div>
    </div>
  );
}
