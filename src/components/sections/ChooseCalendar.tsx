import Link from "next/link";
import { colors, shadows } from "@/lib/theme";
import { FlagFinland, FlagNetherlands } from "@/components/Icons";
import type { ReactNode } from "react";

const calendars = [
  {
    category: "Imprimir",
    title: "Calendario 2026 para imprimir",
    description:
      "Los 12 meses con números de semana y festivos nacionales, optimizado para tinta y legibilidad en papel.",
    href: "/calendario/2026",
    features: ["Listo para PDF A4", "12 meses organizados"],
    cta: "Ver plantillas",
    featured: false,
  },
  {
    category: "Planificación",
    title: "Lista de semanas 2027",
    description:
      "Todas las semanas del próximo año con sus fechas exactas, rangos lunares y lista preparada para anotaciones.",
    href: "/lista-semanas-2027",
    features: ["Semanas 1 a 52 completas", "Vista compacta y detallada"],
    cta: "Explorar semanas",
    featured: true,
  },
  {
    category: "Trabajo",
    title: "Calendario laboral",
    description:
      "Festivos y días laborables mes a mes con desglose por comunidades autónomas, puentes y jornadas festivas.",
    href: "/calendario-laboral",
    features: ["Cómputo de días hábiles", "Festivos autonómicos y locales"],
    cta: "Consultar laboral",
    featured: false,
  },
];

const internationalSites: {
  icon: ReactNode;
  langCode: string;
  domain: string;
  title: string;
  description: string;
  language: string;
  href: string;
  variant: "primary" | "secondary";
}[] = [
  {
    icon: <FlagFinland className="size-6 rounded" />,
    langCode: "Suomi · FI",
    domain: "viikkonro.fi",
    title: "Número de semana y calendario finlandés",
    description:
      "Consulta el número de la semana actual, días festivos oficiales y semanas del calendario en Finlandia según el estándar ISO 8601.",
    language: "Finés (Finlandia)",
    href: "https://viikkonro.fi/",
    variant: "secondary",
  },
  {
    icon: <FlagNetherlands className="size-6 rounded" />,
    langCode: "Nederlands · NL",
    domain: "weeknr.date",
    title: "Número de semana y calendario neerlandés",
    description:
      "Consulta el número de la semana actual, días festivos y semanas del calendario en los Países Bajos según el estándar ISO 8601.",
    language: "Neerlandés (Países Bajos)",
    href: "https://weeknr.date/",
    variant: "primary",
  },
];

