"use client";

import { useCallback, useState } from "react";

type WorkSchedule = "standard" | "intensive" | "parttime" | "custom";

type CalculationResult = {
  dailyHours: number;
  dailyMinutes: number;
  weeklyHours: number;
  weeklyMinutes: number;
  monthlyHours: number;
  breakMinutes: number;
  netWorkingMinutes: number;
};

function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatHoursMinutes(totalMinutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

export default function WorkingHoursCalculator() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakMinutes, setBreakMinutes] = useState(60);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState(5);
  const [schedule, setSchedule] = useState<WorkSchedule>("standard");
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Preset schedules
  const applySchedule = (type: WorkSchedule) => {
    setSchedule(type);
    switch (type) {
      case "standard":
        setStartTime("09:00");
        setEndTime("18:00");
        setBreakMinutes(60);
        setWorkDaysPerWeek(5);
        break;
      case "intensive":
        setStartTime("08:00");
        setEndTime("15:00");
        setBreakMinutes(0);
        setWorkDaysPerWeek(5);
        break;
      case "parttime":
        setStartTime("09:00");
        setEndTime("14:00");
        setBreakMinutes(0);
        setWorkDaysPerWeek(5);
        break;
      case "custom":
        // Keep current values
        break;
    }
  };

  const calculate = useCallback(() => {
    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

    if (endMinutes <= startMinutes) return;

    const grossMinutes = endMinutes - startMinutes;
    const netMinutes = grossMinutes - breakMinutes;

    if (netMinutes <= 0) return;

    const { hours: dailyHours, minutes: dailyMinutes } = formatHoursMinutes(netMinutes);
    const weeklyTotalMinutes = netMinutes * workDaysPerWeek;
    const { hours: weeklyHours, minutes: weeklyMinutes } = formatHoursMinutes(weeklyTotalMinutes);

    // Approximate monthly (4.33 weeks per month)
    const monthlyTotalMinutes = Math.round(weeklyTotalMinutes * 4.33);
    const monthlyHours = Math.round(monthlyTotalMinutes / 60);

    setResult({
      dailyHours,
      dailyMinutes,
      weeklyHours,
      weeklyMinutes,
      monthlyHours,
      breakMinutes,
      netWorkingMinutes: netMinutes,
    });
  }, [startTime, endTime, breakMinutes, workDaysPerWeek]);

  const reset = () => {
    applySchedule("standard");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Schedule Presets */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-forest-dark">
          Tipo de jornada
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { type: "standard" as const, label: "Jornada partida", desc: "9:00-18:00, 1h comida" },
            { type: "intensive" as const, label: "Jornada intensiva", desc: "8:00-15:00, sin pausa" },
            { type: "parttime" as const, label: "Media jornada", desc: "9:00-14:00" },
            { type: "custom" as const, label: "Personalizada", desc: "Define tus horarios" },
          ].map((preset) => (
            <button
              key={preset.type}
              type="button"
              onClick={() => applySchedule(preset.type)}
              className={`rounded-xl border p-4 text-left transition ${
                schedule === preset.type
                  ? "border-olive bg-olive/10"
                  : "border-border bg-white hover:bg-cream"
              }`}
            >
              <p className="font-semibold text-forest-dark">{preset.label}</p>
              <p className="mt-1 text-sm text-muted">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="work-start" className="mb-2 block text-sm font-medium text-forest-dark">
              Hora de entrada
            </label>
            <input
              type="time"
              id="work-start"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setSchedule("custom");
              }}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
          <div>
            <label htmlFor="work-end" className="mb-2 block text-sm font-medium text-forest-dark">
              Hora de salida
            </label>
            <input
              type="time"
              id="work-end"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setSchedule("custom");
              }}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
          <div>
            <label htmlFor="break-time" className="mb-2 block text-sm font-medium text-forest-dark">
              Pausa (minutos)
            </label>
            <input
              type="number"
              id="break-time"
              min="0"
              max="180"
              value={breakMinutes}
              onChange={(e) => {
                setBreakMinutes(Number(e.target.value));
                setSchedule("custom");
              }}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
          <div>
            <label htmlFor="work-days" className="mb-2 block text-sm font-medium text-forest-dark">
              Días por semana
            </label>
            <select
              id="work-days"
              value={workDaysPerWeek}
              onChange={(e) => setWorkDaysPerWeek(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "día" : "días"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E2B20] px-6 py-3 font-semibold text-white transition hover:bg-[#2A3C2D]"
          >
            Calcular horas
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
            Resumen de horas de trabajo
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6 text-center">
              <p className="text-4xl font-bold text-forest-dark">
                {result.dailyHours}
                {result.dailyMinutes > 0 && (
                  <span className="text-xl text-muted">:{String(result.dailyMinutes).padStart(2, "0")}</span>
                )}
              </p>
              <p className="mt-1 text-sm text-muted">Horas al día</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6 text-center">
              <p className="text-4xl font-bold text-olive-dark">
                {result.weeklyHours}
                {result.weeklyMinutes > 0 && (
                  <span className="text-xl text-muted">:{String(result.weeklyMinutes).padStart(2, "0")}</span>
                )}
              </p>
              <p className="mt-1 text-sm text-muted">Horas a la semana</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6 text-center">
              <p className="text-4xl font-bold text-forest-dark">
                ~{result.monthlyHours}
              </p>
              <p className="mt-1 text-sm text-muted">Horas al mes</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-stone-100 p-4">
            <h3 className="mb-2 font-medium text-forest-dark">Desglose diario</h3>
            <ul className="space-y-1 text-sm text-muted">
              <li>• Horario: {startTime} - {endTime}</li>
              <li>• Pausa: {result.breakMinutes} minutos</li>
              <li>• Tiempo neto de trabajo: {result.dailyHours}h {result.dailyMinutes}min</li>
            </ul>
          </div>

          <p className="mt-4 text-xs text-muted">
            * El cálculo mensual es aproximado (4,33 semanas por mes). Las horas
            reales pueden variar según festivos y días laborables del mes.
          </p>
        </div>
      )}
    </div>
  );
}
