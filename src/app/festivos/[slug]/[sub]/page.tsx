import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import {
  nationalHolidaysForYear,
  holidaysForYearAndTerritory,
  TERRITORIES,
  hasVerifiedData,
  getSource,
  type Holiday,
  type TerritorySlug,
} from "@/lib/holidays";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";
import { capitalize, formatLong, weekdayName, isoWeek } from "@/lib/weeks";

type SubPageProps = { params: Promise<{ slug: string; sub: string }> };

const MIN_YEAR = 2020;
const MAX_YEAR = 2028;
const TERRITORY_SLUGS = new Set(TERRITORIES.map((t) => t.slug));
const TERRITORY_MAP = new Map(TERRITORIES.map((t) => [t.slug, t.name]));

// Known holiday slugs with their canonical names
const HOLIDAY_SLUGS: Record<string, { name: string; searchTerms: string[] }> = {
  "ano-nuevo": { name: "Año Nuevo", searchTerms: ["año nuevo", "1 enero"] },
  "reyes": { name: "Epifanía del Señor", searchTerms: ["reyes", "epifanía", "6 enero"] },
  "viernes-santo": { name: "Viernes Santo", searchTerms: ["viernes santo"] },
  "fiesta-del-trabajo": { name: "Fiesta del Trabajo", searchTerms: ["trabajo", "1 mayo"] },
  "asuncion": { name: "Asunción de la Virgen", searchTerms: ["asunción", "15 agosto"] },
  "fiesta-nacional": { name: "Fiesta Nacional de España", searchTerms: ["fiesta nacional", "12 octubre", "hispanidad"] },
  "todos-los-santos": { name: "Todos los Santos", searchTerms: ["todos los santos", "1 noviembre"] },
  "constitucion": { name: "Día de la Constitución Española", searchTerms: ["constitución", "6 diciembre"] },
  "inmaculada": { name: "Inmaculada Concepción", searchTerms: ["inmaculada", "8 diciembre"] },
  "navidad": { name: "Natividad del Señor", searchTerms: ["navidad", "25 diciembre"] },
};

function isYear(str: string): boolean {
  const num = Number(str);
  return Number.isInteger(num) && num >= MIN_YEAR && num <= MAX_YEAR;
}

function isCommunity(str: string): boolean {
  return TERRITORY_SLUGS.has(str as TerritorySlug);
}

function isHolidaySlug(str: string): boolean {
  return str in HOLIDAY_SLUGS;
}

function findHoliday(holidays: Holiday[], slug: string): Holiday | null {
  const slugInfo = HOLIDAY_SLUGS[slug];
  if (!slugInfo) return null;

  return holidays.find((h) =>
    h.name === slugInfo.name ||
    slugInfo.searchTerms.some((term) => h.name.toLowerCase().includes(term))
  ) ?? null;
}

export function generateStaticParams() {
  const params: { slug: string; sub: string }[] = [];

  // Community + Year combinations
  for (const territory of TERRITORIES) {
    for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
      params.push({ slug: territory.slug, sub: String(year) });
    }
  }

  // Year + Holiday combinations
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    for (const holidaySlug of Object.keys(HOLIDAY_SLUGS)) {
      params.push({ slug: String(year), sub: holidaySlug });
    }
  }

  return params;
}

export const revalidate = 86400;

