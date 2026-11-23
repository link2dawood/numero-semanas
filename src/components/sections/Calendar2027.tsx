import Link from "next/link";

// Card data with icons, tags, and detailed descriptions
const planningCards = [
  {
    icon: "list",
    tag: "52 Sem.",
    tagColor: "bg-[#F7F5EE] text-stone-600",
    iconBg: "bg-[#F7F5EE]",
    iconColor: "text-[#1E2B20]",
    title: "Semanas 2027",
    description:
      "Las 52 semanas numeradas bajo estándar ISO con fechas de inicio (lunes) y cierre (domingo) detalladas.",
    footer: "ISO 8601",
    cta: "Explorar semanas",
    href: "/semanas/2027",
  },
  {
    icon: "star",
    tag: "Oficiales",
    tagColor: "bg-amber-100/70 text-amber-800",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    title: "Festivos 2027",
    description:
      "Festivos nacionales inamovibles, transferibles y festividades autonómicas de las 17 comunidades al detalle.",
    footer: "Actualizado 2027",
    cta: "Ver festivos",
    href: "/festivos-2027",
  },
  {
    icon: "briefcase",
    tag: "Laboral",
    tagColor: "bg-[#EEF0E6] text-[#525B40]",
    iconBg: "bg-[#F6F7F2]",
    iconColor: "text-[#525B40]",
    title: "Días laborables 2027",
    description:
      "Cómputo mes a mes de jornadas efectivas de trabajo, cálculo de horas útiles y deducción automática de no laborables.",
    footer: "Jornada 40h/sem",
    cta: "Contabilizar días",
    href: "/dias-laborables-2027",
  },
  {
    icon: "school",
    tag: "Escolar",
    tagColor: "bg-blue-100 text-blue-800",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    title: "Vacaciones escolares",
    description:
      "Fechas clave del curso escolar: periodos vacacionales de Navidad, Semana Santa, fin de curso y vuelta al cole.",
    footer: "Por Comunidades",
    cta: "Ver calendario escolar",
    href: "/vacaciones-escolares",
  },
  {
    icon: "compass",
    tag: "Escapadas",
    tagColor: "bg-teal-100 text-teal-800",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-700",
    title: "Puentes 2027",
    description:
      "Guía táctica para unir fines de semana con festivos contiguos y exprimir al máximo tus días de vacaciones anuales.",
    footer: "Oportunidades x5",
    cta: "Ver puentes",
    href: "/puentes-2027",
  },
  {
    icon: "printer",
    tag: "PDF A4",
    tagColor: "bg-rose-100 text-rose-800",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-700",
    title: "Imprimible A4",
    description:
      "Plantillas vectoriales en alta resolución diseñadas para pared, escritorio o archivador. Opciones a color y B/N.",
    footer: "300 DPI Vector",
    cta: "Descargar PDF",
    href: "/calendario-imprimible",
    isDownload: true,
  },
];

// Icons
function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SchoolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function PrinterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function getIcon(iconName: string, className?: string) {
  switch (iconName) {
    case "list":
      return <ListIcon className={className} />;
    case "star":
      return <StarIcon className={className} />;
    case "briefcase":
      return <BriefcaseIcon className={className} />;
    case "school":
      return <SchoolIcon className={className} />;
    case "compass":
      return <CompassIcon className={className} />;
    case "printer":
      return <PrinterIcon className={className} />;
    default:
      return <ListIcon className={className} />;
  }
}

