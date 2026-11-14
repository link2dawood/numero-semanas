import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
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
    <section
      aria-labelledby="ns-up"
      className="flex flex-col gap-1 rounded-3xl border border-border bg-card p-5"
    >
      <h2 id="ns-up" className="mb-2 mt-0 text-base font-semibold">
        Próximos festivos y fechas
      </h2>
      {events.length ? (
        events.map((event) => (
          <div
            key={`${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}-${event.name}`}
            className="flex items-center justify-between gap-3 border-t border-cream py-2.5"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[15px] font-semibold">{event.name}</span>
              <span className="text-[13px] text-muted">
                {displayDate(event.date)}
              </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="rounded-md bg-mint px-2 py-0.5 text-xs font-bold">
                Sem. {event.week}
              </span>
              <span className="text-xs text-muted">
                {untilLabel(event.daysUntil)}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="border-t border-cream py-3 text-sm text-muted">
          No hay más fechas destacadas en este periodo.
        </p>
      )}
      {/* The yearly calendar lists every national holiday; it exists for 2020–2035
          (a ?fecha= outside that range must not produce a broken link). */}
      {hasYearPages(year) && (
        <Link
          href={calendarYearHref(year)}
          className="mt-2 inline-flex min-h-11 items-center self-start pt-2 text-sm font-semibold"
        >
          <span>Festivos de {year} en el calendario</span>
          <ArrowRightIcon className="ml-1 size-4" />
        </Link>
      )}
    </section>
  );
}
