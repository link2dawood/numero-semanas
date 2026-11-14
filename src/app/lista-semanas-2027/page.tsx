import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import PrintButton from "@/components/PrintButton";
import RelatedLinks from "@/components/RelatedLinks";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { getWeekRows } from "@/lib/week-calendar";
import { formatLong } from "@/lib/weeks";

// Re-render hourly so the "Sem. N" badge in the shared header stays current.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Lista de semanas 2027 para imprimir | NumeroSemanas",
  description:
    "Consulta e imprime las 52 semanas ISO de 2027 con su fecha de inicio (lunes) y de fin (domingo). Lista preparada para A4 y descargable en PDF.",
  alternates: { canonical: "/lista-semanas-2027" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/lista-semanas-2027",
    siteName: "NumeroSemanas",
    images: [DEFAULT_OG_IMAGE],
    title: "Lista de semanas 2027 para imprimir",
    description: "Las 52 semanas ISO de 2027 en una lista imprimible.",
  },
};

export default function PrintableWeeks2027Page() {
  const rows = getWeekRows(2027);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Calendario 2027", href: "/calendario-2027" },
          { label: "Lista de semanas 2027" },
        ]}
      />
      <div className="mx-auto max-w-[1200px] px-4 pt-5 sm:px-5">
        <PageHero
          eyebrow="Lista imprimible"
          title="Lista de semanas 2027"
          intro="Las 52 semanas ISO de 2027, con sus fechas de inicio y fin. Imprime esta página en A4 o descarga una copia en PDF."
          widget={
            <div className="flex flex-wrap gap-3">
              <PrintButton label="Imprimir" />
              <Link
                href="/api/pdf/semanas-2027"
                className="flex min-h-11 items-center rounded-full border border-border bg-card px-5 font-semibold text-ink no-underline hover:bg-panel print:hidden"
              >
                Descargar PDF
              </Link>
            </div>
          }
        />
      </div>
      <div className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-5">
        <AdSlot id="ad-printable-weeks" size="leaderboard" />
      </div>
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-5">
        <section aria-labelledby="week-list-title">
          <h2
            id="week-list-title"
            className="m-0 font-heading text-2xl font-bold"
          >
            Semanas ISO de 2027
          </h2>
          <p className="mb-5 mt-2 text-muted">
            Cada semana empieza en lunes. La fecha final corresponde al domingo.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead className="bg-panel">
                <tr>
                  <th scope="col" className="px-4 py-3">Semana</th>
                  <th scope="col" className="px-4 py-3">Empieza (lunes)</th>
                  <th scope="col" className="px-4 py-3">Termina (domingo)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.week}
                    className="border-t border-border odd:bg-card even:bg-page"
                  >
                    <th scope="row" className="px-4 py-2.5 font-semibold">
                      Semana {row.week}
                    </th>
                    <td className="px-4 py-2.5">{formatLong(row.monday)}</td>
                    <td className="px-4 py-2.5">{formatLong(row.sunday)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-2xl bg-panel p-5">
          <h2 className="m-0 font-heading text-xl font-bold">
            Cómo guardar esta lista
          </h2>
          <p className="mb-0 mt-2 leading-relaxed">
            Usa «Imprimir» y elige una impresora o «Guardar como PDF» en el
            diálogo del navegador. También puedes descargar directamente el PDF
            preparado para A4.
          </p>
        </section>
        <AdSlot id="ad-printable-weeks-inline" size="responsive" />
        <RelatedLinks
          links={[
            { label: "Calendario 2027 con semanas ISO", href: "/calendario-2027" },
            { label: "Semanas de 2027 con paridad y festivos", href: "/semanas/2027" },
            { label: "Semanas de 2026", href: "/semanas-2026" },
            { label: "Calendario imprimible y plantillas", href: "/calendario-imprimible" },
          ]}
        />
      </main>
    </>
  );
}