export default function ChooseCalendar() {
  return (
    <>
      {/* Choose Calendar Section */}
      <section className="space-y-6 pt-6">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <span
            className={`rounded-full border border-[${colors.sand.border}] bg-[${colors.sand[100]}] px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-[${colors.forest[700]}]`}
          >
            SELECCIÓN RÁPIDA
          </span>
          <h3
            className={`font-serif text-3xl font-bold text-[${colors.forest[900]}]`}
          >
            Elige el calendario según su uso
          </h3>
          <p className="text-sm text-stone-600">
            Encuentra el formato perfecto para organizar tu año, planificar
            tareas o gestionar el entorno de trabajo.
          </p>
        </div>

        {/* 3 Strategic Cards */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {calendars.map((calendar) => (
            <div
              key={calendar.href}
              className={`flex flex-col justify-between rounded-3xl p-6 ${shadows.tw.subtle} transition hover:${shadows.tw.card} sm:p-7 ${
                calendar.featured
                  ? `relative -translate-y-2 transform border-2 border-[${colors.forest[800]}] ${shadows.tw.card} md:-translate-y-2`
                  : `border border-[${colors.sand.border}] bg-white`
              }`}
            >
              {/* Featured badge */}
              {calendar.featured && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[${colors.forest[800]}] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm`}
                >
                  MÁS CONSULTADO
                </div>
              )}

              <div>
                {/* Category and icon row */}
                <div
                  className={`mb-4 flex items-center justify-between ${calendar.featured ? "mt-2" : ""}`}
                >
                  <span
                    className={`rounded-full px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      calendar.featured
                        ? `bg-[${colors.olive[100]}] text-[${colors.forest[800]}]`
                        : `bg-[${colors.sand[100]}] text-stone-600`
                    }`}
                  >
                    {calendar.category}
                  </span>
                  <svg
                    className="h-4 w-4 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {calendar.category === "Imprimir" ? (
                      <>
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </>
                    ) : calendar.category === "Planificación" ? (
                      <>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="M9 16l2 2 4-4" />
                      </>
                    ) : (
                      <>
                        <rect
                          x="2"
                          y="7"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </>
                    )}
                  </svg>
                </div>

                {/* Title */}
                <h4
                  className={`mb-2 font-serif text-xl font-bold text-[${colors.forest[900]}]`}
                >
                  {calendar.title}
                </h4>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-stone-600">
                  {calendar.description}
                </p>

                {/* Features list */}
                <ul className="mb-6 space-y-2 text-sm font-medium text-stone-500">
                  {calendar.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className={`h-3 w-3 text-[${colors.forest[600]}]`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link
                href={calendar.href}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-bold transition ${
                  calendar.featured
                    ? `bg-[${colors.forest[800]}] text-white shadow-sm hover:bg-[${colors.forest[700]}]`
                    : `border border-[${colors.sand.border}] text-[${colors.forest[900]}] hover:bg-[${colors.sand[100]}]`
                }`}
              >
                {calendar.cta}
                <svg
                  className="h-2.5 w-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm text-stone-500">
            <svg
              className="h-3 w-3 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Todos los calendarios están actualizados según el boletín oficial
            del estado y preparados para descargar en formato PDF.
          </p>
        </div>
      </section>

      {/* International Network Section */}
      <section id="internacional" className="space-y-6 pt-6">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <span
            className={`rounded-full border border-[${colors.sand.border}] bg-[${colors.sand[100]}] px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-[${colors.forest[700]}]`}
          >
            Red global &amp; Idiomas
          </span>
          <h3
            className={`font-serif text-3xl font-bold text-[${colors.forest[900]}]`}
          >
            NumeroSemanas en otros idiomas
          </h3>
          <p className="text-sm text-stone-600">
            Consulta la semana actual y los calendarios bajo el estándar ISO
            8601 adaptados al huso y festivos de otros países.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {internationalSites.map((site) => (
            <article
              key={site.domain}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[${colors.sand.border}] bg-white p-6 ${shadows.tw.subtle} transition hover:border-[${colors.forest[600]}]/50 hover:${shadows.tw.card} sm:p-8`}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">
                      {site.icon}
                    </span>
                    <span
                      className={`rounded-full border border-[${colors.sand.border}] bg-[${colors.sand[100]}] px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-700`}
                    >
                      {site.langCode}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-stone-400">
                    {site.domain}
                  </span>
                </div>
                <h4
                  className={`mb-2 font-serif text-xl font-bold text-[${colors.forest[900]}] transition group-hover:text-[${colors.forest[700]}]`}
                >
                  {site.title}
                </h4>
                <p className="mb-4 text-sm font-normal leading-relaxed text-stone-600">
                  {site.description}
                </p>
              </div>
              <div
                className={`mt-6 flex items-center justify-between border-t border-[${colors.sand.border}]/80 pt-4`}
              >
                <span className="text-sm font-medium text-stone-400">
                  {site.language}
                </span>
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    site.variant === "primary"
                      ? `inline-flex items-center gap-1.5 rounded-xl bg-[${colors.forest[800]}] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[${colors.forest[700]}]`
                      : `inline-flex items-center gap-1.5 rounded-xl border border-[${colors.sand.border}] bg-[${colors.sand[50]}] px-4 py-2.5 text-sm font-bold text-[${colors.forest[900]}] shadow-sm transition hover:border-[${colors.forest[800]}] hover:bg-[${colors.forest[800]}] hover:text-white group-hover:translate-x-0.5`
                  }
                >
                  <span>Visitar {site.domain}</span>
                  <svg
                    className="h-3.5 w-3.5 -rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
