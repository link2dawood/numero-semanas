import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { nationalHolidaysForYear } from "@/lib/holidays";
import { SITE_URL } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/structured-data";
import {
  addDays,
  capitalize,
  dateToIso,
  formatLong,
  isoWeeksForYear,
  weekdayName,
  weeksInYear,
} from "@/lib/weeks";

// --- Types ---
type WeekYearPageProps = { params: Promise<{ n: string; year: string }> };

type DayInfo = {
  date: Date;
  iso: string;
  dayName: string;
  dayNumber: number;
  holiday: string | null;
  isToday: boolean;
};

type WeekData = {
  week: number;
  year: number;
  monday: Date;
  sunday: Date;
  days: DayInfo[];
  holidays: { name: string; date: string }[];
  parity: "par" | "impar";
  totalWeeksInYear: number;
};

// --- Constants ---
const MIN_YEAR = 2020;
const MAX_YEAR = 2035;
const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// --- Static Generation ---
export function generateStaticParams() {
  const params: { n: string; year: string }[] = [];
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    const weeks = weeksInYear(year);
    for (let week = 1; week <= weeks; week++) {
      params.push({ n: String(week), year: String(year) });
    }
  }
  return params;
}

export const revalidate = 3600; // ISR: regenerate hourly

// --- Helpers ---
function getWeekData(week: number, year: number): WeekData | null {
  const totalWeeks = weeksInYear(year);
  if (week < 1 || week > totalWeeks) return null;

  // Find the Monday of the requested week
  const allWeeks = isoWeeksForYear(year);
  const monday = allWeeks[week - 1];
  if (!monday) return null;

  const sunday = addDays(monday, 6);

  // Get holidays that fall within this week
  const yearHolidays = [
    ...nationalHolidaysForYear(year - 1),
    ...nationalHolidaysForYear(year),
    ...nationalHolidaysForYear(year + 1),
  ].filter((h) => h.type === "day_off");

  const mondayIso = dateToIso(monday);
  const sundayIso = dateToIso(sunday);
  const weekHolidays = yearHolidays.filter(
    (h) => h.date >= mondayIso && h.date <= sundayIso
  );

  // Build day-by-day info
  const today = new Date();
  const todayIso = dateToIso(today);
  const days: DayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    const iso = dateToIso(date);
    const holiday = weekHolidays.find((h) => h.date === iso);
    days.push({
      date,
      iso,
      dayName: capitalize(weekdayName(date)),
      dayNumber: date.getDate(),
      holiday: holiday?.name ?? null,
      isToday: iso === todayIso,
    });
  }

  return {
    week,
    year,
    monday,
    sunday,
    days,
    holidays: weekHolidays.map((h) => ({ name: h.name, date: h.date })),
    parity: week % 2 === 0 ? "par" : "impar",
    totalWeeksInYear: totalWeeks,
  };
}

function formatDateRange(monday: Date, sunday: Date): string {
  const mDay = monday.getDate();
  const mMonth = MONTHS_ES[monday.getMonth()];
  const sDay = sunday.getDate();
  const sMonth = MONTHS_ES[sunday.getMonth()];
  const sYear = sunday.getFullYear();

  if (monday.getMonth() === sunday.getMonth()) {
    return `${mDay} al ${sDay} de ${mMonth} de ${sYear}`;
  }
  if (monday.getFullYear() === sunday.getFullYear()) {
    return `${mDay} de ${mMonth} al ${sDay} de ${sMonth} de ${sYear}`;
  }
  return `${mDay} de ${mMonth} de ${monday.getFullYear()} al ${sDay} de ${sMonth} de ${sYear}`;
}

function getWeekStatus(monday: Date, sunday: Date): "past" | "current" | "future" {
  const today = new Date();
  const todayIso = dateToIso(today);
  const mondayIso = dateToIso(monday);
  const sundayIso = dateToIso(sunday);

  if (todayIso >= mondayIso && todayIso <= sundayIso) return "current";
  if (todayIso > sundayIso) return "past";
  return "future";
}

function getStatusText(status: "past" | "current" | "future"): string {
  switch (status) {
    case "current":
      return "Semana actual";
    case "past":
      return "Semana pasada";
    case "future":
      return "Semana futura";
  }
}

