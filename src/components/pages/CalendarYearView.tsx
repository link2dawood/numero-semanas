"use client";

import { useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import PrintButton from "@/components/PrintButton";
import regionalData from "../../../data/festivos-autonomicos.json";
import { nationalHolidaysForYear } from "@/lib/holidays";
import { addDays, dateToIso, isoWeek, mondayOf } from "@/lib/weeks";

type CalendarYearViewProps = {
  year: number;
  today: string;
};

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const WEEKDAYS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];
function monthRows(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const rows: Date[][] = [];
  for (let weekStart = mondayOf(first); weekStart <= last; weekStart = addDays(weekStart, 7)) {
    rows.push(Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)));
  }
  return rows;
}

export default function CalendarYearView({
  year,
  today,
}: CalendarYearViewProps) {
  const [communitySlug, setCommunitySlug] = useState("");
  const holidayMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const holiday of nationalHolidaysForYear(year)) {
      map.set(holiday.date, holiday.name);
    }

    const community = regionalData.communities.find(
      (item) => item.slug === communitySlug,
    );
    if (community && (year === 2026 || year === 2027)) {
      const dates =
        year === 2026 ? community.dates["2026"] : community.dates["2027"];
      for (const date of dates) {
        map.set(date, `Día de ${community.name}`);
      }
    }
    return map;
  }, [communitySlug, year]);

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <label
            htmlFor="community"
            className="mb-1.5 block text-sm font-semibold"
          >
            Mostrar un día autonómico destacado
          </label>
          <select
            id="community"
            value={communitySlug}
            onChange={(event) => setCommunitySlug(event.currentTarget.value)}
            className="min-h-11 w-full min-w-64 rounded-xl border border-border bg-card px-3 text-ink"
          >
            <option value="">Solo festivos nacionales</option>
            {regionalData.communities.map((community) => (
              <option key={community.slug} value={community.slug}>
                {community.name}
              </option>
            ))}
          </select>
        </div>
        <PrintButton label="Imprimir calendario" />
      </section>

      <div className="calendar-print-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MONTHS.map((monthName, month) => (
          <section
            key={monthName}
            aria-labelledby={`month-${month}`}
            className="calendar-print-month rounded-2xl border border-border bg-card p-4"
          >
            {/* H3: months are sub-sections of "Los doce meses de {year}" (H2). */}
            <h3
              id={`month-${month}`}
              className="mb-3 mt-0 font-heading text-xl font-bold capitalize"
            >
              {monthName} {year}
            </h3>
            <div
              role="row"
              className="mb-1 grid grid-cols-[30px_repeat(7,minmax(0,1fr))] gap-0.5 text-center text-xs font-semibold text-muted"
            >
              <span role="columnheader" aria-label="Semana">Sem</span>
              {WEEKDAYS.map((day) => (
                <span key={day} role="columnheader">{day}</span>
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              {monthRows(year, month).map((row) => (
                <div
                  key={dateToIso(row[0])}
                  role="row"
                  className="grid grid-cols-[30px_repeat(7,minmax(0,1fr))] gap-0.5"
                >
                  <span
                    role="rowheader"
                    className="flex min-h-9 items-center justify-center text-xs font-bold text-olive"
                  >
                    {isoWeek(row[0]).week}
                  </span>
                  {row.map((date) => {
                    const iso = dateToIso(date);
                    const holiday = holidayMap.get(iso);
                    const inMonth = date.getMonth() === month;
                    const current = iso === today;
                    return (
                      <span
                        key={iso}
                        role="cell"
                        aria-label={`${date.getDate()} de ${monthName}${holiday ? `, ${holiday}` : ""}${current ? ", hoy" : ""}`}
                        title={holiday}
                        className={`relative flex min-h-9 items-center justify-center rounded-lg text-xs ${
                          inMonth ? "text-ink" : "text-muted/60"
                        } ${holiday ? "bg-tan/60 font-bold" : ""} ${
                          current ? "ring-2 ring-olive ring-inset" : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="calendar-print-legend rounded-2xl bg-panel p-4 text-sm leading-relaxed text-muted">
        <p className="m-0">
          Los días autonómicos mostrados son fechas propias de cada comunidad.
          La publicación oficial de cada calendario laboral puede trasladar un
          festivo que coincida con domingo. Fuente de referencia:{" "}
          <a
            href="https://www.boe.es/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Boletín Oficial del Estado
          </a>
          .
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-tan" aria-hidden="true" />
            Festivo nacional o fecha autonómica
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm ring-2 ring-olive ring-inset" aria-hidden="true" />
            Hoy
          </span>
        </div>
      </div>
      <AdSlot id={`ad-calendar-inline-${year}`} size="responsive" />
    </>
  );
}
