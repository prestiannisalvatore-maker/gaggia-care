import { MACHINE } from "@/data/machine";

type ManualReferenceProps = {
  variant?: "banner" | "compact" | "footer";
};

export function ManualReference({ variant = "banner" }: ManualReferenceProps) {
  const { manual } = MACHINE;

  if (variant === "footer") {
    return (
      <p>
        Reference:{" "}
        <a
          href={manual.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-soft underline decoration-copper/30 underline-offset-4 transition hover:text-copper"
        >
          {manual.title} · {manual.edition} {manual.revision}
        </a>
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <p className="text-sm text-ink-soft">
        Based on the{" "}
        <a
          href={manual.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-copper underline decoration-copper/30 underline-offset-4"
        >
          official Gaggia Classic E24 AU manual
        </a>{" "}
        ({manual.documentId}, {manual.revision}).
      </p>
    );
  }

  return (
    <aside className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.16em] text-steam">
        Official reference
      </p>
      <h2 className="mt-2 text-xl font-semibold text-ink">{manual.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {manual.citation}
      </p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-steam">Edition</dt>
          <dd className="font-medium text-ink">{manual.edition}</dd>
        </div>
        <div>
          <dt className="text-steam">Revision</dt>
          <dd className="font-medium text-ink">{manual.revision}</dd>
        </div>
        <div>
          <dt className="text-steam">Document</dt>
          <dd className="font-medium text-ink">{manual.documentId}</dd>
        </div>
        <div>
          <dt className="text-steam">Model</dt>
          <dd className="font-medium text-ink">{manual.modelCode}</dd>
        </div>
      </dl>
      <a
        href={manual.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-ink px-4 text-sm font-medium text-paper"
      >
        Open attached manual (PDF)
      </a>
      <p className="mt-3 text-xs text-steam">{manual.filename}</p>
    </aside>
  );
}
