import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import WorkingHoursCalculator from "@/components/calculators/WorkingHoursCalculator";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Calculadora de horas de trabajo | NumeroSemanas",
  description:
    "Calcula tus horas de trabajo diarias, semanales y mensuales. Incluye pausas y diferentes tipos de jornada laboral.",
  alternates: { canonical: "/calculadora-horas-trabajo" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/calculadora-horas-trabajo`,
    title: "Calculadora de horas de trabajo",
    description:
      "Calcula tus horas de trabajo con pausas y diferentes jornadas.",
    siteName: "NumeroSemanas",
  },
};

const faqs = [
  {
    question: "¿Cuántas horas tiene una jornada laboral estándar en España?",
    answer:
      "La jornada laboral máxima legal en España es de <strong>40 horas semanales</strong> de media anual. Una jornada típica de 8 horas diarias, 5 días a la semana, cumple este límite.",
  },
  {
    question: "¿Qué es la jornada intensiva?",
    answer:
      "La <strong>jornada intensiva</strong> concentra las horas de trabajo en menos tiempo, típicamente de 8:00 a 15:00 sin pausa para comer. Es común en verano y en algunos sectores.",
  },
  {
    question: "¿Se descuenta la pausa para comer de las horas de trabajo?",
    answer:
      "Generalmente sí. Las pausas de más de 15 minutos suelen <strong>no contar</strong> como tiempo de trabajo efectivo, aunque depende del convenio colectivo.",
  },
  {
    question: "¿Cuántas horas al mes son 40 horas semanales?",
    answer:
      "40 horas semanales equivalen aproximadamente a <strong>173 horas mensuales</strong> (40 × 4,33 semanas). El número exacto varía según los días laborables del mes.",
  },
];

const relatedLinks = [
  { label: "Planificador de vacaciones", href: "/planificador-vacaciones" },
  { label: "Calculadora de días", href: "/calculadora-dias-entre-fechas" },
  { label: "Días laborables", href: "/dias-laborables" },
  { label: "Calendario laboral", href: "/calendario-laboral" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de horas de trabajo",
  description:
    "Calcula tus horas de trabajo diarias, semanales y mensuales.",
  url: `${SITE_URL}/calculadora-horas-trabajo`,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function WorkingHoursPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Horas de trabajo" },
          ]}
        />

        <header className="mb-8 mt-6">
          <span className="inline-block rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
            Calculadora
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            Calculadora de horas de trabajo
          </h1>
          <p className="mt-3 text-lg text-muted">
            Calcula tus horas de trabajo diarias, semanales y mensuales.
            Incluye pausas y diferentes tipos de jornada laboral.
          </p>
        </header>

        <WorkingHoursCalculator />

        <section className="mt-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Tipos de jornada laboral en España
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <ul>
              <li>
                <strong>Jornada partida:</strong> Con pausa para comer
                (típicamente 9:00-14:00 y 15:00-18:00).
              </li>
              <li>
                <strong>Jornada intensiva:</strong> Sin interrupción para comer
                (típicamente 8:00-15:00).
              </li>
              <li>
                <strong>Media jornada:</strong> Trabajo a tiempo parcial,
                generalmente por la mañana o por la tarde.
              </li>
              <li>
                <strong>Jornada flexible:</strong> Horarios variables según
                acuerdo con la empresa.
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
