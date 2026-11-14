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
    new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(date),
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
      className="flex flex-col gap-2 rounded-3xl bg-olive-dark p-6 text-white"
    >
      <h2
        id="ns-next"
        className="m-0 text-[13px] font-semibold uppercase tracking-wide text-mint"
      >
        Próximo evento
      </h2>
      <p className="m-0 font-heading text-[28px] font-bold leading-tight">
        {event.name}
      </p>
      <p className="m-0 text-[15px] text-cream">
        {eventDateLabel(event.date)} · Sem. {event.week}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-heading text-[44px] font-bold leading-none text-tan">
          {countdown}
        </span>
        <span className="text-[15px] text-cream">{unit}</span>
      </div>
    </section>
  );
}
