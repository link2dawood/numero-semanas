import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SummerCountdown from "@/components/calculators/SummerCountdown";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Días hasta verano — Cuenta atrás al solsticio | NumeroSemanas",
  description:
    "¿Cuántos días faltan para el verano? Cuenta atrás en tiempo real al verano astronómico (solsticio de junio) o meteorológico (1 de junio) en España.",
  alternates: { canonical: "/dias-hasta-verano" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/dias-hasta-verano`,
    title: "Cuenta atrás hasta el verano",
    description:
      "Días, horas y minutos que faltan para el verano astronómico o meteorológico.",
    siteName: "NumeroSemanas",
  },
};

const faqs = [
  {
    question: "¿Cuándo empieza el verano en España?",
    answer:
      "Depende de qué definición uses. El <strong>verano astronómico</strong> comienza con el solsticio de junio (alrededor del 20-21 de junio). El <strong>verano meteorológico</strong> comienza el 1 de junio.",
  },
  {
    question: "¿Cuál es la diferencia entre verano astronómico y meteorológico?",
    answer:
      "El verano astronómico está basado en la posición de la Tierra respecto al Sol (solsticio). El meteorológico divide el año en trimestres para facilitar comparaciones climáticas: junio, julio y agosto son los meses de verano.",
  },
  {
    question: "¿Cuándo es el solsticio de verano exactamente?",
    answer:
      "El solsticio de verano ocurre cuando el Sol alcanza su punto más alto en el cielo del hemisferio norte. La fecha exacta varía entre el 20 y el 22 de junio según el año. Esta calculadora usa el 21 de junio como aproximación.",
  },
  {
    question: "¿Cuándo termina el verano?",
    answer:
      "El verano astronómico termina con el equinoccio de otoño (alrededor del 22-23 de septiembre). El verano meteorológico termina el 31 de agosto.",
  },
];

const relatedLinks = [
  { label: "Días hasta Año Nuevo", href: "/dias-hasta-ano-nuevo" },
  { label: "Días hasta Navidad", href: "/dias-hasta-navidad" },
  { label: "Solsticio de invierno", href: "/solsticio-invierno" },
  { label: "Amanecer y atardecer", href: "/amanecer-atardecer" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Días hasta verano",
  description:
    "Cuenta atrás en tiempo real hasta el verano astronómico o meteorológico en España.",
  url: `${SITE_URL}/dias-hasta-verano`,
  isPartOf: {
    "@type": "WebSite",
    name: "NumeroSemanas",
    url: SITE_URL,
  },
};

export default function SummerCountdownPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Días hasta verano" },
          ]}
        />

        <header className="mb-8 mt-6">
          <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            Cuenta atrás
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            ¿Cuántos días faltan para el verano?
          </h1>
          <p className="mt-3 text-lg text-muted">
            Cuenta atrás en tiempo real hasta el verano. Elige entre el verano
            astronómico (solsticio) o el meteorológico (1 de junio).
          </p>
        </header>

        <SummerCountdown />

        <div className="mt-10">
          <RelatedLinks links={relatedLinks} />
        </div>

        <div className="mt-10">
          <FaqBlock faqs={faqs} />
        </div>
      </main>

      <JsonLd data={structuredData} />
      <JsonLd data={faqPageJsonLd(faqs)} />
    </>
  );
}
