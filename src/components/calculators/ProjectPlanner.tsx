"use client";

import { useCallback, useState } from "react";
import {
  addDays,
  calendarDayDifference,
  capitalize,
  dateToIso,
  formatLong,
  isoWeek,
  weekdayName,
} from "@/lib/weeks";
import { nationalHolidaysForYear } from "@/lib/holidays";

type Milestone = {
  id: number;
  name: string;
  date: string;
  weekNumber: number;
  isoYear: number;
};

type ProjectResult = {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  workingDays: number;
  totalWeeks: number;
  milestones: Milestone[];
  weeklyBreakdown: { week: number; year: number; workingDays: number }[];
};

function countWorkingDaysInRange(start: Date, end: Date): number {
  const holidays = new Set<string>();
  for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
    nationalHolidaysForYear(y)
      .filter((h) => h.type === "day_off" && h.scope === "national")
      .forEach((h) => holidays.add(h.date));
  }

  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    const iso = dateToIso(current);
    if (day !== 0 && day !== 6 && !holidays.has(iso)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function ProjectPlanner() {
  const today = new Date();
  const defaultStart = dateToIso(today);
  const defaultEnd = dateToIso(addDays(today, 90));

  const [projectName, setProjectName] = useState("Mi proyecto");
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [milestones, setMilestones] = useState<{ name: string; date: string }[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [result, setResult] = useState<ProjectResult | null>(null);

  const addMilestone = () => {
    if (!newMilestoneName || !newMilestoneDate) return;
    setMilestones([...milestones, { name: newMilestoneName, date: newMilestoneDate }]);
    setNewMilestoneName("");
    setNewMilestoneDate("");
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const calculate = useCallback(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return;

    const totalDays = calendarDayDifference(start, end) + 1;
    const workingDays = countWorkingDaysInRange(start, end);
    const totalWeeks = Math.ceil(totalDays / 7);

    // Process milestones
    const processedMilestones: Milestone[] = milestones
      .filter((m) => m.date >= startDate && m.date <= endDate)
      .map((m, i) => {
        const d = new Date(m.date + "T00:00:00");
        const { week, year } = isoWeek(d);
        return { id: i, name: m.name, date: m.date, weekNumber: week, isoYear: year };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    // Weekly breakdown
    const weeklyBreakdown: { week: number; year: number; workingDays: number }[] = [];
    let current = new Date(start);

    while (current <= end) {
      const { week, year } = isoWeek(current);
      const weekStart = new Date(current);

      // Find the end of this week (Sunday) or project end
      let weekEnd = addDays(current, 6 - ((current.getDay() + 6) % 7));
      if (weekEnd > end) weekEnd = end;

      const daysInWeek = countWorkingDaysInRange(weekStart, weekEnd);
      weeklyBreakdown.push({ week, year, workingDays: daysInWeek });

      // Move to next Monday
      current = addDays(weekEnd, 1);
    }

    setResult({
      startDate: start,
      endDate: end,
      totalDays,
      workingDays,
      totalWeeks,
      milestones: processedMilestones,
      weeklyBreakdown,
    });
  }, [startDate, endDate, milestones]);

  const reset = () => {
    setProjectName("Mi proyecto");
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setMilestones([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6">
          <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-forest-dark">
            Nombre del proyecto
          </label>
          <input
            type="text"
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            placeholder="Mi proyecto"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="proj-start" className="mb-2 block text-sm font-medium text-forest-dark">
              Fecha de inicio
            </label>
            <input
              type="date"
              id="proj-start"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
          <div>
            <label htmlFor="proj-end" className="mb-2 block text-sm font-medium text-forest-dark">
              Fecha de fin
            </label>
            <input
              type="date"
              id="proj-end"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-forest-dark focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-forest-dark">
          Hitos del proyecto
        </h3>

        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={newMilestoneName}
            onChange={(e) => setNewMilestoneName(e.target.value)}
            placeholder="Nombre del hito"
            className="flex-1 rounded-xl border border-border bg-white px-4 py-2 text-sm focus:border-olive focus:outline-none"
          />
          <input
            type="date"
            value={newMilestoneDate}
            onChange={(e) => setNewMilestoneDate(e.target.value)}
            min={startDate}
            max={endDate}
            className="rounded-xl border border-border bg-white px-4 py-2 text-sm focus:border-olive focus:outline-none"
          />
          <button
            type="button"
            onClick={addMilestone}
            className="rounded-xl bg-olive px-4 py-2 text-sm font-medium text-white hover:bg-olive-dark"
          >
            Añadir
          </button>
        </div>

        {milestones.length > 0 && (
          <ul className="space-y-2">
            {milestones.map((m, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-cream/50 px-4 py-2">
                <span className="text-sm">
                  <strong>{m.name}</strong> — {formatLong(new Date(m.date + "T00:00:00"))}
                </span>
                <button
                  type="button"
                  onClick={() => removeMilestone(i)}
                  className="text-stone-400 hover:text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={calculate}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E2B20] px-6 py-3 font-semibold text-white transition hover:bg-[#2A3C2D]"
        >
          Calcular proyecto
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 font-medium text-forest-dark transition hover:bg-cream"
        >
          Reiniciar
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-olive/30 bg-cream/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-forest-dark">
              {projectName}
            </h2>

            <div className="mb-6 text-muted">
              <p>
                Del <strong>{capitalize(weekdayName(result.startDate))}</strong>,{" "}
                {formatLong(result.startDate)} al{" "}
                <strong>{capitalize(weekdayName(result.endDate))}</strong>,{" "}
                {formatLong(result.endDate)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
                  {result.totalWeeks}
                </p>
                <p className="text-sm text-muted">Semanas</p>
              </div>
            </div>
          </div>

          {/* Milestones Timeline */}
          {result.milestones.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-forest-dark">
                Cronograma de hitos
              </h3>
              <div className="space-y-4">
                {result.milestones.map((m) => (
                  <div key={m.id} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive text-white">
                      {m.id + 1}
                    </div>
                    <div>
                      <p className="font-medium text-forest-dark">{m.name}</p>
                      <p className="text-sm text-muted">
                        {formatLong(new Date(m.date + "T00:00:00"))} · Semana {m.weekNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly breakdown (compact) */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-forest-dark">
              Desglose semanal (días laborables)
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.weeklyBreakdown.slice(0, 20).map((w, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-center text-sm"
                >
                  <p className="font-medium text-forest-dark">S{w.week}</p>
                  <p className="text-xs text-muted">{w.workingDays}d</p>
                </div>
              ))}
              {result.weeklyBreakdown.length > 20 && (
                <div className="flex items-center px-3 py-2 text-sm text-muted">
                  +{result.weeklyBreakdown.length - 20} semanas más
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
