"use client";

import { useEffect, useState } from "react";
import { formatLong, isoWeek, capitalize, weekdayName } from "@/lib/weeks";

type SummerType = "astronomical" | "meteorological";

type CountdownData = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetDate: Date;
  year: number;
};

// Astronomical summer: June solstice (around June 20-21)
// Approximate dates - actual time varies by year
function getAstronomicalSummerDate(year: number): Date {
  // Summer solstice in Northern Hemisphere is typically June 20 or 21
  // For simplicity, use June 21 at 00:00 local time
  return new Date(year, 5, 21, 0, 0, 0);
}

// Meteorological summer: June 1
function getMeteorologicalSummerDate(year: number): Date {
  return new Date(year, 5, 1, 0, 0, 0);
}

function getNextSummer(type: SummerType): Date {
  const now = new Date();
  const year = now.getFullYear();

  const getSummerDate = type === "astronomical"
    ? getAstronomicalSummerDate
    : getMeteorologicalSummerDate;

  let target = getSummerDate(year);

  // If this year's summer has passed, get next year's
  if (now >= target) {
    target = getSummerDate(year + 1);
  }

  return target;
}

function calculateCountdown(target: Date): CountdownData {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDate: target,
      year: target.getFullYear(),
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    targetDate: target,
    year: target.getFullYear(),
  };
}

export default function SummerCountdown() {
  const [summerType, setSummerType] = useState<SummerType>("astronomical");
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = getNextSummer(summerType);
    setCountdown(calculateCountdown(target));

    const interval = setInterval(() => {
      const newTarget = getNextSummer(summerType);
      setCountdown(calculateCountdown(newTarget));
    }, 1000);

    return () => clearInterval(interval);
  }, [summerType]);

  if (!mounted || !countdown) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-olive border-t-transparent"></div>
      </div>
    );
  }

  const { week, year: isoYear } = isoWeek(countdown.targetDate);
  const summerLabel = summerType === "astronomical"
    ? "Verano astronómico"
    : "Verano meteorológico";

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-forest-dark">
          Tipo de verano
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setSummerType("astronomical")}
            className={`rounded-xl border p-4 text-left transition ${
              summerType === "astronomical"
                ? "border-olive bg-olive/10"
                : "border-border bg-white hover:bg-cream"
            }`}
          >
            <p className="font-semibold text-forest-dark">
              Verano astronómico
            </p>
            <p className="mt-1 text-sm text-muted">
              Comienza con el solsticio de verano (≈21 de junio)
            </p>
          </button>
          <button
            type="button"
            onClick={() => setSummerType("meteorological")}
            className={`rounded-xl border p-4 text-left transition ${
              summerType === "meteorological"
                ? "border-olive bg-olive/10"
                : "border-border bg-white hover:bg-cream"
            }`}
          >
            <p className="font-semibold text-forest-dark">
              Verano meteorológico
            </p>
            <p className="mt-1 text-sm text-muted">
              Comienza el 1 de junio (usado en climatología)
            </p>
          </button>
        </div>
      </div>

      {/* Main Countdown */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center">
        <h2 className="mb-2 text-lg font-medium text-amber-800">
          Cuenta atrás hasta el
        </h2>
        <p className="mb-6 text-4xl font-bold text-forest-dark sm:text-5xl">
          {summerLabel} {countdown.year}
        </p>

        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-4xl font-bold text-forest-dark sm:text-5xl">
              {countdown.days}
            </p>
            <p className="text-sm text-muted">
              {countdown.days === 1 ? "día" : "días"}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-4xl font-bold text-forest-dark sm:text-5xl">
              {String(countdown.hours).padStart(2, "0")}
            </p>
            <p className="text-sm text-muted">
              {countdown.hours === 1 ? "hora" : "horas"}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-4xl font-bold text-forest-dark sm:text-5xl">
              {String(countdown.minutes).padStart(2, "0")}
            </p>
            <p className="text-sm text-muted">
              {countdown.minutes === 1 ? "minuto" : "minutos"}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-4xl font-bold text-olive-dark sm:text-5xl">
              {String(countdown.seconds).padStart(2, "0")}
            </p>
            <p className="text-sm text-muted">
              {countdown.seconds === 1 ? "segundo" : "segundos"}
            </p>
          </div>
        </div>
      </div>

      {/* Target Date Info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-forest-dark">
          Fecha objetivo
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-sm text-muted">Fecha</p>
            <p className="text-lg font-semibold text-forest-dark">
              {formatLong(countdown.targetDate)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-sm text-muted">Día de la semana</p>
            <p className="text-lg font-semibold text-forest-dark">
              {capitalize(weekdayName(countdown.targetDate))}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-sm text-muted">Semana ISO</p>
            <p className="text-lg font-semibold text-forest-dark">
              Semana {week} de {isoYear}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-2xl border border-border bg-cream/50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-forest-dark">
          ¿Cuál es la diferencia?
        </h3>
        <div className="space-y-4 text-muted">
          <div>
            <p className="font-medium text-forest-dark">Verano astronómico</p>
            <p className="text-sm">
              Comienza con el <strong>solsticio de verano</strong>, cuando el
              Sol alcanza su punto más alto en el cielo del hemisferio norte.
              En España ocurre alrededor del <strong>20-21 de junio</strong>.
              Es la definición tradicional basada en la posición de la Tierra
              respecto al Sol.
            </p>
          </div>
          <div>
            <p className="font-medium text-forest-dark">Verano meteorológico</p>
            <p className="text-sm">
              Comienza el <strong>1 de junio</strong> y termina el 31 de agosto.
              Esta definición se usa en climatología y meteorología porque
              facilita la comparación de datos entre años. Corresponde a los
              tres meses más cálidos del año en el hemisferio norte.
            </p>
          </div>
          <p className="text-sm italic">
            En España, ambas definiciones son válidas. El calendario oficial
            usa el verano astronómico, mientras que las estadísticas
            meteorológicas usan el verano meteorológico.
          </p>
        </div>
      </div>
    </div>
  );
}
