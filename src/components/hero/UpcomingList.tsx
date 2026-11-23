import Link from "next/link";
import type { EventItem } from "./NextEvent";
import { calendarYearHref, hasYearPages } from "@/lib/site";
import { capitalize } from "@/lib/weeks";

type UpcomingListProps = {
  events: EventItem[];
  year: number;
};

function displayDate(date: Date): string {
  const weekday = new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
  }).format(date);
  return `${capitalize(weekday)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function untilLabel(days: number): string {
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  return `En ${days} días`;
}

export default function UpcomingList({ events, year }: UpcomingListProps) {
  return (
    <div className="border-t border-[#E9E4D8] pt-5">
      <h4 className="mb-3 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-stone-600">
        <span>Próximos festivos y fechas</span>
        <svg className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </h4>
      <ul className="space-y-3 text-sm">
        {events.length ? (
          events.map((event) => (
            <li
              key={`${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}-${event.name}`}
              className="flex items-center justify-between rounded-xl border border-transparent p-2.5 transition hover:border-[#E9E4D8] hover:bg-[#FDFBF7]"
            >
              <div>
                <p className="font-bold text-[#141E16]">{event.name}</p>
                <p className="text-xs text-stone-500">{displayDate(event.date)}</p>
              </div>
              <div className="text-right">
                <span className="inline-block rounded bg-[#EFECE1] px-2.5 py-1 text-xs font-bold text-[#1E2B20]">
                  Sem. {event.week}
                </span>
                <p className="mt-1 text-xs text-stone-500">
                  {untilLabel(event.daysUntil)}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="py-3 text-sm text-stone-500">
            No hay más fechas destacadas en este periodo.
          </li>
        )}
      </ul>
      {hasYearPages(year) && (
        <Link
          href={calendarYearHref(year)}
          className="mt-4 block border-t border-[#E9E4D8]/60 pt-3 text-center text-sm font-semibold text-[#1E2B20] transition hover:text-[#3D5441]"
        >
          Festivos de {year} en el calendario{" "}
          <svg className="ml-1 inline-block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      )}
    </div>
  );
}
