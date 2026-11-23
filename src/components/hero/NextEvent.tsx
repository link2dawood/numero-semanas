import { capitalize } from "@/lib/weeks";

export type EventItem = {
  date: Date;
  name: string;
  week: number;
  daysUntil: number;
};

type NextEventProps = { event: EventItem | null };

function eventDateLabel(date: Date): string {
  return `${capitalize(
    new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(date),
  )} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export default function NextEvent({ event }: NextEventProps) {
  if (!event) return null;

  const countdown =
    event.daysUntil === 0
      ? "Hoy"
      : String(event.daysUntil);
  const unit =
    event.daysUntil === 0
      ? ""
      : event.daysUntil === 1
        ? "día restante"
        : "días restantes";

  return (
    <section
      aria-labelledby="ns-next"
      className="relative overflow-hidden rounded-3xl bg-[#1E2B20] p-6 text-white shadow-[0_8px_30px_-4px_rgba(30,43,32,0.07)] sm:p-7"
    >
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#EEF0E6]">
        <span>Próximo evento</span>
        <span className="rounded-full border border-[#3D5441]/50 bg-[#2A3C2D]/60 px-2.5 py-0.5">
          Sem. {event.week}
        </span>
      </div>
      <h2
        id="ns-next"
        className="mb-1 font-serif text-2xl font-bold text-white"
      >
        {event.name}
      </h2>
      <p className="mb-4 text-xs font-medium text-stone-300">
        {eventDateLabel(event.date)}
      </p>
      <div className="flex items-baseline gap-2 border-t border-[#2A3C2D]/80 pt-2">
        <span className="font-serif text-4xl font-bold text-amber-300">
          {countdown}
        </span>
        <span className="text-sm font-medium text-stone-300">{unit}</span>
      </div>
    </section>
  );
}
