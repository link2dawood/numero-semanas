import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  widget?: ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  intro,
  widget,
}: PageHeroProps) {
  return (
    <section className="rounded-3xl border border-border bg-card px-6 py-8 sm:px-10 sm:py-10">
      {eyebrow && (
        <p className="mb-2 mt-0 text-sm font-bold uppercase tracking-wide text-olive">
          {eyebrow}
        </p>
      )}
      <h1 className="m-0 font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mb-0 mt-4 max-w-3xl text-lg leading-relaxed text-muted">
        {intro}
      </p>
      {widget && <div className="mt-6">{widget}</div>}
    </section>
  );
}
