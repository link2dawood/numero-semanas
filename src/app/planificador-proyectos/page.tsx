import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProjectPlanner from "@/components/calculators/ProjectPlanner";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Planificador de proyectos — Calcula semanas ISO | NumeroSemanas",
  description:
    "Planifica proyectos calculando días laborables, semanas ISO y hitos. Organiza entregas y plazos con el calendario laboral español.",
  alternates: { canonical: "/planificador-proyectos" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/planificador-proyectos`,
    title: "Planificador de proyectos",
    description:
      "Calcula días laborables, semanas ISO e hitos para tu proyecto.",
    siteName: "NumeroSemanas",
  },
};

const faqs = [
  {
    question: "¿Cómo calcula los días laborables del proyecto?",
    answer:
      "El planificador cuenta los días de lunes a viernes, excluyendo <strong>festivos nacionales</strong>. Los festivos autonómicos y locales no están incluidos.",
  },
  {
    question: "¿Qué son los hitos de proyecto?",
    answer:
      "Los <strong>hitos</strong> son fechas clave que marcan entregas importantes, revisiones o eventos significativos del proyecto. Puedes añadir tantos como necesites.",
  },
  {
    question: "¿Por qué usar semanas ISO para proyectos?",
    answer:
      "Las <strong>semanas ISO</strong> proporcionan un sistema de numeración consistente: la semana 1 siempre contiene el primer jueves del año. Esto evita confusiones al coordinar equipos.",
  },
  {
    question: "¿Se guardan mis datos de proyecto?",
    answer:
      "No, todos los datos se procesan <strong>localmente en tu navegador</strong>. No guardamos ninguna información sobre tus proyectos.",
  },
];

const relatedLinks = [
  { label: "Planificador de vacaciones", href: "/planificador-vacaciones" },
  { label: "Calculadora de días", href: "/calculadora-dias-entre-fechas" },
  { label: "Calendario laboral", href: "/calendario-laboral" },
  { label: "Semanas 2027", href: "/semanas/2027" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Planificador de proyectos",
  description:
    "Planifica proyectos con días laborables, semanas ISO e hitos.",
  url: `${SITE_URL}/planificador-proyectos`,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function ProjectPlannerPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Planificador de proyectos" },
          ]}
        />

        <header className="mb-8 mt-6">
          <span className="inline-block rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
            Planificador
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            Planificador de proyectos
          </h1>
          <p className="mt-3 text-lg text-muted">
            Calcula la duración de tu proyecto en días laborables y semanas ISO.
            Añade hitos para visualizar el cronograma completo.
          </p>
        </header>

        <ProjectPlanner />

        <section className="mt-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Consejos para planificar proyectos
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <ul>
              <li>
                <strong>Define hitos claros:</strong> Establece fechas de
                entrega parciales para mantener el control del avance.
              </li>
              <li>
                <strong>Cuenta con margen:</strong> Los proyectos suelen
                necesitar más tiempo del previsto. Añade un 10-20% de buffer.
              </li>
              <li>
                <strong>Usa semanas ISO:</strong> Al comunicar plazos, indica
                «entrega semana 15» para evitar confusiones con fechas exactas.
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
