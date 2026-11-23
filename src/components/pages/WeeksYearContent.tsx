import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import CopyButton from "@/components/CopyButton";
import FaqBlock from "@/components/FaqBlock";
import PageHero from "@/components/PageHero";
import RelatedLinks from "@/components/RelatedLinks";
import { DEFAULT_OG_IMAGE, calendarYearHref, weeksYearHref } from "@/lib/site";
import { getWeekRows } from "@/lib/week-calendar";
import { formatLong, isoWeek, weeksInYear } from "@/lib/weeks";

type WeeksYearContentProps = {
  year: number;
  today: Date;
};

export default function WeeksYearContent({
  year,
  today,
}: WeeksYearContentProps) {
  const rows = getWeekRows(year);
  const thisWeek = isoWeek(today);
  const isCurrentYear = thisWeek.year === year;
  const yearDays = new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
  const weekdayCount = rows.reduce((count, row) => {
    let working = 0;
    for (let day = 0; day < 7; day += 1) {
      const current = new Date(
        row.monday.getFullYear(),
        row.monday.getMonth(),
        row.monday.getDate() + day,
      );
      if (current.getFullYear() === year && current.getDay() !== 0 && current.getDay() !== 6) {
        working += 1;
      }
    }
    return count + working;
  }, 0);
  const copyText = rows
    .map(
      (row) =>
        `Semana ${row.week}\t${formatLong(row.monday)}\t${formatLong(row.sunday)}\tSemana ${row.parity}\t${row.holidays.join(", ")}`,
    )
    .join("\n");
  const faq = [
    {
      question: `¿Cuántas semanas ISO tiene ${year}?`,
      answer: `${year} tiene ${weeksInYear(year)} semanas ISO. La primera comienza el lunes ${formatLong(rows[0].monday)} y la última termina el domingo ${formatLong(rows[rows.length - 1].sunday)}.`,
    },
    {
      question: "¿Cuándo empieza la semana?",
      answer:
        "En la numeración ISO 8601, utilizada en España, la semana comienza el lunes y termina el domingo.",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: `Semanas ${year}` },
        ]}
      />
      <div className="mx-auto max-w-[1200px] px-4 pt-5 sm:px-5">
        <PageHero
          eyebrow="Calendario ISO"
          title={`Semanas de ${year}: calendario y fechas`}
          intro={`${year} tiene ${weeksInYear(year)} semanas ISO. Consulta el lunes de inicio, el domingo de cierre, la paridad y los festivos nacionales de cada semana.`}
          widget={
            <div className="flex flex-wrap gap-3">
              <span className="rounded-xl bg-panel px-4 py-3 text-sm">
                <strong className="block text-lg">{weeksInYear(year)}</strong>
                semanas ISO
              </span>
              <span className="rounded-xl bg-panel px-4 py-3 text-sm">
                <strong className="block text-lg">{yearDays}</strong>
                días del año
              </span>
              <span className="rounded-xl bg-panel px-4 py-3 text-sm">
                <strong className="block text-lg">{weekdayCount}</strong>
                días de lunes a viernes
              </span>
            </div>
          }
        />
      </div>
      <div className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-5">
        <AdSlot id={`ad-weeks-${year}`} size="leaderboard" />
      </div>
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-5">
        <section aria-labelledby="year-picker-heading" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="year-picker-heading"
                className="m-0 font-heading text-2xl font-bold"
              >
                Explorar otro año
              </h2>
              <p className="mb-0 mt-1 text-sm text-muted">
                Años disponibles: 2020–2035
              </p>
            </div>
            <CopyButton text={copyText} label="Copiar lista" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 16 }, (_, index) => 2020 + index).map(
              (optionYear) => (
                <Link
                  key={optionYear}
                  href={weeksYearHref(optionYear)}
                  aria-current={optionYear === year ? "page" : undefined}
                  className={`flex min-h-11 min-w-14 items-center justify-center rounded-lg border px-3 text-sm font-semibold no-underline ${
                    optionYear === year
                      ? "border-[#1E2B20] bg-[#1E2B20] text-white"
                      : "border-border bg-card text-ink hover:border-[#1E2B20]"
                  }`}
                >
                  {optionYear}
                </Link>
              ),
            )}
          </div>
        </section>

        <section aria-labelledby="weeks-heading" className="flex flex-col gap-4">
          <div>
            <h2 id="weeks-heading" className="m-0 font-heading text-2xl font-bold">
              Todas las semanas de {year}
            </h2>
            <p className="mb-0 mt-2 leading-relaxed text-muted">
              Las fechas se muestran en horario local y de lunes a domingo. La
              semana ISO pertenece al año del jueves de esa semana.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-panel">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Semana</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Lunes</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Domingo</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Paridad</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Festivos nacionales</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const current = isCurrentYear && row.week === thisWeek.week;
                  return (
                    <tr
                      key={row.week}
                      id={`semana-${row.week}`}
                      className={`scroll-mt-24 border-t border-border ${
                        current ? "bg-mint/60" : ""
                      }`}
                    >
                      <th scope="row" className="px-4 py-3 font-bold">
                        <a
                          href={`#semana-${row.week}`}
                          aria-current={current ? "date" : undefined}
                          className="rounded-md underline-offset-4 hover:underline"
                        >
                          Semana {row.week}
                          {current && (
                            <span className="ml-2 rounded-full bg-[#1E2B20] px-2 py-1 text-xs text-white">
                              Actual
                            </span>
                          )}
                        </a>
                      </th>
                      <td className="px-4 py-3">{formatLong(row.monday)}</td>
                      <td className="px-4 py-3">{formatLong(row.sunday)}</td>
                      <td className="px-4 py-3 capitalize">Semana {row.parity}</td>
                      <td className="px-4 py-3">
                        {row.holidays.length
                          ? row.holidays.join(", ")
                          : <span className="text-muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <AdSlot id={`ad-weeks-inline-${year}`} size="responsive" />
        <FaqBlock faqs={faq} />
        <RelatedLinks
          links={[
            { label: `Calendario ${year} con semanas ISO`, href: calendarYearHref(year) },
            ...(year === 2027
              ? [{ label: "Lista imprimible de semanas 2027", href: "/lista-semanas-2027" }]
              : []),
            { label: "Semanas pares e impares", href: "/semanas-pares-e-impares" },
            {
              label: weeksInYear(year) === 53 ? "Por qué hay años con 53 semanas" : "¿Cuántas semanas tiene un año?",
              href: "/cuantas-semanas-tiene-un-anio",
            },
            { label: "Qué es el número de semana ISO", href: "/numeros-de-semana" },
          ]}
        />
      </main>
    </>
  );
}

export function getMadridToday(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const iso = `${values.year}-${values.month}-${values.day}`;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function weekYearMetadata(year: number) {
  return {
    // "lista de fechas" keeps this distinct from the calendar grid page for the same year.
    title: `Semanas de ${year}: lista de fechas ISO | NumeroSemanas`,
    description: `Lista de las ${weeksInYear(year)} semanas ISO de ${year} con sus fechas de lunes a domingo, la paridad de cada semana y los festivos nacionales de España. Copia la lista completa.`,
    alternates: { canonical: weeksYearHref(year) },
    openGraph: {
      type: "website" as const,
      locale: "es_ES",
      url: weeksYearHref(year),
      siteName: "NumeroSemanas",
      images: [DEFAULT_OG_IMAGE],
      title: `Semanas de ${year} | NumeroSemanas`,
      description: `Fechas de lunes a domingo, paridad y festivos de las ${weeksInYear(year)} semanas ISO de ${year}.`,
    },
  };
}