export default function Calendar2027() {
  return (
    <>
      {/* Banner 2027 Section */}
      <section
        id="banner-2027"
        className="relative overflow-hidden rounded-3xl border border-[#E9E4D8] bg-gradient-to-r from-[#DFD9C7] via-[#E8E3D5] to-[#E3DCCB] p-6 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] sm:p-10"
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Content */}
          <div className="space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E2B20]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#141E16]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
              Nuevo · Año 2027
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-[#141E16] sm:text-4xl lg:text-5xl">
              Calendario 2027
            </h2>
            <p className="max-w-xl text-sm font-normal leading-relaxed text-stone-700 sm:text-base">
              Planifica el próximo año: números de semana, festivos, días
              laborables y vacaciones escolares en un solo calendario
              profesional, organizado y listo para usar.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/calendario-2027"
                className="inline-flex transform items-center gap-2 rounded-xl bg-[#1E2B20] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2A3C2D]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Abrir calendario 2027</span>
              </Link>
              <Link
                href="/api/pdf/semanas-2027"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E9E4D8] bg-white px-5 py-3 text-sm font-semibold text-[#141E16] shadow-sm transition hover:bg-[#FDFBF7]"
              >
                <svg className="h-4 w-4 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 2v6h6" />
                </svg>
                <span>Descargar PDF 2027</span>
              </Link>
            </div>
          </div>

          {/* Right Badge: Resumen Anual Oficial */}
          <div className="rounded-2xl border border-[#E9E4D8] bg-white/95 p-6 shadow-sm backdrop-blur-sm lg:col-span-5">
            <div className="flex items-center justify-between border-b border-[#E9E4D8] pb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-stone-600">
                Resumen Anual Oficial
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                B.O.E. Actualizado
              </span>
            </div>
            <div className="my-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-[#E9E4D8]/80 bg-[#FDFBF7] p-3">
                <div className="font-serif text-2xl font-bold text-[#141E16] sm:text-3xl">365</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Días</div>
              </div>
              <div className="rounded-xl border border-[#E9E4D8]/80 bg-[#FDFBF7] p-3">
                <div className="font-serif text-2xl font-bold text-[#141E16] sm:text-3xl">52</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Semanas</div>
              </div>
              <div className="rounded-xl border border-[#E9E4D8]/80 bg-[#FDFBF7] p-3">
                <div className="font-serif text-2xl font-bold text-[#141E16] sm:text-3xl">14</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Festivos</div>
              </div>
            </div>
            <div className="space-y-2 border-t border-[#E9E4D8]/80 pt-3 text-sm text-stone-600">
              <div className="flex justify-between">
                <span className="text-stone-500">Comienza:</span>
                <span className="font-semibold text-[#141E16]">Viernes 1 de Enero</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Finaliza:</span>
                <span className="font-semibold text-[#141E16]">Viernes 31 de Diciembre</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Tools 2027 Section */}
      <section id="herramientas-2027" className="space-y-6">
        {/* Section Title & Filter */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#E9E4D8] pb-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-[#2A3C2D]">
              Vistas y módulos específicos
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#141E16] sm:text-3xl">
              Explora las herramientas de planificación 2027
            </h2>
          </div>
          <div className="self-start rounded-full border border-[#E9E4D8] bg-[#F7F5EE] px-3 py-2 text-sm font-semibold text-stone-500 sm:self-auto">
            Mostrando: <span className="font-bold text-[#141E16]">6 categorías activas</span>
          </div>
        </div>

        {/* 3x2 Grid Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {planningCards.map((card) => (
            <article
              key={card.href}
              className="group flex flex-col justify-between rounded-3xl border border-[#E9E4D8] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] transition hover:border-[#3D5441]/40 hover:shadow-[0_8px_30px_-4px_rgba(30,43,32,0.07)]"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} text-lg transition group-hover:scale-105`}>
                    {getIcon(card.icon, `h-6 w-6 ${card.iconColor}`)}
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${card.tagColor}`}>
                    {card.tag}
                  </span>
                </div>
                <h3 className="mb-2 font-serif text-lg font-bold text-[#141E16]">
                  {card.title}
                </h3>
                <p className="text-sm font-normal leading-relaxed text-stone-600">
                  {card.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#E9E4D8]/80 pt-4 text-xs">
                <span className="font-medium text-stone-400">{card.footer}</span>
                <Link
                  href={card.href}
                  className="flex items-center gap-1.5 font-bold text-[#1E2B20] group-hover:text-[#3D5441]"
                >
                  {card.cta}
                  {card.isDownload ? (
                    <svg className="h-3 w-3 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  ) : (
                    <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* ISO 8601 Info Bar */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#1E2B20] p-4 text-white sm:flex-row sm:p-5">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2A3C2D] text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold">Calendario oficial ISO 8601</h4>
              <p className="text-xs text-stone-300">
                Semanas numeradas siguiendo el estándar internacional. La semana 1 es la que contiene el primer jueves del año.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/numeros-de-semana"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3D5441] bg-[#2A3C2D] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#3D5441]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sobre ISO 8601
            </Link>
            <Link
              href="/semanas-pares-e-impares"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3D5441] bg-[#2A3C2D] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#3D5441]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Semanas pares e impares
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
