import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import {
  nationalHolidaysForYear,
  TERRITORIES,
  getSource,
  hasVerifiedData,
  type TerritorySlug,
} from "@/lib/holidays";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";
import { capitalize, formatLong, weekdayName } from "@/lib/weeks";

type FestivosSlugPageProps = { params: Promise<{ slug: string }> };

const MIN_YEAR = 2020;
const MAX_YEAR = 2028;
const TERRITORY_SLUGS = new Set(TERRITORIES.map((t) => t.slug));

function isYear(slug: string): boolean {
  const num = Number(slug);
  return Number.isInteger(num) && num >= MIN_YEAR && num <= MAX_YEAR;
}

function isCommunity(slug: string): boolean {
  return TERRITORY_SLUGS.has(slug as TerritorySlug);
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  // Years
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    params.push({ slug: String(year) });
  }
  // Communities
  for (const territory of TERRITORIES) {
    params.push({ slug: territory.slug });
  }
  return params;
}

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: FestivosSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isYear(slug)) {
    const year = Number(slug);
    const verified = hasVerifiedData(year);
    const status = verified ? "" : " (proyectados)";

    return {
      title: `Festivos ${year} en España — Calendario laboral${status} | NumeroSemanas`,
      description: `Festivos nacionales de ${year} en España según el BOE. Consulta las fechas oficiales, días de descanso y festivos por comunidad autónoma.`,
      alternates: { canonical: `/festivos/${year}` },
      openGraph: {
        type: "website",
        locale: "es_ES",
        url: `${SITE_URL}/festivos/${year}`,
        title: `Festivos ${year} en España`,
        description: `Calendario de festivos nacionales y autonómicos de ${year}.`,
        siteName: "NumeroSemanas",
      },
    };
  }

  if (isCommunity(slug)) {
    return { title: "Redirigiendo... | NumeroSemanas" };
  }

  return { title: "Festivos no encontrados | NumeroSemanas" };
}

