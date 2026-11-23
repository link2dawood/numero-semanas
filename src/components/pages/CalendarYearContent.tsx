import type { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqBlock from "@/components/FaqBlock";
import PageHero from "@/components/PageHero";
import CalendarYear2027Hero from "@/components/CalendarYear2027Hero";
import RelatedLinks from "@/components/RelatedLinks";
import CalendarYearView from "./CalendarYearView";
import { DEFAULT_OG_IMAGE, calendarYearHref, hasYearPages, weeksYearHref } from "@/lib/site";
import { weeksInYear } from "@/lib/weeks";

type CalendarYearContentProps = {
  year: number;
  today: string;
  actions?: ReactNode;
};

export default function CalendarYearContent({
  year,
  today,
  actions,
}: CalendarYearContentProps) {
  const faqs = [
    {
      question: `¿Cuántas semanas ISO tiene ${year}?`,
      answer: `${year} tiene ${weeksInYear(year)} semanas ISO. Las semanas empiezan el lunes y terminan el domingo.`,
    },
    {
      question: "¿Por qué algunos días de enero pertenecen a la semana del año anterior?",
      answer:
        "El año ISO de una semana se determina por el jueves que contiene. Por eso, los primeros días de enero pueden seguir en la última semana ISO del año previo.",
    },
    {
      question: "¿Se muestran los festivos de todas las ciudades?",
      answer:
        "El calendario marca festivos nacionales y permite señalar la fecha autonómica destacada. Los festivos locales dependen del municipio y deben consultarse en la publicación oficial correspondiente.",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: `Calendario ${year}` },
        ]}
      />
      <div className="mx-auto max-w-[1200px] px-4 pt-5 sm:px-5">
        {year === 2027 ? (
          <CalendarYear2027Hero year={year} />
        ) : (
          <PageHero
            eyebrow="Calendario anual"
            title={`Calendario ${year} con semanas ISO`}
            intro={`Consulta los doce meses de ${year}, con números de semana ISO y festivos nacionales de España. Puedes seleccionar una comunidad autónoma para ver su fecha autonómica destacada.`}
            widget={
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-xl bg-panel px-4 py-3 text-sm">
                  <strong className="block text-lg">{weeksInYear(year)}</strong>
                  semanas ISO
                </span>
                {actions}
              </div>
            }
          />
        )}
      </div>
      <div className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-5">
        <AdSlot id={`ad-calendar-${year}`} size="leaderboard" />
      </div>
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-5">
        <section>
          <h2 className="mb-2 mt-0 font-heading text-2xl font-bold">
            Los doce meses de {year}
          </h2>
          <p className="mb-0 leading-relaxed text-muted">
            Las cifras de la primera columna son semanas ISO. El calendario
            empieza cada semana en lunes.
          </p>
        </section>
        <CalendarYearView year={year} today={today} />
        <FaqBlock faqs={faqs} title={`Preguntas frecuentes sobre ${year}`} />
        <RelatedLinks
          links={[
            { label: `Semanas de ${year}: lista de fechas`, href: weeksYearHref(year) },
            ...(year === 2027
              ? [{ label: "Lista imprimible de semanas 2027", href: "/lista-semanas-2027" }]
              : []),
            ...(year === 2026
              ? [
                  { label: "Añadir semanas y festivos de 2026 a tu calendario", href: "/suscripcion-calendario" },
                  { label: "Días de cobro de nómina en 2026", href: "/dias-de-cobro-2026" },
                  { label: "Fechas de pago del SEPE en 2026", href: "/pagos-sepe-2026" },
                  { label: "Fechas de cobro de pensiones en 2026", href: "/pago-pensiones-2026" },
                ]
              : []),
            ...[year - 1, year + 1]
              .filter(hasYearPages)
              .map((other) => ({ label: `Calendario ${other}`, href: calendarYearHref(other) })),
            { label: "Calendario imprimible y plantillas", href: "/calendario-imprimible" },
          ]}
        />
      </main>
    </>
  );
}

export function calendarYearMetadata(year: number) {
  const canonical = calendarYearHref(year);
  return {
    title: `Calendario ${year} con semanas ISO | NumeroSemanas`,
    description: `Calendario de ${year} con los 12 meses, los números de semana ISO y los festivos nacionales de España, con opción de ver festivos autonómicos e imprimirlo.`,
    alternates: { canonical },
    openGraph: {
      type: "website" as const,
      locale: "es_ES",
      url: canonical,
      siteName: "NumeroSemanas",
      images: [DEFAULT_OG_IMAGE],
      title: `Calendario ${year} con semanas ISO`,
      description: `Consulta los meses y números de semana ISO de ${year}.`,
    },
  };
}
