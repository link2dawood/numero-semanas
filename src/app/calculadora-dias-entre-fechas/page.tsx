import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import DaysBetweenCalculator from "@/components/calculators/DaysBetweenCalculator";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Calculadora de días entre fechas | NumeroSemanas",
  description:
    "Calcula cuántos días hay entre dos fechas. Incluye días naturales, laborables, semanas y la opción de incluir o excluir el último día.",
  alternates: { canonical: "/calculadora-dias-entre-fechas" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/calculadora-dias-entre-fechas`,
    title: "Calculadora de días entre fechas",
    description:
      "Calcula la diferencia entre dos fechas en días, semanas y días laborables.",
    siteName: "NumeroSemanas",
  },
};

const faqs = [
  {
    question: "¿Cómo se calculan los días entre dos fechas?",
    answer:
      "Se resta la fecha de inicio de la fecha de fin para obtener los días naturales. Si marcas la opción de incluir el último día, se suma uno al resultado.",
  },
  {
    question: "¿Qué son los días laborables?",
    answer:
      "Los días laborables son los días de lunes a viernes, excluyendo sábados y domingos. Esta calculadora <strong>no incluye festivos</strong>, que varían según tu localidad.",
  },
  {
    question: "¿Debo incluir el último día en el cálculo?",
    answer:
      "Depende del contexto. Para calcular la duración de unas vacaciones, normalmente se incluye. Para calcular plazos legales, consulta las reglas específicas que apliquen.",
  },
  {
    question: "¿Funciona con fechas en diferentes años?",
    answer:
      "Sí, la calculadora funciona con cualquier rango de fechas, incluyendo años bisiestos y cambios de siglo.",
  },
];

const relatedLinks = [
  { label: "Sumar o restar días", href: "/calculadora-sumar-dias" },
  { label: "Calculadora de semanas", href: "/calculadora-semanas" },
  { label: "Días hasta Año Nuevo", href: "/dias-hasta-ano-nuevo" },
  { label: "Días laborables 2027", href: "/dias-laborables-2027" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de días entre fechas",
  description:
    "Calcula cuántos días hay entre dos fechas, incluyendo días naturales y laborables.",
  url: `${SITE_URL}/calculadora-dias-entre-fechas`,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  provider: {
    "@type": "Organization",
    name: "NumeroSemanas",
    url: SITE_URL,
  },
};

export default function DaysBetweenPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Días entre fechas" },
          ]}
        />

        <header className="mb-8 mt-6">
          <span className="inline-block rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
            Calculadora
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            Días entre dos fechas
          </h1>
          <p className="mt-3 text-lg text-muted">
            Calcula cuántos días, semanas y días laborables hay entre dos
            fechas. Puedes elegir si incluir o no el último día.
          </p>
        </header>

        <DaysBetweenCalculator />

        <section className="mt-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Cómo usar esta calculadora
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <ol>
              <li>Selecciona la <strong>fecha de inicio</strong></li>
              <li>Selecciona la <strong>fecha de fin</strong></li>
              <li>Decide si quieres <strong>incluir el último día</strong></li>
              <li>Pulsa <strong>Calcular</strong> para ver el resultado</li>
            </ol>
            <p>
              La calculadora mostrará los días totales, las semanas completas
              con días restantes, y los días laborables (lunes a viernes).
            </p>
          </div>
        </section>

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
