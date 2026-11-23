"use client";

import { useState } from "react";
import Link from "next/link";
import type { Faq } from "@/lib/content";

type FaqBlockProps = {
  faqs: Faq[];
  title?: string;
  subtitle?: string;
  showSidebar?: boolean;
};

// Tag color variants for FAQ badges
const tagColors: Record<string, string> = {
  "Semana actual": "bg-emerald-100 text-emerald-800",
  "Norma ISO 8601": "bg-[#EFECE1] text-stone-700",
  "52 o 53 semanas": "bg-[#EFECE1] text-stone-700",
  "Planificación": "bg-[#EFECE1] text-stone-700",
  "Buscador": "bg-[#EFECE1] text-stone-700",
  "100% Gratuito": "bg-emerald-100 text-emerald-800",
  default: "bg-[#EFECE1] text-stone-700",
};

function getTagColor(tag: string): string {
  return tagColors[tag] || tagColors.default;
}

type FaqItemProps = {
  faq: Faq;
  isFirst: boolean;
};

function FaqItem({ faq, isFirst }: FaqItemProps) {
  const tag = faq.tag || "";
  const tagColorClass = getTagColor(tag);

  return (
    <details
      className="group rounded-2xl border border-[#E9E4D8] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)]"
      open={isFirst}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="flex items-center gap-2 text-base font-bold text-[#141E16]">
          <span className={`h-2.5 w-2.5 rounded-full ${isFirst ? "bg-[#3D5441]" : "bg-[#4E6A53]"}`}></span>
          {faq.question}
        </span>
        <div className="flex items-center gap-2">
          {tag && (
            <span
              className={`hidden rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider sm:inline-block ${tagColorClass}`}
            >
              {tag}
            </span>
          )}
          <svg
            className="h-4 w-4 text-stone-400 transition duration-200 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>
      <div className="mt-3 space-y-2 border-t border-[#E9E4D8]/80 pt-3 text-sm font-normal leading-relaxed text-stone-600">
        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
        {faq.note && (
          <div className="flex items-center gap-2 rounded-xl border border-[#E9E4D8] bg-[#FDFBF7] p-3 text-sm italic text-stone-500">
            <svg className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {faq.note}
          </div>
        )}
      </div>
    </details>
  );
}

export default function FaqBlock({
  faqs,
  title = "Preguntas frecuentes",
  subtitle = "Consulta todas las respuestas sobre semanas, festivos y cálculo de fechas según el estándar oficial.",
  showSidebar = true,
}: FaqBlockProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  if (!showSidebar) {
    // Simple layout without sidebar
    return (
      <section aria-labelledby="faq-title" className="flex flex-col gap-3">
        <h2 id="faq-title" className="m-0 font-serif text-2xl font-bold text-[#141E16]">
          {title}
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <FaqItem key={faq.question} faq={faq} isFirst={index === 0} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="grid items-start gap-8 pt-6 lg:grid-cols-12">
      {/* FAQ Left Sidebar */}
      <div className="space-y-4 lg:col-span-4">
        <span className="text-sm font-bold uppercase tracking-wider text-[#2A3C2D]">
          FAQ · RESOLVEMOS TUS DUDAS
        </span>
        <h3 className="font-serif text-3xl font-bold text-[#141E16]">{title}</h3>
        <p className="text-sm leading-relaxed text-stone-600">{subtitle}</p>

        {/* Search FAQ input */}
        <div className="relative pt-2">
          <input
            type="search"
            placeholder="Buscar pregunta o tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E9E4D8] bg-white py-3 pl-10 pr-4 text-sm font-medium text-stone-800 placeholder-stone-400 outline-none focus:border-[#2A3C2D] focus:ring-2 focus:ring-[#2A3C2D]"
          />
          <svg
            className="absolute left-3.5 top-5.5 h-4 w-4 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <Link
          href="/preguntas-frecuentes"
          className="inline-flex items-center gap-2 pt-2 text-sm font-bold text-[#1E2B20] hover:text-[#3D5441]"
        >
          Todas las preguntas
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        {/* Support Box */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#E9E4D8] bg-[#F7F5EE]/80 p-4">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E2B20] text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-sm text-stone-600">
            <p className="font-bold text-[#141E16]">¿No encuentras lo que buscas?</p>
            <p className="mt-0.5 text-sm">
              Escríbenos y actualizaremos nuestras guías para ayudarte.
            </p>
            <Link
              href="/contacto"
              className="mt-1.5 inline-flex items-center gap-1.5 font-bold text-[#1E2B20] hover:underline"
            >
              Contactar con soporte técnico
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3 lg:col-span-8">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <FaqItem key={faq.question} faq={faq} isFirst={index === 0} />
          ))
        ) : (
          <div className="rounded-2xl border border-[#E9E4D8] bg-white p-8 text-center">
            <p className="text-stone-500">
              No se encontraron preguntas para &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
