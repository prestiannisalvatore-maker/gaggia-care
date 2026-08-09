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
    <aside className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6 shadow-[var(--shadow)]">
      <p className="text-xs uppercase tracking-[0.18em] text-steam">
        Official reference
      </p>
      <h2 className="display mt-3 text-3xl text-espresso">{manual.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {manual.citation}
      </p>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-steam">Edition</dt>
          <dd className="font-medium text-espresso">{manual.edition}</dd>
        </div>
        <div>
          <dt className="text-steam">Revision</dt>
          <dd className="font-medium text-espresso">{manual.revision}</dd>
        </div>
        <div>
          <dt className="text-steam">Document</dt>
          <dd className="font-medium text-espresso">{manual.documentId}</dd>
        </div>
        <div>
          <dt className="text-steam">Model</dt>
          <dd className="font-medium text-espresso">{manual.modelCode}</dd>
        </div>
      </dl>
      <a
        href={manual.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-full bg-espresso px-5 py-3 text-sm font-medium text-paper transition hover:bg-copper-deep"
      >
        Open attached manual (PDF)
      </a>
      <p className="mt-3 text-xs text-steam">{manual.filename}</p>
    </aside>
  );
}
