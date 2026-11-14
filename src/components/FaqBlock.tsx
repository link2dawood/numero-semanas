import type { Faq } from "@/lib/content";

type FaqBlockProps = {
  faqs: Faq[];
  title?: string;
};

/**
 * Visible FAQ only. No FAQPage JSON-LD: Google restricts FAQ rich results to
 * government/health sites, and these answers are partly shared templates.
 */
export default function FaqBlock({
  faqs,
  title = "Preguntas frecuentes",
}: FaqBlockProps) {
  return (
    <section aria-labelledby="faq-title" className="flex flex-col gap-3">
      <h2 id="faq-title" className="m-0 font-heading text-2xl font-bold">
        {title}
      </h2>
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="rounded-2xl border border-border bg-card px-5"
        >
          <summary className="min-h-14 cursor-pointer py-4 font-semibold">
            {faq.question}
          </summary>
          <p className="mb-5 mt-0 leading-relaxed text-muted">{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}