export default async function FestivosSlugPage({ params }: FestivosSlugPageProps) {
  const { slug } = await params;

  // Handle community → redirect to current year
  if (isCommunity(slug)) {
    const now = new Date();
    const year = now.getMonth() >= 10 ? now.getFullYear() + 1 : now.getFullYear();
    redirect(`/festivos/${slug}/${year}`);
  }

  // Handle year → show national holidays
  if (!isYear(slug)) {
    notFound();
  }

  const year = Number(slug);
  const holidays = nationalHolidaysForYear(year).filter((h) => h.type === "day_off");
  const source = getSource(year);
  const verified = hasVerifiedData(year);

  const national = holidays.filter((h) => h.scope === "national");

  const faqs = [
    {
      question: `¿Cuántos festivos nacionales hay en ${year}?`,
      answer: `En ${year} hay <strong>${national.length} festivos nacionales</strong> según el calendario laboral oficial publicado en el BOE.`,
    },
    {
      question: "¿Cuál es la diferencia entre festivos nacionales y autonómicos?",
      answer:
        "Los <strong>festivos nacionales</strong> se aplican en toda España. Los <strong>festivos autonómicos</strong> solo se aplican en determinadas comunidades autónomas. Además, cada municipio tiene 2 festivos locales.",
    },
    {
      question: "¿Qué festivos son irrenunciables?",
      answer:
        "Según el BOE, los festivos <strong>irrenunciables</strong> son: Año Nuevo (1 enero), Fiesta del Trabajo (1 mayo), Fiesta Nacional de España (12 octubre), Navidad (25 diciembre), y Viernes Santo.",
    },
    {
      question: "¿Qué pasa si un festivo cae en domingo?",
      answer:
        "Algunos festivos <strong>se trasladan al lunes siguiente</strong> cuando caen en domingo. Sin embargo, los festivos irrenunciables no se trasladan y simplemente coinciden con domingo.",
    },
  ];

  const relatedLinks = [
    { label: `Calendario ${year}`, href: `/calendario/${year}` },
    { label: `Semanas ${year}`, href: `/semanas/${year}` },
    year > MIN_YEAR
      ? { label: `Festivos ${year - 1}`, href: `/festivos/${year - 1}` }
      : null,
    year < MAX_YEAR
      ? { label: `Festivos ${year + 1}`, href: `/festivos/${year + 1}` }
      : null,
  ].filter(Boolean) as { label: string; href: string }[];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Festivos ${year} en España`,
    description: `Calendario de festivos nacionales de ${year} según el BOE.`,
    url: `${SITE_URL}/festivos/${year}`,
    isPartOf: {
      "@type": "WebSite",
      name: "NumeroSemanas",
      url: SITE_URL,
    },
  };

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Festivos", href: "/festivos-por-comunidad" },
            { label: String(year) },
          ]}
        />

        <header className="mb-8 mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              Calendario laboral
            </span>
            {verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                ✓ Verificado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
                Proyectado
              </span>
            )}
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            Festivos {year} en España
          </h1>
          <p className="mt-3 text-lg text-muted">
            Calendario de festivos nacionales y días de descanso oficial según el BOE.
          </p>
          {source && (
            <p className="mt-2 text-sm text-muted">
              Fuente:{" "}
              <a
                href={`https://www.boe.es/buscar/doc.php?id=${source}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-olive underline hover:text-olive-dark"
              >
                {source}
              </a>
            </p>
          )}
        </header>

        {/* National Holidays */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Festivos nacionales ({national.length})
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full">
              <thead className="bg-cream/50 text-left text-sm font-medium text-muted">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Día</th>
                  <th className="px-4 py-3">Festivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {national.map((holiday) => {
                  const date = new Date(holiday.date + "T00:00:00");
                  const isSunday = date.getDay() === 0;
                  return (
                    <tr
                      key={holiday.date + holiday.name}
                      className={isSunday ? "bg-amber-50/50" : ""}
                    >
                      <td className="px-4 py-3 font-medium text-forest-dark">
                        {formatLong(date)}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {capitalize(weekdayName(date))}
                        {isSunday && (
                          <span className="ml-2 text-xs text-amber-600">
                            (domingo)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{holiday.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Communities */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Festivos por comunidad autónoma
          </h2>
          <p className="mb-4 text-muted">
            Además de los festivos nacionales, cada comunidad autónoma tiene sus
            propios días festivos. Selecciona tu comunidad para ver el
            calendario completo.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {TERRITORIES.map((territory) => (
              <Link
                key={territory.slug}
                href={`/festivos/${territory.slug}/${year}`}
                className="rounded-xl border border-border bg-card px-4 py-3 font-medium text-forest-dark transition hover:border-olive hover:bg-cream"
              >
                {territory.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Year Navigation */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Otros años
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => {
              const y = MIN_YEAR + i;
              const isActive = y === year;
              return (
                <Link
                  key={y}
                  href={`/festivos/${y}`}
                  className={`rounded-xl border px-4 py-2 font-medium transition ${
                    isActive
                      ? "border-olive bg-olive text-white"
                      : "border-border bg-card text-forest-dark hover:bg-cream"
                  }`}
                >
                  {y}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Info Box */}
        <section className="mb-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Sobre el calendario laboral
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <p>
              El calendario de festivos nacionales se publica anualmente en el{" "}
              <strong>Boletín Oficial del Estado (BOE)</strong>, normalmente en
              octubre del año anterior. Las comunidades autónomas publican sus
              propios festivos en sus boletines oficiales.
            </p>
            <p>
              Cada municipio tiene además <strong>2 festivos locales</strong>{" "}
              que pueden variar. Consulta el calendario de tu ayuntamiento para
              conocer las fechas exactas.
            </p>
          </div>
        </section>

        <RelatedLinks links={relatedLinks} />

        <div className="mt-10">
          <FaqBlock faqs={faqs} />
        </div>
      </main>

      <JsonLd data={structuredData} />
      <JsonLd data={faqPageJsonLd(faqs)} />
    </>
  );
}
