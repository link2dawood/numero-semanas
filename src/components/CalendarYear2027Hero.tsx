import Link from "next/link";

type CalendarYear2027HeroProps = {
  year?: number;
};

export default function CalendarYear2027Hero({ year = 2027 }: CalendarYear2027HeroProps) {
  const totalDays = 365;
  const totalWeeks = 52;
  const totalQuarters = 4;

  return (
    <section className="rounded-3xl border border-border bg-cream px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        {/* Left side - Title and description */}
        <div className="flex-1">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-olive/10 px-3 py-2 text-sm font-bold uppercase tracking-wide text-olive">
            <span className="inline-block h-2 w-2 rounded-full bg-olive"></span>
            Nuevo · Año {year}
          </div>

          <h1 className="m-0 font-heading text-4xl font-bold leading-tight text-forest sm:text-5xl">
            Calendario {year}
          </h1>

          <p className="mb-0 mt-4 max-w-xl text-base leading-relaxed text-muted">
            Planifica el próximo año: números de semana, festivos, días
            laborables y vacaciones escolares en un solo calendario
            profesional, organizado y listo para usar.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="#calendario"
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest/90"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Abrir calendario {year}
            </Link>
            <Link
              href={`/api/pdf/semanas-${year}`}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-forest bg-transparent px-5 py-3 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
            >
              Descargar PDF {year}
            </Link>
          </div>
        </div>

        {/* Right side - Stats card */}
        <div className="w-full rounded-2xl border border-border bg-white p-5 shadow-sm lg:w-auto lg:min-w-[280px]">
          {/* Header badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-forest px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-white">
              Esquema anual oficial
            </span>
            <span className="rounded-md border border-olive/30 bg-olive/10 px-3 py-1.5 text-sm font-medium text-olive">
              B.O.E. (Simulado)
            </span>
          </div>

          {/* Stats */}
          <div className="mb-4 flex items-baseline gap-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-forest">{totalDays}</span>
              <span className="text-sm uppercase tracking-wide text-muted">Días</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-forest">{totalWeeks}</span>
              <span className="text-sm uppercase tracking-wide text-muted">Semanas</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-forest">{totalQuarters}</span>
              <span className="text-sm uppercase tracking-wide text-muted">Trimestres</span>
            </div>
          </div>

          {/* Footer info */}
          <div className="border-t border-border pt-3 text-sm text-muted">
            <p className="m-0 flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Comienza: <strong className="font-medium text-ink">Viernes 1 de Enero</strong>
            </p>
            <p className="m-0 mt-1 flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Próxima: <strong className="font-medium text-ink">Viernes 31 de Diciembre</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
