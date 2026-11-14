export type SiteLink = {
  label: string;
  href: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export const navigationLinks: SiteLink[] = [
  { label: "Semanas 2026", href: "/semanas-2026" },
  { label: "Lista de semanas 2027", href: "/lista-semanas-2027" },
  { label: "Calendario 2027", href: "/calendario-2027" },
  { label: "Calculadoras", href: "/calculadoras" },
  {
    label: "Sobre las semanas",
    href: "/numeros-de-semana",
  },
];

// Footer navigation, grouped by topic. scripts/check-links.ts validates the
// rendered footer against these lists. The home page is reached through the
// footer logo, so it is not repeated as a text link.
export type SiteLinkGroup = { title: string; links: SiteLink[] };

export const footerLinkGroups: SiteLinkGroup[] = [
  {
    title: "Semanas y calendarios",
    links: [
      { label: "Número de semana ISO", href: "/numeros-de-semana" },
      { label: "Semanas en un año", href: "/cuantas-semanas-tiene-un-anio" },
      { label: "Semanas pares e impares", href: "/semanas-pares-e-impares" },
      { label: "Calendario imprimible y plantillas", href: "/calendario-imprimible" },
      { label: "Suscripción al calendario", href: "/suscripcion-calendario" },
      { label: "Gestión del tiempo", href: "/gestion-del-tiempo" },
    ],
  },
  {
    title: "Fechas y efemérides",
    links: [
      { label: "Días de cobro de nómina 2026", href: "/dias-de-cobro-2026" },
      { label: "Fechas de pago del SEPE 2026", href: "/pagos-sepe-2026" },
      { label: "Fechas de cobro de pensiones 2026", href: "/pago-pensiones-2026" },
      { label: "Cambio de hora 2026", href: "/cambio-de-hora-2026" },
      { label: "Fases de la luna 2026", href: "/fases-luna-2026" },
      { label: "Amanecer y atardecer", href: "/amanecer-atardecer" },
    ],
  },
  {
    title: "Herramientas y datos",
    links: [
      { label: "Widget de número de semana", href: "/widget-numero-semana" },
      { label: "Datos abiertos", href: "/datos-abiertos" },
      { label: "Metodología", href: "/metodologia" },
      { label: "Fuentes de datos", href: "/fuentes" },
    ],
  },
];

export const footerServiceLinks: SiteLink[] = footerLinkGroups.flatMap((group) => group.links);

export const footerCompanyLinks: SiteLink[] = [
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Principios editoriales", href: "/principios-editoriales" },
  { label: "Contacto", href: "/contacto" },
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Términos de uso", href: "/terminos-de-uso" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Política de devoluciones y cancelaciones", href: "/devoluciones" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];

export const calendarCards: (SiteLink & { description: string })[] = [
  {
    label: "Semanas 2027",
    description: "Las 52 semanas con fechas",
    href: "/semanas/2027",
  },
  {
    label: "Festivos 2027",
    description: "Nacionales y autonómicos",
    href: "/festivos-2027",
  },
  {
    label: "Días laborables 2027",
    description: "Mes a mes",
    href: "/dias-laborables-2027",
  },
  {
    label: "Vacaciones escolares",
    description: "Navidad, Semana Santa y verano",
    href: "/vacaciones-escolares",
  },
  {
    label: "Puentes 2027",
    description: "Planifica tus escapadas",
    href: "/puentes-2027",
  },
  {
    label: "Imprimible A4",
    description: "PDF listo para imprimir",
    href: "/calendario-imprimible",
  },
];

export const toolGroups = [
  {
    title: "Calendarios y semanas",
    dot: "bg-olive-dark",
    links: [
      { label: "Calendario 2027", href: "/calendario-2027" },
      { label: "Semanas 2027", href: "/semanas/2027" },
      { label: "Calendario imprimible", href: "/calendario-imprimible" },
      { label: "Calendario mensual", href: "/calendario-mensual" },
    ],
  },
  {
    title: "Festivos y fechas",
    dot: "bg-olive",
    links: [
      { label: "Festivos 2026", href: "/festivos-2026" },
      { label: "Festivos por comunidad", href: "/festivos-por-comunidad" },
      { label: "Vacaciones escolares", href: "/vacaciones-escolares" },
      { label: "Santoral", href: "/santoral" },
    ],
  },
  {
    title: "Calculadoras de fechas",
    dot: "bg-sage",
    links: [
      { label: "Calculadora de días", href: "/calculadora-dias" },
      { label: "Calculadora de semanas", href: "/calculadora-semanas" },
      { label: "Calculadora de edad", href: "/calculadora-edad" },
      { label: "Días hasta Navidad", href: "/dias-hasta-navidad" },
    ],
  },
  {
    title: "Trabajo y nómina",
    dot: "bg-tan",
    links: [
      { label: "Días laborables", href: "/dias-laborables" },
      { label: "Calculadora de vacaciones", href: "/calculadora-vacaciones" },
      { label: "Puentes 2026", href: "/puentes-2026" },
      { label: "Calendario laboral", href: "/calendario-laboral" },
    ],
  },
  {
    title: "Sol y estaciones",
    dot: "bg-sage",
    links: [
      { label: "Amanecer y atardecer", href: "/amanecer-atardecer" },
      { label: "Duración del día", href: "/duracion-del-dia" },
      { label: "Cambio de hora 2027", href: "/cambio-hora-2027" },
      { label: "Solsticio de invierno", href: "/solsticio-invierno" },
    ],
  },
  {
    title: "Integraciones",
    dot: "bg-olive-dark",
    links: [
      { label: "Extensión de Chrome", href: "/extension-chrome" },
      { label: "App para Android", href: "/app-android" },
      { label: "Suscripción iCal", href: "/suscripcion-calendario" },
      { label: "Widget para tu web", href: "/widget-numero-semana" },
    ],
  },
];

export function getFaqs(week: number, nextWeek: number, year: number, yearWeeks: number): Faq[] {
  const parity = week % 2 === 0 ? "par" : "impar";
  const nextParity = nextWeek % 2 === 0 ? "par" : "impar";
  return [
    {
      question: "¿Qué semana es hoy?",
      answer: `Hoy estamos en la semana ${week} (${parity}). El número de semana se actualiza automáticamente cada lunes.`,
    },
    {
      question: "¿Cómo se calcula el número de semana?",
      answer:
        "En España se usa la norma ISO 8601: la semana empieza el lunes y la primera semana del año es la que contiene el primer jueves.",
    },
    {
      question: "¿Cuántas semanas tiene un año?",
      answer: `La mayoría de los años tienen 52 semanas, pero algunos tienen 53. ${year} tiene ${yearWeeks} semanas.`,
    },
    {
      question: "¿Esta semana es par o impar?",
      answer: `La semana ${week} es ${parity} y la próxima, la semana ${nextWeek}, es ${nextParity}.`,
    },
    {
      question: "¿Cómo encuentro el número de semana de una fecha?",
      answer:
        "Elige la fecha en el selector de la parte superior de la página y verás al instante el número de semana y sus fechas.",
    },
    {
      question: "¿NumeroSemanas es gratis?",
      answer:
        "Sí. Todas las herramientas, calendarios y PDF imprimibles son gratuitos.",
    },
  ];
}
