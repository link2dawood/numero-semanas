import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type WeekPageProps = { params: Promise<{ n: string }> };

export async function generateMetadata({
  params,
}: WeekPageProps): Promise<Metadata> {
  const { n } = await params;
  const week = Number(n);
  if (!Number.isInteger(week) || week < 1 || week > 53) {
    return {
      title: "Semana no encontrada | NumeroSemanas",
      description: "La semana solicitada no existe.",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `Semana ${week}: consultar fechas | NumeroSemanas`,
    description: `Consulta la semana ISO ${week}, elige un año y comprueba sus fechas de lunes a domingo.`,
    // Intentionally noindex (thin helper page), so no canonical is declared.
    robots: { index: false, follow: true },
  };
}

export default async function WeekPage({ params }: WeekPageProps) {
  const { n } = await params;
  const week = Number(n);
  if (!Number.isInteger(week) || week < 1 || week > 53) notFound();

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-center px-4 py-16 sm:px-5">
      <section className="max-w-2xl rounded-3xl border border-border bg-card p-8 sm:p-12">
        <p className="m-0 text-sm font-semibold uppercase tracking-wide text-olive">
          NumeroSemanas
        </p>
        <h1 className="mb-4 mt-3 font-heading text-4xl font-bold">
          Semana {week}
        </h1>
        <p className="m-0 leading-relaxed text-muted">
          Consulta el calendario para elegir un año y ver las fechas de esta
          semana.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-olive-dark px-5 font-semibold text-white no-underline"
        >
          Ver semana actual
        </Link>
      </section>
    </main>
  );
}
