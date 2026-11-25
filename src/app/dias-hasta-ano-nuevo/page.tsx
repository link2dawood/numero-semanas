import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewYearCountdown from "@/components/calculators/NewYearCountdown";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";

const nextYear = new Date().getFullYear() + 1;

export const metadata: Metadata = {
  title: `Días hasta Año Nuevo ${nextYear} — Cuenta atrás | NumeroSemanas`,
  description: `¿Cuántos días faltan para Año Nuevo ${nextYear}? Cuenta atrás en tiempo real con días, horas, minutos y segundos hasta el 1 de enero.`,
  alternates: { canonical: "/dias-hasta-ano-nuevo" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/dias-hasta-ano-nuevo`,
    title: `Cuenta atrás hasta Año Nuevo ${nextYear}`,
    description: `Días, horas y minutos que faltan para el 1 de enero de ${nextYear}.`,
    siteName: "NumeroSemanas",
  },
};

const faqs = [
  {
    question: `¿Cuántos días faltan para Año Nuevo ${nextYear}?`,
    answer: `La cuenta atrás en esta página se actualiza en tiempo real. Muestra los días, horas, minutos y segundos exactos hasta la medianoche del 1 de enero de ${nextYear}.`,
  },
  {
    question: "¿El 1 de enero es siempre la semana 1?",
    answer:
      "No necesariamente. Según la norma <strong>ISO 8601</strong>, la semana 1 es la que contiene el primer jueves del año. El 1 de enero puede caer en la semana 52 o 53 del año anterior.",
  },
  {
    question: "¿Se actualiza automáticamente cada año?",
    answer:
      "Sí, cuando llega Año Nuevo, la cuenta atrás se reinicia automáticamente para mostrar los días hasta el siguiente año.",
  },
  {
    question: "¿Qué zona horaria usa la cuenta atrás?",
    answer:
      "La cuenta atrás usa la hora local de tu dispositivo. La medianoche de Año Nuevo ocurrirá según tu zona horaria.",
  },
];

const relatedLinks = [
  { label: "Días hasta verano", href: "/dias-hasta-verano" },
  { label: "Días hasta Navidad", href: "/dias-hasta-navidad" },
  { label: "Calculadora de días", href: "/calculadora-dias-entre-fechas" },
  { label: `Calendario ${nextYear}`, href: `/calendario/${nextYear}` },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Días hasta Año Nuevo ${nextYear}`,
  description: `Cuenta atrás en tiempo real hasta el 1 de enero de ${nextYear}.`,
  url: `${SITE_URL}/dias-hasta-ano-nuevo`,
  isPartOf: {
    "@type": "WebSite",
    name: "NumeroSemanas",
    url: SITE_URL,
  },
};

export default function NewYearCountdownPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Días hasta Año Nuevo" },
          ]}
        />

        <header className="mb-8 mt-6">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Cuenta atrás
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            ¿Cuántos días faltan para Año Nuevo?
          </h1>
          <p className="mt-3 text-lg text-muted">
            Cuenta atrás en tiempo real hasta la medianoche del 1 de enero.
            Incluye días, horas, minutos y segundos.
          </p>
        </header>

        <NewYearCountdown />

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