// --- Metadata ---
export async function generateMetadata({
  params,
}: WeekYearPageProps): Promise<Metadata> {
  const { n, year: yearStr } = await params;
  const week = Number(n);
  const year = Number(yearStr);

  if (
    !Number.isInteger(week) ||
    !Number.isInteger(year) ||
    year < MIN_YEAR ||
    year > MAX_YEAR
  ) {
    return {
      title: "Semana no encontrada | NumeroSemanas",
      description: "La semana solicitada no existe.",
    };
  }

  const data = getWeekData(week, year);
  if (!data) {
    return {
      title: "Semana no encontrada | NumeroSemanas",
      description: "La semana solicitada no existe.",
    };
  }

  const dateRange = formatDateRange(data.monday, data.sunday);
  const canonical = `/semana/${week}/${year}`;

  return {
    title: `Semana ${week} de ${year}: ${dateRange} | NumeroSemanas`,
    description: `La semana ${week} de ${year} abarca del ${dateRange}. Consulta el calendario completo, festivos y si es semana ${data.parity}.`,
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url: `${SITE_URL}${canonical}`,
      title: `Semana ${week} de ${year}`,
      description: `Del ${dateRange}. Semana ${data.parity} según ISO 8601.`,
      siteName: "NumeroSemanas",
    },
  };
}

