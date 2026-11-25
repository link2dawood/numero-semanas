import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import VacationPlanner from "@/components/calculators/VacationPlanner";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Planificador de vacaciones — Calcula días laborables | NumeroSemanas",
  description:
    "Planifica tus vacaciones calculando días laborables, festivos y fines de semana. Descubre puentes y maximiza tus días libres.",
  alternates: { canonical: "/planificador-vacaciones" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/planificador-vacaciones`,
    title: "Planificador de vacaciones",
    description:
      "Calcula los días laborables de tus vacaciones y encuentra los mejores puentes.",
    siteName: "NumeroSemanas",
  },
};

const faqs = [
  {
    question: "¿Cómo calcula los días de vacaciones?",
    answer:
      "El planificador cuenta los <strong>días laborables</strong> (lunes a viernes) excluyendo festivos nacionales. Los festivos autonómicos y locales no están incluidos, así que revisa el calendario de tu zona.",
  },
  {
    question: "¿Qué es la eficiencia de vacaciones?",
    answer:
      "La eficiencia mide cuántos días libres disfrutas por cada día de vacaciones que gastas. Un valor de 1.5 significa que por cada día laboral que pides, tienes 1.5 días libres en total.",
  },
  {
    question: "¿Cómo puedo maximizar mis vacaciones?",
    answer:
      "Busca <strong>puentes</strong>: festivos que caen en jueves o martes te permiten disfrutar de 4 días libres usando solo 1 día de vacaciones. El planificador te muestra estas oportunidades.",
  },
  {
    question: "¿Los datos se guardan en algún sitio?",
    answer:
      "No, todas las fechas que introduces se procesan <strong>localmente en tu navegador</strong>. No enviamos ningún dato a servidores externos.",
  },
];

const relatedLinks = [
  { label: "Calculadora de días", href: "/calculadora-dias-entre-fechas" },
  { label: "Horas de trabajo", href: "/calculadora-horas-trabajo" },
  { label: "Festivos 2027", href: "/festivos/2027" },
  { label: "Días laborables", href: "/dias-laborables" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Planificador de vacaciones",
  description:
    "Planifica tus vacaciones calculando días laborables, festivos y puentes.",
  url: `${SITE_URL}/planificador-vacaciones`,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function VacationPlannerPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Planificador de vacaciones" },
          ]}
        />

        <header className="mb-8 mt-6">
          <span className="inline-block rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
            Planificador
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            Planificador de vacaciones
          </h1>
          <p className="mt-3 text-lg text-muted">
            Calcula los días laborables de tus vacaciones, descubre los festivos
            incluidos y encuentra los mejores puentes para maximizar tus días
            libres.
          </p>
        </header>

        <VacationPlanner />

        <section className="mt-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Consejos para planificar vacaciones
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <ul>
              <li>
                <strong>Aprovecha los puentes:</strong> Los festivos que caen en
                jueves o martes son ideales para hacer puente con un solo día
                de vacaciones.
              </li>
              <li>
                <strong>Consulta tu convenio:</strong> Algunos convenios cuentan
                los días de vacaciones como naturales, otros como laborables.
              </li>
              <li>
                <strong>Revisa festivos locales:</strong> Este planificador usa
                festivos nacionales. Añade los festivos de tu comunidad y
                municipio.
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
