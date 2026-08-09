export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="fade-up max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-steam">{eyebrow}</p>
      <h1 className="display mt-3 text-4xl text-espresso sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
        {description}
      </p>
    </div>
  );
}