// --- Page Component ---
export default async function WeekYearPage({ params }: WeekYearPageProps) {
  const { n, year: yearStr } = await params;
  const week = Number(n);
  const year = Number(yearStr);

  if (
    !Number.isInteger(week) ||
    !Number.isInteger(year) ||
    year < MIN_YEAR ||
    year > MAX_YEAR
  ) {
    notFound();
  }

  const data = getWeekData(week, year);
  if (!data) notFound();

  const status = getWeekStatus(data.monday, data.sunday);
  const dateRange = formatDateRange(data.monday, data.sunday);

  // Navigation: previous and next week
  const prevWeek = week > 1 ? week - 1 : weeksInYear(year - 1);
  const prevYear = week > 1 ? year : year - 1;
  const nextWeek = week < data.totalWeeksInYear ? week + 1 : 1;
  const nextYear = week < data.totalWeeksInYear ? year : year + 1;

  // FAQs specific to this week
  const faqs = [
    {
      question: `¿Qué fechas tiene la semana ${week} de ${year}?`,
      answer: `La semana ${week} de ${year} va del <strong>${formatLong(data.monday)}</strong> (lunes) al <strong>${formatLong(data.sunday)}</strong> (domingo).`,
    },
    {
      question: `¿La semana ${week} es par o impar?`,
      answer: `La semana ${week} es <strong>${data.parity}</strong>. Esto es útil para turnos de trabajo, custodia compartida y recogida de basuras.`,
    },
    {
      question: `¿Hay festivos en la semana ${week} de ${year}?`,
      answer:
        data.holidays.length > 0
          ? `Sí, hay ${data.holidays.length} festivo${data.holidays.length > 1 ? "s" : ""} nacional${data.holidays.length > 1 ? "es" : ""}: ${data.holidays.map((h) => h.name).join(", ")}.`
          : `No hay festivos nacionales en la semana ${week} de ${year}. Consulta los festivos autonómicos y locales de tu zona.`,
    },
    {
      question: `¿Cuántas semanas tiene el año ${year}?`,
      answer: `El año ${year} tiene <strong>${data.totalWeeksInYear} semanas</strong> según la norma ISO 8601.`,
    },
  ];

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Semana ${week} de ${year}`,
    description: `La semana ${week} de ${year} abarca del ${dateRange}.`,
    url: `${SITE_URL}/semana/${week}/${year}`,
    isPartOf: {
      "@type": "WebSite",
      name: "NumeroSemanas",
      url: SITE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: `Semanas ${year}`,
          item: `${SITE_URL}/semanas/${year}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Semana ${week}`,
          item: `${SITE_URL}/semana/${week}/${year}`,
        },
      ],
    },
  };

  const relatedLinks = [
    { label: `Calendario ${year}`, href: `/calendario/${year}` },
    { label: `Todas las semanas de ${year}`, href: `/semanas/${year}` },
    { label: "Calculadora de semanas", href: "/calculadora-semanas" },
    { label: `Festivos ${year}`, href: `/festivos-${year}` },
  ];

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: `Semanas ${year}`, href: `/semanas/${year}` },
            { label: `Semana ${week}` },
          ]}
        />

        {/* Hero Section */}
        <header className="mb-8 mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "current"
                  ? "animate-pulse bg-emerald-500"
                  : status === "past"
                    ? "bg-stone-400"
                    : "bg-amber-400"
              }`}
            />
            {getStatusText(status)}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
            Semana {week} de {year}
          </h1>
          <p className="mt-3 text-lg text-muted">
            Del <strong>{dateRange}</strong>
          </p>
          <p className="mt-1 text-sm text-muted">
            Semana <strong>{data.parity}</strong> · Año ISO {year} ·{" "}
            {data.totalWeeksInYear} semanas en el año
          </p>
        </header>

        {/* 7-Day Calendar */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Calendario de la semana
          </h2>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {data.days.map((day) => (
              <div
                key={day.iso}
                className={`relative rounded-xl border p-3 text-center transition sm:p-4 ${
                  day.isToday
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                    : day.holiday
                      ? "border-amber-300 bg-amber-50"
                      : "border-border bg-card"
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted sm:text-sm">
                  {day.dayName.slice(0, 3)}
                </p>
                <p className="mt-1 text-2xl font-bold text-forest-dark sm:text-3xl">
                  {day.dayNumber}
                </p>
                <p className="text-xs text-muted">
                  {MONTHS_ES[day.date.getMonth()].slice(0, 3)}
                </p>
                {day.holiday && (
                  <span
                    className="absolute -top-1 right-1 text-xs"
                    title={day.holiday}
                  >
                    🎉
                  </span>
                )}
                {day.isToday && (
                  <span className="mt-1 block text-xs font-semibold text-emerald-600">
                    Hoy
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Holidays */}
        {data.holidays.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-forest-dark">
              Festivos nacionales esta semana
            </h2>
            <ul className="space-y-2">
              {data.holidays.map((holiday) => (
                <li
                  key={holiday.date}
                  className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
                >
                  <span className="text-xl">🎉</span>
                  <div>
                    <p className="font-medium text-forest-dark">{holiday.name}</p>
                    <p className="text-sm text-muted">
                      {formatLong(new Date(holiday.date + "T00:00:00"))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Week Navigation */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Navegar semanas
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/semana/${prevWeek}/${prevYear}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-forest-dark transition hover:bg-cream"
            >
              ← Semana {prevWeek} de {prevYear}
            </Link>
            <Link
              href={`/semana/${nextWeek}/${nextYear}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-forest-dark transition hover:bg-cream"
            >
              Semana {nextWeek} de {nextYear} →
            </Link>
          </div>
        </section>

        {/* About This Week */}
        <section className="mb-10 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-forest-dark">
            Sobre la semana {week} de {year}
          </h2>
          <div className="prose prose-stone max-w-none text-muted">
            <p>
              Según la norma internacional <strong>ISO 8601</strong>, la semana{" "}
              {week} de {year} comienza el lunes {formatLong(data.monday)} y
              termina el domingo {formatLong(data.sunday)}.
            </p>
            <p>
              Es una semana <strong>{data.parity}</strong>, lo que resulta útil
              para planificar turnos de trabajo, custodias compartidas, recogida
              de basuras alternada y otras actividades que se organizan por
              paridad.
            </p>
            {week === 1 && (
              <p>
                La semana 1 es siempre la que contiene el primer jueves de
                enero, o equivalentemente, la que incluye el 4 de enero.
              </p>
            )}
            {week === data.totalWeeksInYear && (
              <p>
                Esta es la última semana del año ISO {year}. El año tiene{" "}
                {data.totalWeeksInYear} semanas en total.
              </p>
            )}
          </div>
        </section>

        {/* Related Links */}
        <RelatedLinks links={relatedLinks} />

        {/* FAQs */}
        <div className="mt-10">
          <FaqBlock faqs={faqs} />
        </div>
      </main>

      <JsonLd data={structuredData} />
      <JsonLd data={faqPageJsonLd(faqs)} />
    </>
  );
}
