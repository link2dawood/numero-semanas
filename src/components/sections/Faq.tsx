import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import type { Faq as FaqItem } from "@/lib/content";

type FaqProps = { faqs: FaqItem[] };

export default function Faq({ faqs }: FaqProps) {
  return (
    <section aria-labelledby="s-faq" className="flex flex-wrap gap-8">
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2.5">
        <h2 id="s-faq" className="m-0 font-heading text-[32px] font-bold">
          Preguntas frecuentes
        </h2>
        <p className="m-0 text-base leading-relaxed text-muted">
          Consulta todas las respuestas sobre semanas y calendarios.
        </p>
        <Link href="/preguntas-frecuentes" className="inline-flex min-h-11 items-center self-start pt-2 text-[15px] font-semibold">
          <span>Todas las preguntas</span>
          <ArrowRightIcon className="ml-1 size-4" />
        </Link>
      </div>
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-2.5">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="rounded-2xl border border-border bg-card px-5"
          >
            <summary className="min-h-14 cursor-pointer py-[18px] text-base font-semibold">
              {faq.question}
            </summary>
            <p className="mb-[18px] mt-0 text-[15px] leading-relaxed text-muted">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
