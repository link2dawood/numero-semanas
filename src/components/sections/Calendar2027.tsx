import Link from "next/link";
import { calendarCards } from "@/lib/content";

export default function Calendar2027() {
  return (
    <section
      aria-labelledby="s-cal"
      className="flex flex-wrap items-center gap-8 rounded-[28px] bg-tan p-6 sm:p-10"
    >
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5">
        <span className="text-[13px] font-bold uppercase tracking-[0.08em]">
          Nuevo · Año 2027
        </span>
        <h2
          id="s-cal"
          className="m-0 font-heading text-4xl font-bold leading-tight"
        >
          Calendario 2027
        </h2>
        <p className="m-0 text-[17px] leading-relaxed">
          Planifica el próximo año: números de semana, festivos, días laborables
          y vacaciones escolares en un solo calendario.
        </p>
        <div className="mt-1.5 flex flex-wrap gap-3">
          <Link
            href="/calendario-2027"
            className="flex min-h-11 items-center rounded-full bg-olive-dark px-5 text-[15px] font-semibold text-white no-underline hover:bg-olive"
          >
            Abrir calendario 2027
          </Link>
          <Link
            href="/api/pdf/semanas-2027"
            className="flex min-h-11 items-center rounded-full bg-card px-5 text-[15px] font-semibold text-ink no-underline hover:bg-panel"
          >
            Descargar PDF 2027
          </Link>
        </div>
      </div>
      <div className="grid min-w-0 flex-[999_1_520px] grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {calendarCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-1 rounded-2xl border border-card bg-card p-[18px] text-ink no-underline hover:border-sage"
          >
            <span className="text-[15px] font-bold">{card.label}</span>
            <span className="text-[13px] text-muted">{card.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
