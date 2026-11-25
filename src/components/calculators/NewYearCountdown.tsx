"use client";

import { useEffect, useState } from "react";
import { isoWeek, capitalize, weekdayName } from "@/lib/weeks";

type CountdownData = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetYear: number;
  targetDate: Date;
};

function getNextNewYear(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const nextYear = new Date(year + 1, 0, 1, 0, 0, 0);
  return nextYear;
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
      targetYear: target.getFullYear(),
      targetDate: target,
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
    targetYear: target.getFullYear(),
    targetDate: target,
  };
}

export default function NewYearCountdown() {
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = getNextNewYear();
    setCountdown(calculateCountdown(target));

    const interval = setInterval(() => {
      const newTarget = getNextNewYear();
      setCountdown(calculateCountdown(newTarget));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || !countdown) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-olive border-t-transparent"></div>
      </div>
    );
  }

  const { week, year } = isoWeek(countdown.targetDate);

  return (
    <div className="space-y-6">
      {/* Main Countdown */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center">
        <h2 className="mb-2 text-lg font-medium text-amber-800">
          Cuenta atrás hasta
        </h2>
        <p className="mb-6 text-4xl font-bold text-forest-dark sm:text-5xl">
          Año Nuevo {countdown.targetYear}
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
              1 de enero de {countdown.targetYear}
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
              Semana {week} de {year}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          * El 1 de enero no siempre cae en la semana 1 según ISO 8601. La
          semana 1 es la que contiene el primer jueves del año.
        </p>
      </div>

      {/* Quick Facts */}
      <div className="rounded-2xl border border-border bg-cream/50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-forest-dark">
          Datos rápidos
        </h3>
        <ul className="space-y-2 text-muted">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-olive">•</span>
            <span>
              Faltan <strong>{countdown.days}</strong> días completos para Año
              Nuevo.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-olive">•</span>
            <span>
              Eso equivale a aproximadamente{" "}
              <strong>{Math.floor(countdown.days / 7)}</strong> semanas y{" "}
              <strong>{countdown.days % 7}</strong> días.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-olive">•</span>
            <span>
              El año {countdown.targetYear} comenzará un{" "}
              <strong>{capitalize(weekdayName(countdown.targetDate))}</strong>.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
