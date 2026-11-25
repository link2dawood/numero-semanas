import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import AddDaysCalculator from "@/components/calculators/AddDaysCalculator";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Calculadora: sumar o restar días a una fecha | NumeroSemanas",
  description:
    "Suma o resta días a cualquier fecha y obtén la fecha resultante, el día de la semana y el número de semana ISO.",
  alternates: { canonical: "/calculadora-sumar-dias" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/calculadora-sumar-dias`,
    title: "Sumar o restar días a una fecha",
    description:
      "Calcula qué fecha será dentro de X días o qué fecha fue hace X días.",
    siteName: "NumeroSemanas",
  },
};

const faqs = [
  {
    question: "¿Cómo sumo días a una fecha?",
    answer:
      "Selecciona la fecha de inicio, introduce el número de días y pulsa <strong>Sumar</strong>. La calculadora mostrará la fecha resultante.",
  },
  {
    question: "¿Cómo resto días a una fecha?",
    answer:
      "Selecciona la fecha de inicio, introduce el número de días y pulsa <strong>Restar</strong>. Obtendrás la fecha que fue hace ese número de días.",
  },
  {
    question: "¿Se tienen en cuenta los años bisiestos?",
    answer:
      "Sí, la calculadora tiene en cuenta correctamente los años bisiestos (29 días en febrero) y los diferentes días de cada mes.",
  },
  {
    question: "¿Qué es la semana ISO que aparece en el resultado?",
    answer:
      "Es el número de semana según la norma <strong>ISO 8601</strong>, donde la semana empieza el lunes y la semana 1 es la que contiene el primer jueves del año.",
  },
];

const relatedLinks = [
  { label: "Días entre fechas", href: "/calculadora-dias-entre-fechas" },
  { label: "Calculadora de semanas", href: "/calculadora-semanas" },
  { label: "Calculadora de edad", href: "/calculadora-edad" },
  { label: "Días hasta Año Nuevo", href: "/dias-hasta-ano-nuevo" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora: sumar o restar días",
  description:
    "Suma o resta días a cualquier fecha y obtén la fecha resultante con su día de la semana y semana ISO.",
  url: `${SITE_URL}/calculadora-sumar-dias`,
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

export default function AddDaysPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Sumar días" },
          ]}
        />

        <header className="mb-8 mt-6">
          <span className="inline-block rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
            Calculadora
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            Sumar o restar días
          </h1>
          <p className="mt-3 text-lg text-muted">
            Calcula qué fecha será dentro de un número de días, o qué fecha fue
            hace un número de días. Incluye el día de la semana y la semana ISO.
          </p>
        </header>

        <AddDaysCalculator />

        <section className="mt-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Ejemplos de uso
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <ul>
              <li>
                <strong>¿Qué fecha será dentro de 90 días?</strong> — Útil para
                calcular vencimientos de plazos o períodos de prueba.
              </li>
              <li>
                <strong>¿Qué día fue hace 30 días?</strong> — Para recordar
                fechas de compras, inicio de servicios, etc.
              </li>
              <li>
                <strong>¿En qué semana cae una fecha?</strong> — Para
                planificar turnos, vacaciones o entregas semanales.
              </li>
            </ul>
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