export async function generateMetadata({ params }: SubPageProps): Promise<Metadata> {
  const { slug, sub } = await params;

  // Pattern: community/year (e.g., madrid/2027)
  if (isCommunity(slug) && isYear(sub)) {
    const year = Number(sub);
    const name = TERRITORY_MAP.get(slug as TerritorySlug);

    if (!name) return { title: "Festivos no encontrados | NumeroSemanas" };

    return {
      title: `Festivos ${year} en ${name} — Calendario laboral | NumeroSemanas`,
      description: `Calendario completo de festivos de ${year} en ${name}: festivos nacionales, autonómicos y días de descanso oficial.`,
      alternates: { canonical: `/festivos/${slug}/${year}` },
      openGraph: {
        type: "website",
        locale: "es_ES",
        url: `${SITE_URL}/festivos/${slug}/${year}`,
        title: `Festivos ${year} en ${name}`,
        description: `Festivos nacionales y autonómicos de ${year} en ${name}.`,
        siteName: "NumeroSemanas",
      },
    };
  }

  // Pattern: year/holiday (e.g., 2027/navidad)
  if (isYear(slug) && isHolidaySlug(sub)) {
    const year = Number(slug);
    const holidays = nationalHolidaysForYear(year);
    const holiday = findHoliday(holidays, sub);

    if (!holiday) return { title: "Festivo no encontrado | NumeroSemanas" };

    const date = new Date(holiday.date + "T00:00:00");

    return {
      title: `${holiday.name} ${year} — ${formatLong(date)} | NumeroSemanas`,
      description: `${holiday.name} en ${year} cae el ${capitalize(weekdayName(date))}, ${formatLong(date)}. Consulta si es festivo nacional, autonómico o local.`,
      alternates: { canonical: `/festivos/${year}/${sub}` },
      openGraph: {
        type: "article",
        locale: "es_ES",
        url: `${SITE_URL}/festivos/${year}/${sub}`,
        title: `${holiday.name} ${year}`,
        description: `${formatLong(date)} — ${capitalize(weekdayName(date))}`,
        siteName: "NumeroSemanas",
      },
    };
  }

  return { title: "Festivos no encontrados | NumeroSemanas" };
}

export default async function SubPage({ params }: SubPageProps) {
  const { slug, sub } = await params;

  // Pattern: community/year (e.g., madrid/2027)
  if (isCommunity(slug) && isYear(sub)) {
    return <CommunityYearContent community={slug} year={Number(sub)} />;
  }

  // Pattern: year/holiday (e.g., 2027/navidad)
  if (isYear(slug) && isHolidaySlug(sub)) {
    return <HolidayContent year={Number(slug)} holidaySlug={sub} />;
  }

  notFound();
}

