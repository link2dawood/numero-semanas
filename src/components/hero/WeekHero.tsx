"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import { colors, typography } from "@/lib/theme";
import { holidays } from "@/lib/holidays";
import {
  addDays,
  calendarDayDifference,
  capitalize,
  dateToIso,
  formatLong,
  formatShort,
  isEven,
  isSameDay,
  isoWeek,
  mondayOf,
  parseIsoDate,
  weekdayName,
  weeksInYear,
  yearProgressPct,
  dayOfYear,
} from "@/lib/weeks";
import MiniCalendar from "./MiniCalendar";
import NextEvent, { type EventItem } from "./NextEvent";
import UpcomingList from "./UpcomingList";

type WeekHeroProps = { today: string };

const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export default function WeekHero({ today }: WeekHeroProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Date>(() => {
    return parseIsoDate(searchParams.get("fecha")) ?? parseIsoDate(today)!;
  });
  const todayDate = useMemo(() => parseIsoDate(today)!, [today]);

  useEffect(() => {
    const urlDate = parseIsoDate(searchParams.get("fecha"));
    if (urlDate) setSelected(urlDate);
    else if (!searchParams.has("fecha")) setSelected(todayDate);
  }, [searchParams, todayDate]);

  const selectDate = useCallback(
    (date: Date) => {
      setSelected(date);
      const params = new URLSearchParams(searchParams.toString());
      if (isSameDay(date, todayDate)) params.delete("fecha");
      else params.set("fecha", dateToIso(date));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams, todayDate],
  );

  const weekInfo = isoWeek(selected);
  const monday = mondayOf(selected);
  const sunday = addDays(monday, 6);
  const selectedIsToday = isSameDay(selected, todayDate);
  const parity = isEven(weekInfo.week) ? "par" : "impar";
  const dayCount = dayOfYear(selected);
  const progress = yearProgressPct(selected);
  const yearWeeks = weeksInYear(weekInfo.year);
  const remainingDays =
    (new Date(selected.getFullYear(), 1, 29).getMonth() === 1 ? 366 : 365) -
    dayCount;
  const dateInput = dateToIso(selected);

  const events = useMemo<EventItem[]>(() => {
    return holidays
      .map((holiday) => {
        const [year, month, day] = holiday.date.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return { date, name: holiday.name };
      })
      .filter((event) => calendarDayDifference(selected, event.date) >= 0)
      .slice(0, 5)
      .map((event) => ({
        ...event,
        week: isoWeek(event.date).week,
        daysUntil: calendarDayDifference(selected, event.date),
      }));
  }, [selected]);
  const featuredEvent = events[0] ?? null;

  const monthFirst = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const monthLast = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
  const monthWeeks: Date[] = [];
  for (
    let start = mondayOf(monthFirst);
    start <= monthLast;
    start = addDays(start, 7)
  ) {
    monthWeeks.push(start);
  }

  function chooseWeek(start: Date) {
    selectDate(addDays(start, (selected.getDay() + 6) % 7));
  }

  return (
    <section
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
      id="hero-semana"
    >
      {/* Left Column: Main Big Week Display & Tools */}
      <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E9E4D8] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] sm:p-10 lg:col-span-8">
        {/* Subtle Decorative Background Pattern */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F6F7F2] opacity-60 blur-3xl"></div>

        <div>
          {/* Header Tagline */}
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full border border-[#E9E4D8] bg-[#F7F5EE] px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-500">
              {selectedIsToday ? "LA SEMANA ACTUAL ES LA" : "FECHA SELECCIONADA"}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              Año {weekInfo.year}
            </span>
          </div>

          {/* Big Week Typography Banner */}
          <div className="my-3 text-center sm:text-left">
            <h1 className={`flex flex-col gap-2 ${typography.classes.display} ${typography.sizes.heroWord} text-[${colors.forest[900]}] sm:flex-row sm:items-baseline sm:gap-5`}>
              Semana{" "}
              <span className={`${typography.sizes.heroNumber} text-[${colors.forest[700]}]`}>
                {weekInfo.week}
              </span>
            </h1>
            <p className="mt-2 text-lg font-medium text-stone-700 sm:text-xl">
              {capitalize(weekdayName(selected))}, {formatLong(selected)}
            </p>
            <p className="text-sm font-normal text-stone-500">
              Lun {formatShort(monday)} – Dom {formatShort(sunday)}/{sunday.getFullYear()}
            </p>
          </div>

          {/* Badges Metadata */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5DFD3] bg-[#EEF2EC] px-3 py-1.5 text-xs font-semibold text-[#1E2B20]">
              <svg className="h-2.5 w-2.5 text-[#3D5441]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Semana {parity}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E9E4D8] bg-[#F7F5EE] px-3 py-1.5 text-xs font-medium text-stone-700">
              <svg className="h-2.5 w-2.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              ISO 8601 - empieza el lunes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E9E4D8] bg-[#F7F5EE] px-3 py-1.5 text-xs font-medium text-stone-700">
              <svg className="h-2.5 w-2.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {weekInfo.week}ª de {yearWeeks} semanas
            </span>
            {!selectedIsToday && (
              <button
                type="button"
                onClick={() => selectDate(todayDate)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1E2B20] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2A3C2D]"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Volver a hoy
              </button>
            )}
          </div>

          {/* Annual Progress Bar */}
          <div className="mt-8 border-t border-[#E9E4D8]/80 pt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1.5">
                <svg className="h-3 w-3 text-[#3D5441]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Semana {weekInfo.week} / {yearWeeks} — {progress}% del año transcurrido
              </span>
              <span className="font-bold text-[#1E2B20]">{remainingDays} días restantes</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#E9E4D8] bg-[#EFECE1] p-0.5">
              <div
                className="h-full rounded-full bg-[#2A3C2D] transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-stone-400">
              <span>Sem. 1 (Ene)</span>
              <span>Hoy ({monthNames[selected.getMonth()].slice(0, 3).charAt(0).toUpperCase() + monthNames[selected.getMonth()].slice(1, 3)})</span>
              <span>Sem. {yearWeeks} (Dic)</span>
            </div>
          </div>

          {/* Interactive Date Search Component */}
          <div className="mt-8 rounded-2xl border border-[#E9E4D8] bg-[#FDFBF7] p-4 sm:p-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Buscar cualquier fecha para ver su número de semana:
            </label>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row">
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => {
                    const date = parseIsoDate(e.currentTarget.value);
                    if (date) selectDate(date);
                  }}
                  className="w-full rounded-xl border border-[#E9E4D8] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-stone-800 outline-none transition focus:border-[#2A3C2D] focus:ring-2 focus:ring-[#2A3C2D]"
                />
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1E2B20] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2A3C2D]"
              >
                <span>Calcular</span>
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <p className="mt-2.5 flex items-center gap-1.5 text-xs italic text-stone-500">
              <svg className="h-3 w-3 text-[#687252]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              El {formatLong(selected)} está en la semana {weekInfo.week} ({parity}). Comienza el {formatShort(monday)} y culmina el {formatShort(sunday)}.
            </p>
          </div>

          {/* Week Switcher Strip */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Semanas de {monthNames[selected.getMonth()]} de {selected.getFullYear()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => selectDate(addDays(selected, -7))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E9E4D8] bg-white text-xs text-stone-600 transition hover:bg-[#F7F5EE]"
                  title="Semana anterior"
                >
                  <ArrowLeftIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() => selectDate(addDays(selected, 7))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E9E4D8] bg-white text-xs text-stone-600 transition hover:bg-[#F7F5EE]"
                  title="Semana siguiente"
                >
                  <ArrowRightIcon className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Quick Pill Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6">
              {monthWeeks.map((start) => {
                const pressed = isSameDay(start, monday);
                const end = addDays(start, 6);
                const weekNum = isoWeek(start).week;
                return (
                  <button
                    key={dateToIso(start)}
                    type="button"
                    onClick={() => chooseWeek(start)}
                    aria-pressed={pressed}
                    className={`cursor-pointer rounded-xl border p-2 transition ${
                      pressed
                        ? "border-2 border-[#1E2B20] bg-[#1E2B20] font-semibold text-white shadow-sm"
                        : "border-[#E9E4D8] bg-[#FDFBF7]/60 hover:bg-[#F7F5EE]"
                    }`}
                  >
                    <span className={`block font-bold ${pressed ? "text-white" : "text-stone-700"}`}>
                      Sem. {weekNum}
                    </span>
                    <span className={`text-xs ${pressed ? "text-[#EEF0E6]" : "text-stone-500"}`}>
                      {start.getDate()}/{start.getMonth() + 1} - {end.getDate()}/{end.getMonth() + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Upcoming Event, Mini Calendar & Holidays */}
      <div className="space-y-6 lg:col-span-4">
        <NextEvent event={featuredEvent} />
        <AdSlot id="ad-hero" size="rectangle" />
        <div className="rounded-3xl border border-[#E9E4D8] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] sm:p-6">
          <MiniCalendar
            selected={selected}
            today={todayDate}
            onSelect={selectDate}
          />
          <UpcomingList events={events.slice(1, 5)} year={selected.getFullYear()} />
        </div>
      </div>
    </section>
  );
}
