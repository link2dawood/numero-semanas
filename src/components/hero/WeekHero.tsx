"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
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
    <div className="flex flex-col items-stretch gap-6 lg:flex-row">
      <section
        aria-labelledby="hero-h1"
        className="flex min-w-0 flex-[999_1_560px] flex-col gap-7 rounded-3xl border border-border bg-card p-5 sm:p-8 lg:p-9"
      >
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1
            id="hero-h1"
            className="m-0 flex flex-col items-center gap-1.5 text-[15px] font-semibold uppercase tracking-[0.06em] text-muted"
          >
            <span>
              {selectedIsToday
                ? "La semana actual es la"
                : "La fecha seleccionada corresponde a la"}
            </span>
            <span className="font-heading text-[clamp(88px,14vw,160px)] font-bold leading-[0.95] tracking-[-0.03em] text-olive-dark normal-case">
              <span className="mr-2 align-[0.9em] font-medium text-[0.32em] tracking-normal text-olive">
                Semana
              </span>
              {weekInfo.week}
            </span>
          </h1>
          <p className="mb-0 mt-1.5 text-lg font-medium">
            {capitalize(weekdayName(selected))}, {formatLong(selected)}
          </p>
          <p className="m-0 text-[15px] text-muted">
            Lun {formatShort(monday)} – Dom {formatShort(sunday)}/
            {sunday.getFullYear()}
          </p>
          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-mint px-3 py-1.5 text-[13px] font-semibold text-ink">
              Semana {parity}
            </span>
            <span className="rounded-full bg-cream px-3 py-1.5 text-[13px] font-medium text-muted">
              ISO 8601 · empieza el lunes
            </span>
            {!selectedIsToday && (
              <button
                type="button"
                onClick={() => selectDate(todayDate)}
                className="inline-flex min-h-11 items-center rounded-full bg-olive-dark px-3 text-[13px] font-semibold text-white hover:bg-olive"
              >
                <ArrowLeftIcon className="mr-1 size-4" />
                <span>Volver a hoy</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap justify-between gap-1.5 text-sm">
            <span className="font-semibold">Año {selected.getFullYear()}</span>
            <span className="text-muted">
              Semana {weekInfo.week} / {yearWeeks} · {progress} % del año
              transcurrido
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Año transcurrido"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-3.5 overflow-hidden rounded-full bg-cream"
          >
            <div
              className="h-full rounded-full bg-sage"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Sem. 1</span>
            <span>{remainingDays} días restantes</span>
            <span>Sem. {yearWeeks}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-panel px-5 py-4">
          <label htmlFor="ns-date" className="text-base font-semibold">
            Buscar por fecha:
          </label>
          <input
            id="ns-date"
            type="date"
            value={dateInput}
            onChange={(event) => {
              const date = parseIsoDate(event.currentTarget.value);
              if (date) selectDate(date);
            }}
            className="h-12 min-w-0 flex-[1_1_200px] rounded-[10px] border border-tan bg-card px-3.5 text-base text-ink"
          />
          <p className="m-0 basis-full text-sm text-muted">
            El {formatLong(selected)} está en la semana {weekInfo.week} ({parity}
            ). La semana empieza el lunes {formatShort(monday)} y termina el
            domingo {formatShort(sunday)}.
          </p>
        </div>

        <nav
          aria-label="Navegación por semanas"
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          <button
            type="button"
            onClick={() => selectDate(addDays(selected, -7))}
            className="flex min-h-[72px] min-w-0 flex-col items-start justify-center gap-1 rounded-[14px] border border-border bg-card p-2.5 text-left hover:border-olive-dark sm:p-3"
          >
            <span className="inline-flex items-center text-sm font-semibold sm:text-base">
              <ArrowLeftIcon className="mr-1 size-4" />
              <span>Semana {isoWeek(addDays(monday, -7)).week}</span>
            </span>
            <span className="text-xs text-muted sm:text-[13px]">
              {formatShort(addDays(monday, -7))} –{" "}
              {formatShort(addDays(monday, -1))}
            </span>
          </button>
          <div
            aria-current="true"
            className="flex min-h-[72px] min-w-0 flex-col items-center justify-center gap-1 rounded-[14px] bg-olive-dark p-2.5 text-center text-white sm:p-3"
          >
            <span className="text-sm font-bold sm:text-base">
              Semana {weekInfo.week}
            </span>
            <span className="text-xs text-mint sm:text-[13px]">
              {formatShort(monday)} – {formatShort(sunday)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => selectDate(addDays(selected, 7))}
            className="flex min-h-[72px] min-w-0 flex-col items-end justify-center gap-1 rounded-[14px] border border-border bg-card p-2.5 text-right hover:border-olive-dark sm:p-3"
          >
            <span className="inline-flex items-center text-sm font-semibold sm:text-base">
              <span>Semana {isoWeek(addDays(monday, 7)).week}</span>
              <ArrowRightIcon className="ml-1 size-4" />
            </span>
            <span className="text-xs text-muted sm:text-[13px]">
              {formatShort(addDays(monday, 7))} –{" "}
              {formatShort(addDays(monday, 13))}
            </span>
          </button>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base font-semibold">
            Semanas de {monthNames[selected.getMonth()]} de{" "}
            {selected.getFullYear()}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-2">
            {monthWeeks.map((start) => {
              const pressed = isSameDay(start, monday);
              const end = addDays(start, 6);
              return (
                <button
                  key={dateToIso(start)}
                  type="button"
                  onClick={() => chooseWeek(start)}
                  aria-pressed={pressed}
                  className={`flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-xl border px-3 py-2.5 text-left ${
                    pressed
                      ? "border-olive-dark bg-olive-dark text-white"
                      : "border-border bg-card text-ink hover:border-olive-dark"
                  }`}
                >
                  <span className="text-[15px] font-bold">
                    Sem. {isoWeek(start).week}
                  </span>
                  <span className={`text-xs ${pressed ? "text-mint" : "text-muted"}`}>
                    {formatShort(start)} – {formatShort(end)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-6">
        <NextEvent event={featuredEvent} />
        <AdSlot id="ad-hero" size="rectangle" />
        <MiniCalendar
          selected={selected}
          today={todayDate}
          onSelect={selectDate}
        />
        <UpcomingList events={events.slice(1, 5)} year={selected.getFullYear()} />
      </aside>
    </div>
  );
}
