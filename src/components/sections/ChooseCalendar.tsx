import Link from "next/link";

const calendars = [
  {
    category: "Imprimir",
    title: "Calendario 2026 para imprimir",
    description: "Los 12 meses con números de semana y festivos nacionales.",
    href: "/calendario/2026",
  },
  {
    category: "Planificación",
    title: "Lista de semanas 2027",
    description: "Todas las semanas del próximo año con sus fechas, lista para imprimir.",
    href: "/lista-semanas-2027",
  },
  {
    category: "Trabajo",
    title: "Calendario laboral",
    description: "Festivos y días laborables mes a mes.",
    href: "/calendario-laboral",
  },
];

export default function ChooseCalendar() {
  return (
    <section
      aria-labelledby="s-choose"
      className="flex flex-col gap-5 pb-[72px]"
    >
      <h2 id="s-choose" className="m-0 font-heading text-[32px] font-bold">
        Elige el calendario según su uso
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {calendars.map((calendar) => (
          <Link
            key={calendar.href}
            href={calendar.href}
            className="flex flex-col gap-2 rounded-[20px] border border-border bg-card p-6 text-ink no-underline hover:border-sage"
          >
            <span className="text-[13px] font-bold text-olive">
              {calendar.category}
            </span>
            <span className="text-lg font-bold">{calendar.title}</span>
            <span className="text-sm leading-relaxed text-muted">
              {calendar.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
