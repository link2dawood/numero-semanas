"use client";

import { useCallback, useState } from "react";
import {
  calendarDayDifference,
  dateToIso,
  formatLong,
  weekdayName,
  capitalize,
} from "@/lib/weeks";

type ResultData = {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  businessDays: number;
  calendarDays: number;
  startFormatted: string;
  endFormatted: string;
  startWeekday: string;
  endWeekday: string;
};

function countBusinessDays(start: Date, end: Date, includeEnd: boolean): number {
  let count = 0;
  const endDate = includeEnd ? end : new Date(end.getTime() - 86400000);
  const current = new Date(start);

  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function DaysBetweenCalculator() {
  const today = dateToIso(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [includeEnd, setIncludeEnd] = useState(true);
  const [result, setResult] = useState<ResultData | null>(null);

  const calculate = useCallback(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    // Ensure start <= end
    const [earlier, later] = start <= end ? [start, end] : [end, start];

    let totalDays = calendarDayDifference(earlier, later);
    if (includeEnd) totalDays += 1;

    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const businessDays = countBusinessDays(earlier, later, includeEnd);

    setResult({
      totalDays,
      weeks,
      remainingDays,
      businessDays,
      calendarDays: totalDays,
      startFormatted: formatLong(earlier),
      endFormatted: formatLong(later),
      startWeekday: capitalize(weekdayName(earlier)),
      endWeekday: capitalize(weekdayName(later)),
    });
  }, [startDate, endDate, includeEnd]);

  const reset = () => {
    setStartDate(today);
    setEndDate(today);
    setIncludeEnd(true);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start-date"
              className="mb-2 block text-sm font-medium text-forest-dark"
            >
              Fecha de inicio
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="mb-2 block text-sm font-medium text-forest-dark"
            >
              Fecha de fin
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) => setIncludeEnd(e.target.checked)}
              className="h-5 w-5 rounded border-border text-olive focus:ring-olive"
            />
            <span className="text-sm text-muted">
              Incluir el último día en el cálculo
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E2B20] px-6 py-3 font-semibold text-white transition hover:bg-[#2A3C2D]"
          >
            Calcular
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 font-medium text-forest-dark transition hover:bg-cream"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="rounded-2xl border border-olive/30 bg-cream/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-forest-dark">
            Resultado
          </h2>

          <div className="mb-6 text-sm text-muted">
            <p>
              Desde el <strong>{result.startWeekday}</strong>,{" "}
              {result.startFormatted}
            </p>
            <p>
              Hasta el <strong>{result.endWeekday}</strong>,{" "}
              {result.endFormatted}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <p className="text-3xl font-bold text-forest-dark">
                {result.totalDays}
              </p>
              <p className="text-sm text-muted">Días totales</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <p className="text-3xl font-bold text-forest-dark">
                {result.weeks}
                {result.remainingDays > 0 && (
                  <span className="text-lg text-muted">
                    {" "}
                    + {result.remainingDays}d
                  </span>
                )}
              </p>
              <p className="text-sm text-muted">Semanas</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <p className="text-3xl font-bold text-olive-dark">
                {result.businessDays}
              </p>
              <p className="text-sm text-muted">Días laborables</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <p className="text-3xl font-bold text-forest-dark">
                {result.calendarDays}
              </p>
              <p className="text-sm text-muted">Días naturales</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            * Los días laborables no incluyen festivos nacionales ni locales.
            Consulta el calendario de tu zona.
          </p>
        </div>
      )}
    </div>
  );
}
