"use client";

import { useCallback, useState } from "react";
import {
  addDays,
  capitalize,
  dateToIso,
  formatLong,
  isoWeek,
  weekdayName,
} from "@/lib/weeks";

type ResultData = {
  resultDate: Date;
  formatted: string;
  weekday: string;
  isoWeek: number;
  isoYear: number;
  parity: "par" | "impar";
};

export default function AddDaysCalculator() {
  const today = dateToIso(new Date());
  const [startDate, setStartDate] = useState(today);
  const [daysCount, setDaysCount] = useState(30);
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [result, setResult] = useState<ResultData | null>(null);

  const calculate = useCallback(() => {
    if (!startDate || isNaN(daysCount)) return;

    const start = new Date(startDate + "T00:00:00");
    if (isNaN(start.getTime())) return;

    const offset = operation === "add" ? daysCount : -daysCount;
    const resultDate = addDays(start, offset);
    const { week, year } = isoWeek(resultDate);

    setResult({
      resultDate,
      formatted: formatLong(resultDate),
      weekday: capitalize(weekdayName(resultDate)),
      isoWeek: week,
      isoYear: year,
      parity: week % 2 === 0 ? "par" : "impar",
    });
  }, [startDate, daysCount, operation]);

  const reset = () => {
    setStartDate(today);
    setDaysCount(30);
    setOperation("add");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label
              htmlFor="calc-start-date"
              className="mb-2 block text-sm font-medium text-forest-dark"
            >
              Fecha de inicio
            </label>
            <input
              type="date"
              id="calc-start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>

          <div>
            <label
              htmlFor="days-count"
              className="mb-2 block text-sm font-medium text-forest-dark"
            >
              Número de días
            </label>
            <input
              type="number"
              id="days-count"
              min="0"
              max="36500"
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-forest-dark">
              Operación
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOperation("add")}
                className={`flex-1 rounded-xl border px-4 py-3 font-medium transition ${
                  operation === "add"
                    ? "border-olive bg-olive text-white"
                    : "border-border bg-white text-forest-dark hover:bg-cream"
                }`}
              >
                + Sumar
              </button>
              <button
                type="button"
                onClick={() => setOperation("subtract")}
                className={`flex-1 rounded-xl border px-4 py-3 font-medium transition ${
                  operation === "subtract"
                    ? "border-olive bg-olive text-white"
                    : "border-border bg-white text-forest-dark hover:bg-cream"
                }`}
              >
                − Restar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E2B20] px-6 py-3 font-semibold text-white transition hover:bg-[#2A3C2D]"
          >
            Calcular fecha
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

          <div className="mb-6 rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-lg text-muted">La fecha resultante es:</p>
            <p className="mt-2 text-3xl font-bold text-forest-dark">
              {result.formatted}
            </p>
            <p className="mt-1 text-lg text-olive-dark">{result.weekday}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <p className="text-2xl font-bold text-forest-dark">
                {result.isoWeek}
              </p>
              <p className="text-sm text-muted">Semana ISO</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <p className="text-2xl font-bold text-forest-dark">
                {result.isoYear}
              </p>
              <p className="text-sm text-muted">Año ISO</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <p className="text-2xl font-bold text-olive-dark capitalize">
                {result.parity}
              </p>
              <p className="text-sm text-muted">Paridad</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick presets */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-forest-dark">
          Accesos rápidos
        </h3>
        <div className="flex flex-wrap gap-2">
          {[7, 14, 30, 60, 90, 180, 365].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => {
                setDaysCount(days);
                setOperation("add");
              }}
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-forest-dark transition hover:bg-cream"
            >
              +{days} días
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
