import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { isoWeek, weeksInYear } from "@/lib/weeks";

type WeekPageProps = { params: Promise<{ n: string }> };

const MIN_YEAR = 2020;
const MAX_YEAR = 2035;

export function generateStaticParams() {
  return Array.from({ length: 53 }, (_, i) => ({ n: String(i + 1) }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: WeekPageProps): Promise<Metadata> {
  const { n } = await params;
  const week = Number(n);
  if (!Number.isInteger(week) || week < 1 || week > 53) {
    return {
      title: "Semana no encontrada | NumeroSemanas",
      description: "La semana solicitada no existe.",
    };
  }
  return {
    title: `Semana ${week}: elige un año para ver sus fechas | NumeroSemanas`,
    description: `Consulta la semana ISO ${week} en cualquier año desde ${MIN_YEAR} hasta ${MAX_YEAR}. Selecciona un año para ver las fechas exactas de lunes a domingo.`,
    alternates: { canonical: `/semana/${week}` },
  };
}

export default async function WeekPage({ params }: WeekPageProps) {
  const { n } = await params;
  const week = Number(n);
  if (!Number.isInteger(week) || week < 1 || week > 53) notFound();

  const today = new Date();
  const { year: currentYear } = isoWeek(today);

  // Build year list, noting which years have this week number
  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => {
    const year = MIN_YEAR + i;
    const totalWeeks = weeksInYear(year);
    return {
      year,
      hasWeek: week <= totalWeeks,
      isCurrent: year === currentYear,
    };
  });

  const parity = week % 2 === 0 ? "par" : "impar";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: `Semana ${week}` },
        ]}
      />

      <header className="mb-8 mt-6">
        <span className="inline-block rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive-dark">
          Semana {parity}
        </span>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-forest-dark sm:text-5xl">
          Semana {week}
        </h1>
        <p className="mt-3 text-lg text-muted">
          Selecciona un año para ver las fechas exactas de la semana {week}.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-forest-dark">
          Elige un año
        </h2>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {years.map(({ year, hasWeek, isCurrent }) =>
            hasWeek ? (
              <Link
                key={year}
                href={`/semana/${week}/${year}`}
                className={`rounded-xl border px-3 py-3 text-center font-medium transition hover:border-olive hover:bg-cream ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-border bg-card text-forest-dark"
                }`}
              >
                {year}
                {isCurrent && (
                  <span className="mt-1 block text-xs text-emerald-600">
                    Actual
                  </span>
                )}
              </Link>
            ) : (
              <span
                key={year}
                className="cursor-not-allowed rounded-xl border border-border bg-stone-100 px-3 py-3 text-center text-stone-400"
                title={`El año ${year} no tiene semana ${week}`}
              >
                {year}
              </span>
            )
          )}
        </div>
        {week === 53 && (
          <p className="mt-4 text-sm text-muted">
            * Solo algunos años tienen semana 53. Los años marcados en gris solo
            tienen 52 semanas.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-cream/50 p-6">
        <h2 className="mb-3 text-xl font-semibold text-forest-dark">
          Sobre la semana {week}
        </h2>
        <div className="prose prose-stone max-w-none text-muted">
          <p>
            La semana {week} es una semana <strong>{parity}</strong> según la
            norma ISO 8601. Esto es útil para planificar turnos de trabajo,
            custodias compartidas, recogida de basuras alternada y otras
            actividades que se organizan por paridad.
          </p>
          <p>
            Las fechas exactas de la semana {week} varían según el año. Haz clic
            en cualquier año de la lista para ver el calendario completo con
            los días de la semana y los festivos.
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#1E2B20] px-5 py-3 font-semibold text-white transition hover:bg-[#2A3C2D]"
        >
          Ver semana actual
        </Link>
        <Link
          href={`/semanas/${currentYear}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-medium text-forest-dark transition hover:bg-cream"
        >
          Todas las semanas de {currentYear}
        </Link>
      </div>
    </main>
  );
}