// ============================================================================
// Community + Year Content
// ============================================================================
function CommunityYearContent({ community, year }: { community: string; year: number }) {
  const name = TERRITORY_MAP.get(community as TerritorySlug);

  if (!name) {
    notFound();
  }

  const holidays = holidaysForYearAndTerritory(year, community as TerritorySlug)
    .filter((h) => h.type === "day_off")
    .sort((a, b) => a.date.localeCompare(b.date));

  const national = holidays.filter((h) => h.scope === "national");
  const regional = holidays.filter((h) => h.scope === "regional");
  const verified = hasVerifiedData(year);
  const source = getSource(year);

  const faqs = [
    {
      question: `¿Cuántos festivos hay en ${name} en ${year}?`,
      answer: `En ${name} hay <strong>${holidays.length} días festivos</strong> en ${year}: ${national.length} nacionales y ${regional.length} autonómicos. Además, cada municipio tiene 2 festivos locales.`,
    },
    {
      question: `¿Los festivos de ${name} se aplican en toda la comunidad?`,
      answer: `Sí, los festivos autonómicos se aplican en <strong>toda ${name}</strong>. Los festivos locales (2 por municipio) pueden variar según cada ayuntamiento.`,
    },
    {
      question: "¿Dónde puedo ver los festivos locales de mi municipio?",
      answer:
        "Los festivos locales se publican en el boletín oficial de cada provincia y en la web de tu ayuntamiento. NumeroSemanas muestra los festivos nacionales y autonómicos.",
    },
  ];

  const relatedLinks = [
    { label: `Festivos nacionales ${year}`, href: `/festivos/${year}` },
    { label: `Calendario ${year}`, href: `/calendario/${year}` },
    year > MIN_YEAR
      ? { label: `${name} ${year - 1}`, href: `/festivos/${community}/${year - 1}` }
      : null,
    year < MAX_YEAR
      ? { label: `${name} ${year + 1}`, href: `/festivos/${community}/${year + 1}` }
      : null,
  ].filter(Boolean) as { label: string; href: string }[];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Festivos ${year} en ${name}`,
    description: `Calendario de festivos de ${year} en ${name}.`,
    url: `${SITE_URL}/festivos/${community}/${year}`,
  };

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Festivos", href: "/festivos-por-comunidad" },
            { label: name, href: `/festivos/${community}/${year}` },
            { label: String(year) },
          ]}
        />

        <header className="mb-8 mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
              {name}
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
            Festivos {year} en {name}
          </h1>
          <p className="mt-3 text-lg text-muted">
            Calendario completo con festivos nacionales y autonómicos.{" "}
            <strong>{holidays.length} días</strong> festivos en total.
          </p>
        </header>

        {/* Complete Calendar */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Todos los festivos ({holidays.length})
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full">
              <thead className="bg-cream/50 text-left text-sm font-medium text-muted">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Día</th>
                  <th className="px-4 py-3">Festivo</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Ámbito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {holidays.map((holiday) => {
                  const date = new Date(holiday.date + "T00:00:00");
                  const isSunday = date.getDay() === 0;
                  const isRegional = holiday.scope === "regional";
                  return (
                    <tr
                      key={holiday.date + holiday.name}
                      className={
                        isSunday
                          ? "bg-amber-50/50"
                          : isRegional
                            ? "bg-olive/5"
                            : ""
                      }
                    >
                      <td className="px-4 py-3 font-medium text-forest-dark">
                        {formatLong(date)}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {capitalize(weekdayName(date))}
                      </td>
                      <td className="px-4 py-3">
                        {holiday.name}
                        <span className="ml-2 inline sm:hidden">
                          {isRegional && (
                            <span className="rounded bg-olive/10 px-1.5 py-0.5 text-xs text-olive-dark">
                              Autonómico
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        {isRegional ? (
                          <span className="rounded-full bg-olive/10 px-2 py-1 text-xs font-medium text-olive-dark">
                            Autonómico
                          </span>
                        ) : (
                          <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
                            Nacional
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                  href={`/festivos/${community}/${y}`}
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

        {/* Other Communities */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Otras comunidades
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {TERRITORIES.filter((t) => t.slug !== community).map((territory) => (
              <Link
                key={territory.slug}
                href={`/festivos/${territory.slug}/${year}`}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-forest-dark transition hover:border-olive hover:bg-cream"
              >
                {territory.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Source Info */}
        <section className="mb-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Fuentes oficiales
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <p>
              Los festivos nacionales se publican en el{" "}
              <strong>Boletín Oficial del Estado (BOE)</strong>
              {source && (
                <>
                  {": "}
                  <a
                    href={`https://www.boe.es/buscar/doc.php?id=${source}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-olive underline"
                  >
                    {source}
                  </a>
                </>
              )}
              .
            </p>
            <p>
              Los festivos autonómicos de {name} se publican en su boletín
              oficial autonómico. Los festivos locales varían por municipio.
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

