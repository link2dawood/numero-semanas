"use client";

import { useCallback, useState } from "react";
import {
  addDays,
  calendarDayDifference,
  capitalize,
  dateToIso,
  formatLong,
  weekdayName,
} from "@/lib/weeks";
import { nationalHolidaysForYear } from "@/lib/holidays";

type VacationResult = {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  workingDays: number;
  weekendDays: number;
  holidayDays: number;
  holidays: { date: string; name: string }[];
  longWeekends: { description: string; dates: string }[];
  efficiency: number; // working days saved per vacation day
};

function getHolidaysInRange(start: Date, end: Date): { date: string; name: string }[] {
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  const holidays: { date: string; name: string }[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearHolidays = nationalHolidaysForYear(year)
      .filter((h) => h.type === "day_off" && h.scope === "national");

    for (const h of yearHolidays) {
      if (h.date >= dateToIso(start) && h.date <= dateToIso(end)) {
        holidays.push({ date: h.date, name: h.name });
      }
    }
  }

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

function countWorkingDays(start: Date, end: Date, holidays: string[]): number {
  const holidaySet = new Set(holidays);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    const iso = dateToIso(current);
    if (day !== 0 && day !== 6 && !holidaySet.has(iso)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

function findLongWeekends(start: Date, end: Date, holidays: { date: string; name: string }[]): { description: string; dates: string }[] {
  const results: { description: string; dates: string }[] = [];

  for (const h of holidays) {
    const hDate = new Date(h.date + "T00:00:00");
    const dayOfWeek = hDate.getDay();

    // Thursday holiday → potential 4-day weekend (Thu-Sun)
    if (dayOfWeek === 4) {
      const friday = addDays(hDate, 1);
      results.push({
        description: `${h.name} cae en jueves: puente de 4 días`,
        dates: `${formatLong(hDate)} - ${formatLong(addDays(hDate, 3))}`,
      });
    }
    // Tuesday holiday → potential 4-day weekend (Sat-Tue)
    else if (dayOfWeek === 2) {
      const monday = addDays(hDate, -1);
      results.push({
        description: `${h.name} cae en martes: puente de 4 días`,
        dates: `${formatLong(addDays(hDate, -3))} - ${formatLong(hDate)}`,
      });
    }
    // Friday holiday → 3-day weekend
    else if (dayOfWeek === 5) {
      results.push({
        description: `${h.name} cae en viernes: fin de semana largo`,
        dates: `${formatLong(hDate)} - ${formatLong(addDays(hDate, 2))}`,
      });
    }
    // Monday holiday → 3-day weekend
    else if (dayOfWeek === 1) {
      results.push({
        description: `${h.name} cae en lunes: fin de semana largo`,
        dates: `${formatLong(addDays(hDate, -2))} - ${formatLong(hDate)}`,
      });
    }
  }

  return results;
}

export default function VacationPlanner() {
  const today = new Date();
  const defaultStart = dateToIso(today);
  const defaultEnd = dateToIso(addDays(today, 14));

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [result, setResult] = useState<VacationResult | null>(null);

  const calculate = useCallback(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return;

    const totalDays = calendarDayDifference(start, end) + 1;
    const holidays = getHolidaysInRange(start, end);
    const holidayDates = holidays.map((h) => h.date);

    // Count weekend days
    let weekendDays = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day === 0 || day === 6) weekendDays++;
      current.setDate(current.getDate() + 1);
    }

    const workingDays = countWorkingDays(start, end, holidayDates);
    const holidayDays = holidays.filter((h) => {
      const d = new Date(h.date + "T00:00:00");
      return d.getDay() !== 0 && d.getDay() !== 6;
    }).length;

    const longWeekends = findLongWeekends(start, end, holidays);

    // Efficiency: days off (total) per vacation day used (working days)
    const efficiency = workingDays > 0 ? totalDays / workingDays : 0;

    setResult({
      startDate: start,
      endDate: end,
      totalDays,
      workingDays,
      weekendDays,
      holidayDays,
      holidays,
      longWeekends,
      efficiency,
    });
  }, [startDate, endDate]);

  const reset = () => {
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="vac-start" className="mb-2 block text-sm font-medium text-forest-dark">
              Primer día de vacaciones
            </label>
            <input
              type="date"
              id="vac-start"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
          <div>
            <label htmlFor="vac-end" className="mb-2 block text-sm font-medium text-forest-dark">
              Último día de vacaciones
            </label>
            <input
              type="date"
              id="vac-end"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E2B20] px-6 py-3 font-semibold text-white transition hover:bg-[#2A3C2D]"
          >
            Calcular vacaciones
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

      {/* Quick presets */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-forest-dark">
          Períodos sugeridos
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "1 semana", days: 7 },
            { label: "2 semanas", days: 14 },
            { label: "3 semanas", days: 21 },
            { label: "1 mes", days: 30 },
          ].map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() => {
                const end = addDays(new Date(startDate + "T00:00:00"), preset.days - 1);
                setEndDate(dateToIso(end));
              }}
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-forest-dark transition hover:bg-cream"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-olive/30 bg-cream/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-forest-dark">
              Resumen de vacaciones
            </h2>

            <div className="mb-6 text-muted">
              <p>
                Del <strong>{capitalize(weekdayName(result.startDate))}</strong>,{" "}
                {formatLong(result.startDate)} al{" "}
                <strong>{capitalize(weekdayName(result.endDate))}</strong>,{" "}
                {formatLong(result.endDate)}
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
                <p className="text-3xl font-bold text-olive-dark">
                  {result.workingDays}
                </p>
                <p className="text-sm text-muted">Días laborables</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4 text-center">
                <p className="text-3xl font-bold text-forest-dark">
                  {result.weekendDays}
                </p>
                <p className="text-sm text-muted">Fines de semana</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">
                  {result.holidayDays}
                </p>
                <p className="text-sm text-muted">Festivos</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-olive/10 p-4">
              <p className="text-sm text-olive-dark">
                <strong>Eficiencia:</strong> Por cada día de vacaciones que uses,
                disfrutas <strong>{result.efficiency.toFixed(1)}</strong> días libres
                en total (incluyendo fines de semana y festivos).
              </p>
            </div>
          </div>

          {/* Holidays in range */}
          {result.holidays.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-forest-dark">
                Festivos en este período ({result.holidays.length})
              </h3>
              <ul className="space-y-2">
                {result.holidays.map((h) => {
                  const date = new Date(h.date + "T00:00:00");
                  return (
                    <li key={h.date} className="flex items-center gap-3">
                      <span className="text-xl">🎉</span>
                      <div>
                        <p className="font-medium text-forest-dark">{h.name}</p>
                        <p className="text-sm text-muted">
                          {capitalize(weekdayName(date))}, {formatLong(date)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Long weekends */}
          {result.longWeekends.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-forest-dark">
                Puentes y fines de semana largos
              </h3>
              <ul className="space-y-3">
                {result.longWeekends.map((lw, i) => (
                  <li key={i} className="rounded-xl border border-olive/20 bg-olive/5 p-4">
                    <p className="font-medium text-forest-dark">{lw.description}</p>
                    <p className="text-sm text-muted">{lw.dates}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
