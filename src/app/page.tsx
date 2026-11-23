import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import Apps from "@/components/sections/Apps";
import BrowseYears from "@/components/sections/BrowseYears";
import Calendar2027 from "@/components/sections/Calendar2027";
import ChooseCalendar from "@/components/sections/ChooseCalendar";
import FaqBlock from "@/components/FaqBlock";
import ParityAndIso from "@/components/sections/ParityAndIso";
import ToolsGrid from "@/components/sections/ToolsGrid";
import WeekHero from "@/components/hero/WeekHero";
import { getFaqs } from "@/lib/content";
import { homeJsonLd } from "@/lib/structured-data";
import {
  addDays,
  dateToIso,
  formatLong,
  isSameDay,
  isoWeek,
  mondayOf,
  parseIsoDate,
  weeksInYear,
} from "@/lib/weeks";

/** "del 9 al 15 de noviembre" or "del 28 de diciembre al 3 de enero". */
function weekRange(date: Date): string {
  const monday = mondayOf(date);
  const sunday = addDays(monday, 6);
  const dayMonth = (value: Date) => formatLong(value).replace(/ de \d{4}$/, "");
  return monday.getMonth() === sunday.getMonth()
    ? `del ${monday.getDate()} al ${dayMonth(sunday)}`
    : `del ${dayMonth(monday)} al ${dayMonth(sunday)}`;
}

export const revalidate = 3600;

const siteUrl = "https://numerosemanas.es";

type HomeProps = {
  searchParams: Promise<{ fecha?: string | string[] }>;
};

function todayInMadrid(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return parseIsoDate(`${values.year}-${values.month}-${values.day}`)!;
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const query = await searchParams;
  const today = todayInMadrid();
  const selectedDate = parseIsoDate(
    typeof query.fecha === "string" ? query.fecha : null,
  ) ?? today;
  const { week, year } = isoWeek(selectedDate);
  // Every ?fecha= value would otherwise be its own indexable near-duplicate of
  // the home page (unbounded URL space). Keep those out of the index but let
  // crawlers follow their links; the home page itself stays canonical.
  if (!isSameDay(selectedDate, today)) {
    return {
      title: `Semana ${week} de ${year} – ${formatLong(selectedDate)} | NumeroSemanas`,
      description: `El ${formatLong(selectedDate)} corresponde a la semana ${week} de ${year} según la norma ISO 8601.`,
      robots: { index: false, follow: true },
    };
  }
  const canonical = "/";
  return {
    // Leads with the main query ("qué semana es hoy"); the answer updates every Monday.
    title: `¿Qué semana es hoy? Semana ${week} de ${year} | NumeroSemanas`,
    description: `Hoy es la semana ${week} de ${year}, ${weekRange(today)}. Revisa sus fechas, el calendario ISO, los festivos nacionales y si la semana es par o impar.`,
    // Single-language site: no hreflang alternates needed.
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: new URL(canonical, siteUrl).toString(),
      siteName: "NumeroSemanas",
      title: `Semana ${week} de ${year} – Semana actual`,
      description: `Consulta el número de semana actual en España: semana ${week} de ${year}.`,
    },
  };
}

export default async function Home({ searchParams }: HomeProps) {
  // Reading searchParams keeps this page dynamically rendered, which lets the
  // client hero (useSearchParams) render on the server without a Suspense boundary.
  await searchParams;
  const todayDate = todayInMadrid();
  const today = dateToIso(todayDate);
  const { week, year } = isoWeek(todayDate);
  const nextWeek = isoWeek(addDays(todayDate, 7)).week;
  const faqs = getFaqs(week, nextWeek, year, weeksInYear(year));

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 lg:px-8">
        {/* Hero Week Section */}
        <WeekHero today={today} />

        {/* Banner 2027 & Planning Tools */}
        <Calendar2027 />

        <AdSlot id="ad-content" size="responsive" />

        {/* Parity and ISO Rules */}
        <ParityAndIso
          week={week}
          nextWeek={nextWeek}
          year={year}
          weeks={weeksInYear(year)}
        />

        {/* Year Selector */}
        <BrowseYears currentYear={year} />

        {/* Apps Section */}
        <Apps />

        {/* All Tools Directory */}
        <ToolsGrid />

        {/* FAQ Section */}
        <FaqBlock faqs={faqs} />

        {/* Choose Calendar & International */}
        <ChooseCalendar />
      </main>
      {/* WebSite + Organization, emitted once and only on the home page. */}
      <JsonLd data={homeJsonLd()} />
    </>
  );
}