// ============================================================================
// Year + Holiday Content
// ============================================================================
function HolidayContent({ year, holidaySlug }: { year: number; holidaySlug: string }) {
  const holidays = nationalHolidaysForYear(year);
  const holiday = findHoliday(holidays, holidaySlug);

  if (!holiday) {
    notFound();
  }

  const date = new Date(holiday.date + "T00:00:00");
  const isSunday = date.getDay() === 0;
  const { week, year: isoYear } = isoWeek(date);

  // Get other years for this holiday
  const otherYears = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => {
    const y = MIN_YEAR + i;
    const yHolidays = nationalHolidaysForYear(y);
    const yHoliday = findHoliday(yHolidays, holidaySlug);
    if (!yHoliday) return null;
    const yDate = new Date(yHoliday.date + "T00:00:00");
    return {
      year: y,
      date: yHoliday.date,
      weekday: capitalize(weekdayName(yDate)),
      isSunday: yDate.getDay() === 0,
    };
  }).filter(Boolean) as { year: number; date: string; weekday: string; isSunday: boolean }[];

  const faqs = [
    {
      question: `¿Qué día cae ${holiday.name} en ${year}?`,
      answer: `En ${year}, ${holiday.name} cae el <strong>${capitalize(weekdayName(date))}</strong>, ${formatLong(date)}.${isSunday ? " Como cae en domingo, no hay día de descanso adicional." : ""}`,
    },
    {
      question: `¿${holiday.name} es festivo en toda España?`,
      answer:
        holiday.scope === "national"
          ? `Sí, ${holiday.name} es un <strong>festivo nacional</strong> que se celebra en toda España.`
          : `${holiday.name} no es festivo nacional; solo se celebra en algunas comunidades autónomas.`,
    },
    {
      question: `¿En qué semana cae ${holiday.name} ${year}?`,
      answer: `${holiday.name} ${year} cae en la <strong>semana ${week}</strong> según la norma ISO 8601.`,
    },
  ];

  const relatedLinks = [
    { label: `Todos los festivos ${year}`, href: `/festivos/${year}` },
    { label: `Semana ${week} de ${year}`, href: `/semana/${week}/${year}` },
    { label: `Calendario ${year}`, href: `/calendario/${year}` },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: holiday.name,
    startDate: holiday.date,
    endDate: holiday.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Country",
      name: "España",
    },
    description: `${holiday.name} es un festivo ${holiday.scope === "national" ? "nacional" : "regional"} en España.`,
  };

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: `Festivos ${year}`, href: `/festivos/${year}` },
            { label: holiday.name },
          ]}
        />

        <header className="mb-8 mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              {holiday.scope === "national" ? "Festivo nacional" : "Festivo regional"}
            </span>
            {isSunday && (
              <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
                Cae en domingo
              </span>
            )}
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            {holiday.name} {year}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-olive-dark">
            {capitalize(weekdayName(date))}, {formatLong(date)}
          </p>
          <p className="mt-2 text-muted">
            Semana {week} · Año ISO {isoYear}
          </p>
        </header>

        {/* Date Card */}
        <section className="mb-10">
          <div className="inline-flex flex-col items-center rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-amber-800">
              {capitalize(weekdayName(date))}
            </p>
            <p className="mt-2 text-6xl font-bold text-forest-dark">
              {date.getDate()}
            </p>
            <p className="mt-1 text-lg text-muted">
              {capitalize(formatLong(date).split(" de ").slice(1).join(" de "))}
            </p>
          </div>
        </section>

        {/* Where it's celebrated */}
        {holiday.scope === "national" && (
          <section className="mb-10 rounded-2xl border border-border bg-cream/50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-forest-dark">
              Ámbito de aplicación
            </h2>
            <p className="text-muted">
              {holiday.name} es un <strong>festivo nacional</strong> y se celebra en las{" "}
              <strong>17 comunidades autónomas</strong> y las 2 ciudades autónomas de España.
              Es un día de descanso laboral en todo el territorio nacional.
            </p>
          </section>
        )}

        {/* Same holiday in other years */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            {holiday.name} en otros años
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full">
              <thead className="bg-cream/50 text-left text-sm font-medium text-muted">
                <tr>
                  <th className="px-4 py-3">Año</th>
                  <th className="px-4 py-3">Día de la semana</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {otherYears.map((item) => (
                  <tr
                    key={item.year}
                    className={
                      item.year === year
                        ? "bg-olive/5 font-medium"
                        : item.isSunday
                          ? "bg-amber-50/50"
                          : ""
                    }
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/festivos/${item.year}/${holidaySlug}`}
                        className="text-olive-dark underline hover:text-olive"
                      >
                        {item.year}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {item.weekday}
                      {item.isSunday && (
                        <span className="ml-2 text-xs text-amber-600">
                          (domingo)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatLong(new Date(item.date + "T00:00:00"))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
