import type { Faq } from "./content";
import type { SiteLink } from "./content";

type FooterPageSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type FooterPage = {
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: FooterPageSection[];
  faqs: Faq[];
  related: SiteLink[];
  legal?: boolean;
  /** Legacy content-readiness flag; all published pages are now indexable. */
  indexable?: boolean;
};

type ResourcePageOptions = { indexable?: boolean };

/** All resource pages are now indexable. */
const PENDING: ResourcePageOptions = {};

const weekLinks: SiteLink[] = [
  { label: "Semanas de 2026", href: "/semanas-2026" },
  { label: "Calendario 2027", href: "/calendario-2027" },
  { label: "Calculadoras", href: "/calculadoras" },
];

function createResourcePage(
  title: string,
  description: string,
  eyebrow: string,
  intro: string,
  guidance: string,
  related: SiteLink[] = weekLinks,
  options: ResourcePageOptions = {},
): FooterPage {
  return {
    indexable: options.indexable ?? true,
    title,
    metaTitle: `${title} | NumeroSemanas`,
    description,
    eyebrow,
    intro,
    sections: [
      {
        heading: "Qué encontrarás",
        paragraphs: [description],
      },
      {
        heading: "Cómo utilizar esta información",
        paragraphs: [guidance],
      },
      {
        heading: "Antes de planificar",
        paragraphs: [
          "Comprueba las fechas que dependan de administraciones, comunidades autónomas, municipios, centros educativos o convenios en la fuente oficial correspondiente.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Qué sistema de semanas se utiliza?",
        answer: "Se utiliza ISO 8601: la semana empieza el lunes y la semana 1 es la que contiene el primer jueves del año.",
      },
      {
        question: "¿Puedo usar el resultado como información oficial?",
        answer: "La página sirve para consulta y planificación. Cuando una fecha tenga efectos legales, laborales o administrativos, contrástala con la publicación oficial aplicable.",
      },
    ],
    related,
  };
}

const homeCardPages: Record<string, FooterPage> = {
  "calendario-imprimible-2026": createResourcePage(
    "Calendario imprimible 2026",
    "Consulta e imprime el calendario de 2026 con sus números de semana ISO.",
    "Calendario 2026",
    "Organiza el año 2026 en una vista preparada para consulta e impresión.",
    "Usa el calendario anual para localizar una fecha y su semana. Para un documento físico, selecciona orientación horizontal y comprueba la vista previa de impresión.",
    [{ label: "Semanas de 2026", href: "/semanas-2026" }, { label: "Calendario imprimible", href: "/calendario-imprimible" }],
    PENDING,
  ),
  "calendario-laboral": createResourcePage(
    "Calendario laboral",
    "Organiza jornadas, descansos y festivos con una referencia anual basada en semanas ISO.",
    "Trabajo",
    "Una guía para planificar el año laboral sin perder de vista festivos y días no laborables.",
    "Parte del calendario nacional y añade los festivos autonómicos, locales, vacaciones y días establecidos por tu empresa o convenio.",
    weekLinks,
    PENDING,
  ),
  "calendario-mensual": createResourcePage(
    "Calendario mensual",
    "Planifica cada mes por semanas y relaciona tareas, citas y plazos con fechas concretas.",
    "Planificación",
    "Una vista mensual para distribuir actividades y revisar cambios de semana.",
    "Anota primero los compromisos fijos y después reparte las tareas. Incluye el año junto al número de semana cuando compartas la planificación.",
    weekLinks,
    PENDING,
  ),
  "festivos-2026": createResourcePage(
    "Festivos de 2026 en España",
    "Calendario laboral oficial de 2026: festivos nacionales, fechas que caen en domingo, traslados y ámbito de aplicación por comunidad autónoma. Según BOE-A-2025-21667.",
    "Festivos 2026",
    "Consulta los festivos nacionales de 2026 según la resolución BOE-A-2025-21667 publicada el 28 de octubre de 2025.",
    "Añade los festivos de tu comunidad autónoma y los dos festivos locales de tu municipio para completar tu calendario laboral.",
    [{ label: "Calendario 2026", href: "/calendario/2026" }, { label: "Fuentes", href: "/fuentes" }, { label: "Festivos 2027", href: "/festivos-2027" }],
  ),
  "festivos-2027": createResourcePage(
    "Festivos de 2027 en España",
    "Calendario laboral oficial de 2027: festivos nacionales, fechas que caen en domingo, traslados y ámbito de aplicación por comunidad autónoma. Según BOE-A-2026-21254.",
    "Festivos 2027",
    "Consulta los festivos nacionales de 2027 según la resolución BOE-A-2026-21254 publicada el 13 de octubre de 2026.",
    "Añade los festivos de tu comunidad autónoma y los dos festivos locales de tu municipio para completar tu calendario laboral.",
    [{ label: "Calendario 2027", href: "/calendario-2027" }, { label: "Fuentes", href: "/fuentes" }, { label: "Festivos 2026", href: "/festivos-2026" }],
  ),
  "festivos-por-comunidad": createResourcePage(
    "Festivos por comunidad autónoma",
    "Distingue los festivos nacionales de los aprobados por cada comunidad autónoma.",
    "Festivos",
    "Completa el calendario estatal con las fechas aplicables en tu territorio.",
    "Consulta el boletín oficial de tu comunidad y el calendario de tu municipio, porque las fechas pueden variar de una zona a otra.",
    weekLinks,
    PENDING,
  ),
  "dias-laborables": createResourcePage(
    "Días laborables",
    "Calcula días de trabajo teniendo en cuenta fines de semana y los festivos que correspondan.",
    "Trabajo",
    "Una referencia para estimar plazos y jornadas entre dos fechas.",
    "Define qué días forman tu semana laboral y resta los festivos nacionales, autonómicos y locales, además de vacaciones o cierres de empresa.",
    weekLinks,
    PENDING,
  ),
  "dias-laborables-2027": createResourcePage(
    "Días laborables de 2027",
    "Planifica los días de trabajo de 2027 por meses y semanas ISO.",
    "Trabajo 2027",
    "Una base anual para organizar jornadas, proyectos y vacaciones.",
    "Completa el cálculo con el calendario laboral oficial de tu comunidad, municipio, convenio y empresa.",
    weekLinks,
    PENDING,
  ),
  "vacaciones-escolares": createResourcePage(
    "Vacaciones escolares",
    "Organiza periodos no lectivos y semanas de vacaciones escolares en tu calendario familiar.",
    "Calendario escolar",
    "Una guía para ubicar Navidad, Semana Santa y verano sin confundir calendarios territoriales.",
    "Comprueba las fechas publicadas por la consejería de educación y por el propio centro, ya que varían según la comunidad y el curso.",
    weekLinks,
    PENDING,
  ),
  "puentes-2026": createResourcePage(
    "Puentes de 2026",
    "Localiza combinaciones de festivos y fines de semana que pueden facilitar descansos en 2026.",
    "Planificación 2026",
    "Revisa posibles puentes y confirma los días aplicables en tu localidad.",
    "Comprueba el calendario laboral, los festivos territoriales y las condiciones de vacaciones de tu empresa antes de reservar.",
    weekLinks,
    PENDING,
  ),
  "puentes-2027": createResourcePage(
    "Puentes de 2027",
    "Localiza festivos cercanos al fin de semana para anticipar posibles puentes durante 2027.",
    "Planificación 2027",
    "Una referencia inicial para distribuir vacaciones y escapadas.",
    "Espera a la publicación definitiva de los calendarios estatal, autonómico y local antes de cerrar planes que no puedan modificarse.",
    weekLinks,
    PENDING,
  ),
  "calculadora-dias": createResourcePage(
    "Calculadora de días",
    "Calcula la distancia entre fechas y distingue días naturales de días laborables.",
    "Calculadoras",
    "Aclara plazos y duraciones utilizando fechas civiles completas.",
    "Introduce fechas en el mismo calendario y decide si el día inicial o final debe contarse según la regla del plazo que estés aplicando.",
    weekLinks,
    PENDING,
  ),
  "calculadora-semanas": createResourcePage(
    "Calculadora de semanas",
    "Convierte fechas a semanas ISO y estima cuántas semanas separan dos fechas.",
    "Calculadoras",
    "Relaciona fechas concretas con su número y año de semana ISO.",
    "Incluye siempre el año ISO al comunicar el resultado, especialmente cerca del cambio entre diciembre y enero.",
    weekLinks,
    PENDING,
  ),
  "calculadora-edad": createResourcePage(
    "Calculadora de edad",
    "Estima años, meses y días transcurridos desde una fecha de nacimiento.",
    "Calculadoras",
    "Una referencia de calendario para consultar una edad en una fecha determinada.",
    "Comprueba cuidadosamente la fecha introducida. Para trámites, utiliza la edad y los criterios indicados por la administración correspondiente.",
    weekLinks,
    PENDING,
  ),
  "calculadora-vacaciones": createResourcePage(
    "Calculadora de vacaciones",
    "Organiza periodos de vacaciones y estima los días consumidos entre dos fechas.",
    "Trabajo",
    "Planifica descansos distinguiendo días naturales, laborables, fines de semana y festivos.",
    "Aplica las reglas de tu convenio o contrato y confirma el resultado con la empresa, porque el método de cómputo puede variar.",
    weekLinks,
    PENDING,
  ),
  "dias-hasta-navidad": createResourcePage(
    "Días hasta Navidad",
    "Consulta cuánto falta para el 25 de diciembre y en qué semana ISO se encuentra.",
    "Cuenta atrás",
    "Una referencia sencilla para organizar preparativos y plazos de final de año.",
    "Usa la fecha resultante para dividir las tareas por semanas y recuerda que los días de cierre comercial o escolar pueden variar.",
    weekLinks,
    PENDING,
  ),
  "duracion-del-dia": createResourcePage(
    "Duración del día",
    "Compara las horas aproximadas de luz entre el amanecer y el atardecer.",
    "Sol y estaciones",
    "Consulta cómo cambia la luz solar a lo largo del año.",
    "Selecciona una ciudad cercana. Las horas dependen de las coordenadas, la zona horaria y el horizonte local.",
    [{ label: "Amanecer y atardecer", href: "/amanecer-atardecer" }, { label: "Metodología", href: "/metodologia" }],
    PENDING,
  ),
  "cambio-hora-2027": createResourcePage(
    "Cambio de hora en 2027",
    "Consulta las fechas previstas para los cambios de horario de verano e invierno de 2027 en España.",
    "Horario 2027",
    "Planifica los dos ajustes horarios previstos conforme a la regla europea vigente.",
    "Confirma la normativa vigente antes de organizar transportes, turnos o sistemas que dependan de una hora exacta.",
    weekLinks,
    PENDING,
  ),
  santoral: createResourcePage(
    "Santoral",
    "Consulta nombres tradicionalmente asociados a cada fecha del calendario.",
    "Fechas",
    "Una referencia cultural que puede variar entre fuentes y tradiciones.",
    "Contrasta celebraciones locales o litúrgicas con la fuente de la comunidad correspondiente.",
    weekLinks,
    PENDING,
  ),
  "solsticio-invierno": createResourcePage(
    "Solsticio de invierno",
    "Conoce el momento que marca el inicio astronómico del invierno y los días con menos luz.",
    "Astronomía",
    "Una explicación del solsticio y su relación con la duración del día.",
    "La fecha y hora exactas son un instante astronómico global que debe convertirse a la zona horaria local.",
    [{ label: "Amanecer y atardecer", href: "/amanecer-atardecer" }, { label: "Fuentes", href: "/fuentes" }],
    PENDING,
  ),
  "preguntas-frecuentes": createResourcePage(
    "Preguntas frecuentes",
    "Respuestas rápidas sobre semanas ISO, calendarios, festivos y herramientas de NumeroSemanas.",
    "Ayuda",
    "Encuentra los criterios comunes utilizados en todas las páginas del sitio.",
    "Consulta la metodología para conocer las reglas de cálculo y las fuentes para comprobar datos oficiales.",
    [{ label: "Metodología", href: "/metodologia" }, { label: "Contacto", href: "/contacto" }],
    PENDING,
  ),
};

export const footerPages: Record<string, FooterPage> = {
  ...homeCardPages,
  "app-android": {
    // Not indexable until the Google Play listing exists.
    indexable: Boolean(process.env.NEXT_PUBLIC_ANDROID_URL),
    title: "NumeroSemanas para Android",
    metaTitle: "App de semanas para Android | NumeroSemanas",
    description: "Consulta las semanas ISO, calendarios y festivos desde Android.",
    eyebrow: "Nuestras apps",
    intro: "Una forma práctica de consultar la semana ISO y organizar fechas desde el móvil.",
    sections: [
      { heading: "Consulta rápida de la semana", paragraphs: ["La pantalla de inicio reúne el número de semana ISO y las fechas de lunes a domingo para que puedas consultarlos sin hacer cálculos."] },
      { heading: "Calendario y planificación", paragraphs: ["Usa la vista de calendario para revisar fechas, semanas y festivos nacionales de España. Las fechas autonómicas o locales deben contrastarse con el calendario oficial de tu zona."] },
      { heading: "Disponibilidad", paragraphs: ["La distribución oficial de la aplicación y sus requisitos se anunciarán cuando estén confirmados. No se debe instalar un archivo de origen desconocido."] },
    ],
    faqs: [
      { question: "¿Dónde estará disponible la aplicación?", answer: "El enlace oficial de descarga se publicará en esta página cuando la distribución esté activa." },
      { question: "¿La app sustituye el calendario oficial?", answer: "No. Es una ayuda de consulta; comprueba con la administración o entidad correspondiente las fechas oficiales." },
    ],
    related: weekLinks,
  },
  "extension-chrome": {
    // Not indexable until the Chrome Web Store listing exists.
    indexable: Boolean(process.env.NEXT_PUBLIC_CHROME_URL),
    title: "Extensión de semanas para Chrome",
    metaTitle: "Extensión Chrome con semanas ISO | NumeroSemanas",
    description: "Una extensión para consultar el número de semana ISO desde el navegador.",
    eyebrow: "Nuestras apps",
    intro: "Consulta de un vistazo en qué semana ISO estás y cuándo empieza la siguiente.",
    sections: [
      { heading: "El número de semana en el navegador", paragraphs: ["La extensión está pensada para mostrar la semana ISO actual sin interrumpir la navegación. La semana comienza el lunes y termina el domingo."] },
      { heading: "Privacidad y permisos", paragraphs: ["Antes de instalar cualquier extensión, revisa sus permisos y la política de privacidad publicada en su ficha oficial. Una herramienta de semana no necesita acceso al contenido de todas tus páginas."] },
      { heading: "Instalación segura", paragraphs: ["El enlace a la tienda oficial se añadirá cuando esté publicado. Evita paquetes descargados de repositorios no verificados."] },
    ],
    faqs: [
      { question: "¿La extensión ya se puede instalar?", answer: "La disponibilidad se indicará aquí cuando exista una ficha oficial de Chrome Web Store." },
      { question: "¿Qué estándar utiliza?", answer: "La numeración sigue ISO 8601: lunes como primer día y la semana que contiene el 4 de enero como semana 1." },
    ],
    related: weekLinks,
  },
  // Consolidated: /plantillas-calendario 301 → /calendario-imprimible
  "calendario-imprimible": {
    title: "Calendario imprimible y plantillas",
    metaTitle: "Calendario imprimible y plantillas PDF | NumeroSemanas",
    description: "Descarga gratis plantillas PDF para imprimir: calendario anual 2027 con semanas ISO, calendario mensual, planificador semanal y planificador de curso escolar.",
    eyebrow: "Planificación",
    intro: "Elige un formato sencillo para anotar fechas, semanas y tareas sin perder de vista el calendario ISO.",
    sections: [
      { heading: "Calendario anual", paragraphs: ["La vista anual ayuda a ubicar vacaciones, entregas y periodos de trabajo. Cada semana se identifica de lunes a domingo para facilitar la coordinación entre equipos."] },
      { heading: "Planificador semanal", paragraphs: ["Un formato semanal permite repartir actividades por día, registrar responsables y revisar el avance. Antes de compartirlo, acuerda si la planificación usa semanas naturales o turnos de empresa."] },
      { heading: "Uso e impresión", paragraphs: ["Puedes imprimir la [lista de semanas de 2027](/lista-semanas-2027) o guardar como PDF desde el navegador el [calendario de 2026](/calendario/2026) o el de 2027. Revisa la escala y el tamaño A4 en la vista previa de impresión. Si prefieres una agenda digital, [importa las semanas y festivos en tu calendario](/suscripcion-calendario)."] },
    ],
    faqs: [
      { question: "¿Puedo imprimir una lista de semanas?", answer: "Sí. La lista de semanas de 2027 incluye las fechas de inicio y fin y cuenta con opciones de impresión y descarga PDF." },
      { question: "¿Los festivos locales están incluidos?", answer: "Los festivos locales dependen del municipio. Contrástalos con la publicación de tu ayuntamiento o comunidad autónoma." },
    ],
    related: [
      { label: "Lista imprimible de semanas 2027", href: "/lista-semanas-2027" },
      { label: "Calendario 2027 con semanas ISO", href: "/calendario-2027" },
      { label: "Calendario 2026 con festivos", href: "/calendario/2026" },
      { label: "Semanas y festivos en tu calendario digital", href: "/suscripcion-calendario" },
      { label: "Gestión del tiempo con semanas ISO", href: "/gestion-del-tiempo" },
    ],
  },
  "cuantas-semanas-tiene-un-anio": {
    title: "¿Cuántas semanas tiene un año?",
    metaTitle: "Cuántas semanas tiene un año: 52 o 53 | NumeroSemanas",
    description: "Un año ISO tiene 52 o 53 semanas. Descubre cuándo aparece la semana 53, cómo se comprueba con el 28 de diciembre y cuántas semanas tiene este año.",
    eyebrow: "Guía de semanas",
    intro: "Un año ISO puede tener 52 o 53 semanas completas, numeradas de lunes a domingo.",
    sections: [
      { heading: "Por qué hay 52 o 53 semanas", paragraphs: ["Un año común tiene 365 días, que equivalen a 52 semanas y un día. Un año bisiesto tiene 366 días: 52 semanas y dos días. La numeración ISO agrupa semanas completas, por eso algunos años contienen una semana 53."] },
      { heading: "Cuándo aparece la semana 53", paragraphs: ["Hay 53 semanas ISO cuando el 1 de enero cae en jueves, o cuando es año bisiesto y comienza en miércoles. El año de la semana lo determina el jueves que contiene. Tras una semana 53, la semana 1 siguiente también es impar, algo a tener en cuenta si organizas [turnos por semanas pares e impares](/semanas-pares-e-impares)."] },
      { heading: "Cómo comprobar un año concreto", paragraphs: ["El número de semanas se obtiene calculando la [semana ISO](/numeros-de-semana) del 28 de diciembre. También puedes comprobarlo en la lista de cada año: las [semanas de 2026](/semanas-2026) llegan a la 53 y las [semanas de 2027](/semanas/2027) terminan en la 52."] },
    ],
    faqs: [
      { question: "¿Cuántas semanas tiene 2026?", answer: "2026 tiene 53 semanas ISO." },
      { question: "¿Un año bisiesto siempre tiene 53 semanas?", answer: "No. Solo los años bisiestos que empiezan en miércoles tienen 53 semanas ISO." },
    ],
    related: [
      { label: "¿Qué semana es hoy?", href: "/" },
      { label: "Qué es el número de semana ISO", href: "/numeros-de-semana" },
      { label: "Semanas de 2026 (53 semanas)", href: "/semanas-2026" },
      { label: "Lista de semanas 2027 para imprimir", href: "/lista-semanas-2027" },
    ],
  },
  // Consolidated: /que-es-el-numero-de-semana 301 → /numeros-de-semana
  "numeros-de-semana": {
    title: "Qué es el número de semana ISO",
    metaTitle: "Número de semana: qué es y cómo se calcula | NumeroSemanas",
    description: "Qué es el número de semana ISO 8601, por qué la semana empieza en lunes, cómo se determina la semana 1, qué pasa en el cambio de año y qué semana es hoy.",
    eyebrow: "Guía ISO 8601",
    intro: "El número de semana sitúa una fecha dentro del año según una regla común para calendarios y planificación.",
    sections: [
      { heading: "La regla ISO 8601", paragraphs: ["En España se usa habitualmente la numeración ISO 8601: las semanas empiezan el lunes y terminan el domingo. La semana 1 es la que contiene el primer jueves del año; también es la semana que contiene el 4 de enero."] },
      { heading: "El cambio de año", paragraphs: ["El año ISO no siempre coincide con el año civil. Los últimos días de diciembre pueden pertenecer a la semana 1 del año siguiente, y los primeros días de enero pueden seguir en la última semana del año ISO anterior. Por eso un año puede tener 52 o 53 semanas: lo explicamos en [cuántas semanas tiene un año](/cuantas-semanas-tiene-un-anio)."] },
      { heading: "Para qué sirve", paragraphs: ["Los números de semana ayudan a comparar fechas, acordar plazos, organizar turnos y coordinar calendarios. Para turnos que alternan cada dos semanas, consulta si la [semana es par o impar](/semanas-pares-e-impares). Para evitar confusiones, indica también el año ISO, por ejemplo, 2026-W46."] },
    ],
    faqs: [
      { question: "¿La semana empieza en lunes o domingo?", answer: "En ISO 8601, utilizada en España, la semana empieza el lunes y termina el domingo." },
      { question: "¿Por qué el 1 de enero puede ser semana 53?", answer: "Porque la semana pertenece al año ISO del jueves que contiene; el 1 de enero puede estar en la última semana del año anterior." },
    ],
    related: [
      { label: "¿Qué semana es hoy?", href: "/" },
      { label: "Semanas de 2026 con sus fechas", href: "/semanas-2026" },
      { label: "Calendario 2027 con semanas ISO", href: "/calendario-2027" },
      { label: "Metodología de cálculo", href: "/metodologia" },
    ],
  },
  // Consolidated: /semana-par-o-impar 301 → /semanas-pares-e-impares
  "semanas-pares-e-impares": {
    title: "Semana actual: par o impar",
    metaTitle: "Semana par o impar: ¿esta semana es par? | NumeroSemanas",
    description: "Comprueba si esta semana es par o impar según la numeración ISO 8601, cómo usar la paridad para organizar turnos alternos y qué ocurre tras una semana 53.",
    eyebrow: "Consulta semanal",
    intro: "La paridad se obtiene directamente del número ISO: si es divisible entre dos, la semana es par; si no, es impar.",
    sections: [
      { heading: "Cómo se determina la paridad", paragraphs: ["La regla no depende del mes ni del día de inicio de una actividad. Se toma el [número ISO de la semana](/numeros-de-semana) en curso y se comprueba si es par o impar."] },
      { heading: "Turnos y rutinas alternas", paragraphs: ["La paridad puede servir para organizar turnos, actividades o tareas que se repiten cada dos semanas. Deja por escrito la fecha y hora del cambio: la etiqueta par o impar, por sí sola, no indica quién empieza. La [lista de semanas de 2026](/semanas-2026) muestra la paridad de cada semana."] },
      { heading: "Atención a la semana 53", paragraphs: ["Cuando un año ISO tiene [53 semanas](/cuantas-semanas-tiene-un-anio), la semana 53 y la semana 1 siguiente son ambas impares. Revisa el año ISO al preparar turnos que cruzan diciembre y enero."] },
    ],
    faqs: [
      { question: "¿La semana par empieza siempre en lunes?", answer: "Sí. La numeración ISO define cada semana de lunes a domingo, aunque una actividad personal pueda cambiar de día." },
      { question: "¿Puede haber dos semanas impares seguidas?", answer: "Sí. Si el año termina en semana 53, la siguiente semana 1 también es impar." },
    ],
    related: [
      { label: "¿Qué semana es hoy?", href: "/" },
      { label: "Paridad de las semanas de 2027", href: "/semanas/2027" },
      { label: "Semanas ISO en tu calendario digital", href: "/suscripcion-calendario" },
      { label: "Calendario imprimible para turnos", href: "/calendario-imprimible" },
    ],
  },
  "datos-abiertos": {
    title: "Datos abiertos de semanas y festivos",
    metaTitle: "API de semanas ISO y festivos | NumeroSemanas",
    description: "API JSON pública y sin clave para consultar la semana ISO de cualquier fecha y los festivos nacionales de España, con un ejemplo de uso en JavaScript.",
    eyebrow: "Datos abiertos",
    intro: "Las herramientas usan reglas de calendario reproducibles y ofrecen respuestas JSON sencillas para integraciones.",
    sections: [
      { heading: "Semana para una fecha", paragraphs: ["La ruta /api/v1/semana?fecha=YYYY-MM-DD devuelve la fecha recibida y su año y número de semana ISO. Las fechas se interpretan como fechas civiles locales, no como marcas horarias UTC."] },
      { heading: "Festivos nacionales", paragraphs: ["La ruta /api/v1/festivos?year=YYYY devuelve las fechas nacionales estimadas por el calendario. Los festivos autonómicos y locales pueden variar; verifica la resolución oficial aplicable. Si solo necesitas verlos en tu agenda, usa la [suscripción al calendario](/suscripcion-calendario)."] },
      { heading: "Uso desde otras aplicaciones", paragraphs: ["Puedes llamar a las rutas desde un navegador o con fetch. Las respuestas incluyen cabeceras CORS y caché para facilitar la lectura desde otras aplicaciones."] },
    ],
    faqs: [
      { question: "¿La API necesita una clave?", answer: "Las rutas públicas de consulta no requieren una clave. El servicio puede ajustar límites o disponibilidad si fuera necesario." },
      { question: "¿La lista nacional sustituye al calendario BOE?", answer: "No. Para obligaciones laborales y festivos autonómicos o locales, prevalece la publicación oficial correspondiente." },
    ],
    related: [
      { label: "Metodología", href: "/metodologia" },
      { label: "Fuentes de datos", href: "/fuentes" },
      { label: "Calendario 2027", href: "/calendario-2027" },
    ],
  },
  calculadoras: {
    title: "Calculadoras de fechas y semanas",
    metaTitle: "Calculadoras de fechas y semanas | NumeroSemanas",
    description: "Herramientas para convertir fechas, calcular intervalos, días entre fechas, horas de trabajo y planificar semanas ISO.",
    eyebrow: "Herramientas",
    intro: "Selecciona la operación que necesitas: consulta una fecha, calcula un intervalo o planifica días de trabajo.",
    sections: [
      { heading: "Fechas y semanas", paragraphs: ["Las conversiones entre fecha y semana usan ISO 8601. El resultado incluye el año ISO, que puede diferir del año civil cerca de enero y diciembre. Calcula [días entre fechas](/calculadora-dias-entre-fechas) o [suma días a una fecha](/calculadora-sumar-dias)."] },
      { heading: "Días laborables", paragraphs: ["Los días laborables excluyen fines de semana y festivos incluidos en los datos. Los calendarios regionales y locales pueden añadir fechas propias, por lo que conviene comprobarlos antes de planificar. Consulta también el [planificador de proyectos](/planificador-proyectos)."] },
      { heading: "Cálculos personales", paragraphs: ["Las herramientas de [horas de trabajo](/calculadora-horas-trabajo) e intervalos realizan cálculos informativos en el navegador. Revisa las fechas introducidas antes de utilizar el resultado en un trámite o contrato."] },
    ],
    faqs: [
      { question: "¿Los cálculos se guardan?", answer: "Las calculadoras muestran el resultado de los valores introducidos y no necesitan crear una cuenta." },
      { question: "¿Qué sistema de semanas se utiliza?", answer: "Se utiliza la norma ISO 8601, con semanas de lunes a domingo." },
    ],
    related: [
      { label: "Días entre fechas", href: "/calculadora-dias-entre-fechas" },
      { label: "Sumar días a una fecha", href: "/calculadora-sumar-dias" },
      { label: "Horas de trabajo", href: "/calculadora-horas-trabajo" },
      { label: "Planificador de proyectos", href: "/planificador-proyectos" },
    ],
  },
  "gestion-del-tiempo": {
    title: "Gestión del tiempo con semanas ISO",
    metaTitle: "Gestión del tiempo con semanas ISO | NumeroSemanas",
    description: "Ideas prácticas para planificar proyectos y plazos por semanas ISO: entregas semanales, días laborables, festivos y revisiones periódicas en equipo.",
    eyebrow: "Planificación",
    intro: "Usar el mismo calendario semanal facilita repartir trabajo y revisar plazos sin ambigüedades.",
    sections: [
      { heading: "Convierte metas en semanas", paragraphs: ["Divide un proyecto en entregas semanales y anota el [número de semana ISO](/numeros-de-semana) junto a la fecha. Así, las referencias de equipo siguen siendo claras al cambiar de mes."] },
      { heading: "Reserva días laborables con contexto", paragraphs: ["Al estimar la duración, distingue días naturales de días laborables y revisa festivos nacionales, autonómicos y locales. Las vacaciones y turnos propios también afectan a la disponibilidad."] },
      { heading: "Revisa la planificación", paragraphs: ["Una revisión breve al inicio o al cierre de semana ayuda a actualizar prioridades, responsables y fechas. Comparte las decisiones en un calendario accesible para las personas implicadas; puedes [añadir las semanas ISO a tu calendario digital](/suscripcion-calendario)."] },
    ],
    faqs: [
      { question: "¿Es mejor planificar por semana o por día?", answer: "La semana sirve para organizar hitos y carga general; el día ayuda a concretar tareas y reuniones. Combinar ambos niveles suele ser más claro." },
      { question: "¿Qué herramienta puedo usar para fechar una tarea?", answer: "La lista de semanas, el calendario anual y las calculadoras de fechas ayudan a transformar una fecha en una semana ISO." },
    ],
    related: [
      { label: "Plantillas de calendario para imprimir", href: "/calendario-imprimible" },
      { label: "Lista de semanas 2027", href: "/lista-semanas-2027" },
      { label: "Semanas pares e impares", href: "/semanas-pares-e-impares" },
    ],
  },
  "suscripcion-calendario": {
    title: "Añade semanas y festivos a tu calendario",
    metaTitle: "Calendario iCal con semanas y festivos | NumeroSemanas",
    description: "Descarga un archivo iCal (.ics) con las semanas ISO y los festivos nacionales de 2026 e impórtalo en Google Calendar, Apple Calendar u Outlook.",
    eyebrow: "Integraciones",
    intro: "Importa un archivo iCalendar en tu aplicación para consultar semanas y fechas destacadas junto a tus citas.",
    sections: [
      { heading: "Qué incluye el archivo", paragraphs: ["El archivo iCalendar incluye los comienzos de [semana ISO](/numeros-de-semana) y los festivos nacionales calculados para el año seleccionado, los mismos que muestra el [calendario de 2026](/calendario/2026). Las fechas son informativas y no sustituyen los calendarios autonómicos y locales oficiales."] },
      { heading: "Google Calendar", paragraphs: ["Descarga el archivo .ics y, desde Google Calendar en el navegador, abre la opción de importar calendario. Selecciona el archivo y el calendario de destino antes de confirmar."] },
      { heading: "Apple Calendar y Outlook", paragraphs: ["En Apple Calendar, abre el archivo y confirma la importación. En Outlook, utiliza la opción de agregar calendario desde archivo. Comprueba la zona horaria del calendario tras importarlo."] },
    ],
    faqs: [
      { question: "¿El calendario se actualiza automáticamente?", answer: "La descarga corresponde al año indicado. Para obtener correcciones o un año nuevo, vuelve a descargar e importar el archivo actualizado." },
      { question: "¿Incluye festivos locales?", answer: "No; los festivos locales deben añadirse según el municipio y la publicación oficial aplicable." },
    ],
    related: [
      { label: "Semanas de 2026 con festivos", href: "/semanas-2026" },
      { label: "Calendario imprimible y plantillas", href: "/calendario-imprimible" },
      { label: "API de semanas y festivos", href: "/datos-abiertos" },
      { label: "Fuentes de datos", href: "/fuentes" },
    ],
  },
  metodologia: {
    title: "Metodología de cálculo",
    metaTitle: "Metodología: cómo calculamos las semanas ISO | NumeroSemanas",
    description: "Cómo calculamos las semanas ISO 8601, las diferencias entre fechas, los festivos y los horarios solares, y qué datos conviene contrastar con fuentes oficiales.",
    eyebrow: "Transparencia",
    intro: "Las fechas de semana se calculan con reglas explícitas; los datos que dependen de fuentes públicas se presentan con sus límites.",
    sections: [
      { heading: "Numeración ISO 8601", paragraphs: ["Cada semana empieza en lunes. La semana 1 contiene el 4 de enero y, por tanto, el primer jueves del año. El año ISO de una semana viene determinado por el jueves que contiene."] },
      { heading: "Cálculos de fechas", paragraphs: ["Las operaciones de fecha usan componentes de calendario local y diferencias de día civil, evitando convertir una fecha de presentación a UTC de forma que cambie el día."] },
      { heading: "Datos sujetos a publicación", paragraphs: ["Los festivos autonómicos, locales, pagos y cambios oficiales pueden actualizarse mediante resoluciones. Las estimaciones se identifican y deben contrastarse antes de tomar decisiones laborales o económicas."] },
    ],
    faqs: [
      { question: "¿Los números de semana están escritos a mano?", answer: "No. Se obtienen mediante funciones de fecha deterministas y la regla ISO, lo que evita mantener una tabla manual por cada año." },
      { question: "¿Qué ocurre con la zona horaria?", answer: "Las fechas de calendario se presentan como fechas civiles. Los cálculos de amanecer y atardecer muestran la hora de la zona local de cada ciudad." },
    ],
    related: [
      { label: "Qué es el número de semana", href: "/numeros-de-semana" },
      { label: "Fuentes de datos", href: "/fuentes" },
      { label: "Datos abiertos", href: "/datos-abiertos" },
      { label: "Principios editoriales y correcciones", href: "/principios-editoriales" },
    ],
  },
  fuentes: {
    title: "Fuentes de datos y referencias",
    metaTitle: "Fuentes oficiales de datos y referencias | NumeroSemanas",
    description: "Fuentes oficiales para calendarios, festivos, prestaciones y astronomía en España (BOE, SEPE, Seguridad Social, IGN) y qué datos calculamos nosotros.",
    eyebrow: "Transparencia",
    intro: "Esta página distingue los cálculos propios de los datos que deben confirmarse en una fuente pública.",
    sections: [
      { heading: "Calendario y festivos", paragraphs: ["Las reglas de semana siguen ISO 8601. Los calendarios laborales estatales se publican en el Boletín Oficial del Estado (BOE); las comunidades autónomas y ayuntamientos publican sus propias fechas y traslados."] },
      { heading: "Prestaciones y pensiones", paragraphs: ["Para prestaciones de desempleo, consulta el Servicio Público de Empleo Estatal (SEPE). Para pensiones, consulta la Seguridad Social y la entidad pagadora. Las fechas efectivas de abono también pueden depender de cada entidad financiera."] },
      { heading: "Cálculos astronómicos", paragraphs: ["Las fases lunares se estiman con ecuaciones astronómicas publicadas. Amanecer y atardecer se aproximan mediante el algoritmo solar NOAA y las coordenadas de la ciudad seleccionada; el horizonte local puede cambiar la observación real."] },
    ],
    faqs: [
      { question: "¿Cuál es la fuente legal de los festivos?", answer: "El BOE publica el calendario estatal y las resoluciones laborales; consulta también la comunidad autónoma y el municipio correspondientes." },
      { question: "¿Los horarios de sol son observaciones oficiales?", answer: "No. Son cálculos aproximados con coordenadas de referencia y zona horaria; el relieve y el horizonte pueden variar el resultado." },
    ],
    related: [
      { label: "Metodología", href: "/metodologia" },
      { label: "Festivos y calendario 2027", href: "/calendario-2027" },
      { label: "Datos abiertos", href: "/datos-abiertos" },
    ],
  },
  "sobre-nosotros": {
    title: "Sobre NumeroSemanas",
    metaTitle: "Sobre NumeroSemanas | Información del proyecto",
    description: "NumeroSemanas es una herramienta web gratuita para consultar semanas ISO y organizar fechas en España. Conoce su propósito, su alcance y cómo contactar.",
    eyebrow: "El proyecto",
    intro: "NumeroSemanas es una herramienta web para consultar semanas ISO y organizar fechas en España.",
    sections: [
      { heading: "Qué ofrece el sitio", paragraphs: ["La página reúne un número de semana, calendarios anuales, listas imprimibles y utilidades de fechas. Las reglas de calendario se explican para que el resultado pueda comprobarse."] },
      { heading: "El proyecto", paragraphs: ["NumeroSemanas es un proyecto web de consulta de calendarios y semanas ISO. Actualmente ofrece herramientas informativas gratuitas y no vende productos ni exige crear una cuenta."] },
      { heading: "Cómo contactar", paragraphs: ["Para comunicar errores de fechas, dudas o solicitudes relacionadas con el servicio, utiliza el formulario de contacto. No incluyas datos personales sensibles que no sean necesarios para responder."] },
    ],
    faqs: [
      { question: "¿Para qué sirve NumeroSemanas?", answer: "Permite consultar el número de semana ISO, las fechas de cada semana y herramientas de calendario." },
      { question: "¿Puedo proponer una corrección?", answer: "Sí. Envía la ruta y la fecha que consideras incorrecta desde el formulario de contacto." },
    ],
    related: [
      { label: "Principios editoriales", href: "/principios-editoriales" },
      { label: "Metodología", href: "/metodologia" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  "principios-editoriales": {
    title: "Principios editoriales",
    metaTitle: "Principios editoriales y correcciones | NumeroSemanas",
    description: "Cómo separamos los cálculos de la información oficial, cómo verificamos los datos de calendario y cómo corregimos los errores en NumeroSemanas.",
    eyebrow: "Transparencia",
    intro: "Publicamos información de calendario con un criterio de claridad, trazabilidad y corrección.",
    sections: [
      { heading: "Separar cálculo de información oficial", paragraphs: ["Los números de semana y diferencias entre fechas se calculan con reglas reproducibles. Los festivos, horarios de pago y datos administrativos se distinguen de los resultados matemáticos."] },
      { heading: "Corregir errores", paragraphs: ["Cuando se detecta un error, revisamos la regla o la fuente que lo originó y actualizamos la información afectada. Las dudas pueden remitirse desde el formulario de contacto."] },
      { heading: "Responsabilidad editorial", paragraphs: ["NumeroSemanas mantiene y revisa el contenido publicado en el sitio. Para comunicar una corrección, utiliza el formulario de contacto e indica la página, la fecha afectada y la fuente que permita comprobarla."] },
    ],
    faqs: [
      { question: "¿Cómo se comprueba un dato?", answer: "Se contrasta con la regla de cálculo o con la fuente pública indicada en la página, según el tipo de dato." },
      { question: "¿Qué hago si encuentro un error?", answer: "Indica la URL, el dato y, si es posible, la fuente oficial que permite revisarlo." },
    ],
    related: [
      { label: "Fuentes de datos", href: "/fuentes" },
      { label: "Metodología", href: "/metodologia" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  contacto: {
    title: "Contacta con NumeroSemanas",
    metaTitle: "Contacto: consultas y avisos de errores | NumeroSemanas",
    description: "Envía una consulta o comunica un error de calendario mediante el formulario de contacto de NumeroSemanas. Indica la página, la fecha y la fuente.",
    eyebrow: "Atención y consultas",
    intro: "Usa el formulario para hacer una pregunta o señalar un dato que necesite revisión.",
    sections: [
      { heading: "Consultas sobre calendarios", paragraphs: ["Indica el año, la fecha y la página a la que se refiere tu consulta. Si informas de un error, incluye la fuente oficial que permita comprobarlo."] },
      { heading: "Protección de datos", paragraphs: ["El nombre, el correo y el mensaje se utilizan para gestionar la consulta. No envíes información médica, financiera ni otros datos sensibles."] },
      { heading: "Canal de contacto", paragraphs: ["Las consultas se reciben mediante el formulario de esta página. El servicio de envío solo funciona cuando el canal de correo está configurado; si no está disponible, el formulario lo indica sin guardar el mensaje."] },
    ],
    faqs: [
      { question: "¿Qué información incluyo al notificar un error?", answer: "La URL, la fecha afectada y una referencia oficial o explicación del cálculo que permita revisarlo." },
      { question: "¿Puedo enviar datos personales sensibles?", answer: "No. Limita el mensaje a la información imprescindible para responder a la consulta." },
    ],
    related: [
      { label: "Fuentes de datos", href: "/fuentes" },
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Metodología", href: "/metodologia" },
      { label: "Sobre NumeroSemanas", href: "/sobre-nosotros" },
    ],
  },
  "aviso-legal": {
    title: "Aviso legal",
    metaTitle: "Aviso legal de NumeroSemanas",
    description: "Aviso legal de NumeroSemanas: identificación del sitio, objeto y condiciones de uso, propiedad intelectual y responsabilidad sobre los contenidos.",
    eyebrow: "Información legal",
    legal: true,
    intro: "Este aviso reúne la información que debe publicarse sobre el titular y las condiciones generales de acceso.",
    sections: [
      { heading: "Identificación del sitio", paragraphs: ["Nombre del sitio: NumeroSemanas. Dominio: numerosemanas.es. Las comunicaciones relacionadas con el contenido o el funcionamiento del servicio pueden enviarse mediante el formulario de contacto."] },
      { heading: "Objeto y condiciones de uso", paragraphs: ["El sitio ofrece calendarios, cálculos de fechas y contenidos informativos. El usuario debe utilizarlo de forma lícita y comprobar los datos oficiales antes de tomar decisiones laborales, administrativas o económicas."] },
      { heading: "Propiedad intelectual y responsabilidad", paragraphs: ["Los elementos originales del sitio pertenecen a su titular o se utilizan con licencia. Los resultados informativos se ofrecen sin sustituir el asesoramiento profesional ni la publicación oficial."] },
    ],
    faqs: [
      { question: "¿La información del calendario sustituye al BOE?", answer: "No. Para decisiones legales y laborales prevalecen las publicaciones oficiales aplicables." },
    ],
    related: [
      { label: "Términos de uso", href: "/terminos-de-uso" },
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  "terminos-de-uso": {
    title: "Términos de uso",
    metaTitle: "Términos de uso | NumeroSemanas",
    description: "Condiciones de acceso y uso del servicio gratuito de NumeroSemanas: uso de calendarios y herramientas, disponibilidad y cambios del servicio.",
    eyebrow: "Información legal",
    legal: true,
    intro: "Al utilizar estas páginas aceptas las condiciones de uso que se describen a continuación.",
    sections: [
      { heading: "Descripción del servicio", paragraphs: ["NumeroSemanas presta desde numerosemanas.es un servicio gratuito de consulta de semanas, calendarios y cálculos de fechas. Las consultas sobre el servicio se atienden mediante el formulario de contacto."] },
      { heading: "Uso de calendarios y herramientas", paragraphs: ["Las herramientas se ofrecen con finalidad informativa y de planificación. Comprueba fechas oficiales, convenios, normas internas y datos de tu comunidad o municipio antes de utilizarlos para una decisión vinculante."] },
      { heading: "Disponibilidad y cambios", paragraphs: ["El sitio puede actualizar herramientas, contenidos o enlaces para corregir datos o mantener el servicio. Las condiciones imperativas de protección al consumidor y demás derechos legales no quedan limitadas por este texto."] },
    ],
    faqs: [
      { question: "¿Puedo usar los resultados como certificación oficial?", answer: "No. Las páginas son herramientas informativas y no emiten certificaciones ni sustituyen un calendario oficial." },
    ],
    related: [
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Devoluciones y cancelaciones", href: "/devoluciones" },
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  "politica-de-privacidad": {
    title: "Política de privacidad",
    metaTitle: "Política de privacidad | NumeroSemanas",
    description: "Qué datos trata NumeroSemanas, con qué finalidad y base jurídica, cuánto tiempo se conservan y cómo ejercer tus derechos de protección de datos.",
    eyebrow: "Privacidad",
    legal: true,
    intro: "Esta política describe el tratamiento que debe aplicarse a las consultas enviadas y a las preferencias de analítica.",
    sections: [
      { heading: "Responsable y contacto", paragraphs: ["NumeroSemanas gestiona los datos enviados desde numerosemanas.es. Para consultas de privacidad o para ejercer derechos, utiliza el formulario de contacto y escribe «Privacidad» al comienzo del mensaje."] },
      { heading: "Datos, finalidad y base jurídica", paragraphs: ["El formulario solicita nombre, correo y mensaje únicamente para tramitar y responder la consulta. La base jurídica es el consentimiento prestado al enviar el formulario. Las fechas introducidas en las calculadoras se procesan para mostrar el resultado y no requieren una cuenta. La analítica opcional solo se carga después de aceptarla."] },
      { heading: "Conservación, destinatarios y derechos", paragraphs: ["Los mensajes se conservan durante el tiempo necesario para atender la consulta y, como máximo, doce meses salvo que exista una obligación legal. El proveedor de correo puede tratar los datos para realizar el envío. Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad mediante el formulario, y presentar una reclamación ante la Agencia Española de Protección de Datos."] },
    ],
    faqs: [
      { question: "¿La analítica se activa sin consentimiento?", answer: "No. Clarity y Google Analytics solo se cargan tras elegir «Permitir cookies de analítica»." },
      { question: "¿Dónde puedo solicitar mis derechos?", answer: "Utiliza el formulario de contacto, escribe «Privacidad» al comienzo del mensaje e indica con claridad tu solicitud." },
    ],
    related: [
      { label: "Política de cookies", href: "/politica-de-cookies" },
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  devoluciones: {
    title: "Política de devoluciones y cancelaciones",
    metaTitle: "Devoluciones y cancelaciones | NumeroSemanas",
    description: "NumeroSemanas no ofrece productos ni servicios de pago. Consulta qué condiciones de devolución y cancelación se publicarían si eso cambiara.",
    eyebrow: "Información legal",
    legal: true,
    intro: "NumeroSemanas no ofrece actualmente productos ni servicios de pago, por lo que no hay compras que devolver o cancelar.",
    sections: [
      { heading: "Servicio gratuito", paragraphs: ["Las herramientas, calendarios y descargas disponibles actualmente en NumeroSemanas son gratuitas. El sitio no solicita datos de pago ni formaliza pedidos."] },
      { heading: "Si se incorporan productos de pago", paragraphs: ["Antes de activar una compra se publicarán el precio total, las características, la forma de entrega y las condiciones de desistimiento, devolución y cancelación aplicables. Esas condiciones se mostrarán antes de confirmar el pedido."] },
      { heading: "Consultas", paragraphs: ["Si detectas un cargo que utiliza el nombre de NumeroSemanas o tienes una duda sobre esta política, comunícalo mediante el formulario de contacto con los datos mínimos necesarios para revisar el caso."] },
    ],
    faqs: [
      { question: "¿Hay compras disponibles en este momento?", answer: "No. Las herramientas y descargas publicadas actualmente en NumeroSemanas son gratuitas." },
    ],
    related: [
      { label: "Términos de uso", href: "/terminos-de-uso" },
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  "politica-de-cookies": {
    title: "Política de cookies",
    metaTitle: "Política de cookies | NumeroSemanas",
    description: "Cómo gestiona NumeroSemanas las cookies y el consentimiento de analítica, qué servicios solo se cargan si los aceptas y cómo cambiar tu elección.",
    eyebrow: "Privacidad",
    legal: true,
    intro: "La analítica opcional está desactivada hasta que la persona visitante presta su consentimiento.",
    sections: [
      { heading: "Quién gestiona las preferencias", paragraphs: ["NumeroSemanas gestiona las preferencias de cookies de numerosemanas.es. Puedes enviar cualquier consulta de privacidad desde el formulario de contacto."] },
      { heading: "Cookies necesarias y analítica", paragraphs: ["El sitio guarda en el almacenamiento local del navegador la elección «solo necesarias» o «analítica aceptada». Microsoft Clarity y Google Analytics solo se cargan si se han configurado en el sitio y después de aceptar la analítica. Si se rechaza, esos scripts no se descargan y las herramientas siguen disponibles."] },
      { heading: "Cambiar o retirar el consentimiento", paragraphs: ["Puedes volver a abrir el panel desde «Configuración de cookies» al pie de página y modificar tu preferencia en cualquier momento. También puedes borrar el almacenamiento y las cookies desde la configuración del navegador."] },
    ],
    faqs: [
      { question: "¿Cómo puedo cambiar mi consentimiento?", answer: "Pulsa «Configuración de cookies» en el pie de página y elige una opción." },
      { question: "¿Las herramientas funcionan si rechazo la analítica?", answer: "Sí. El rechazo solo impide cargar los servicios de analítica opcional." },
    ],
    related: [
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  "dias-de-cobro-2026": {
    title: "Días de cobro de nómina en 2026",
    metaTitle: "Días de cobro de nómina 2026 mes a mes | NumeroSemanas",
    description: "Fechas de referencia para cobrar la nómina en 2026, mes a mes, ajustadas a fines de semana y festivos nacionales, con su número de semana ISO.",
    eyebrow: "Pagos 2026",
    intro: "Una tabla de fechas de referencia para planificar cobros mensuales. El día efectivo depende de la empresa y de la entidad bancaria.",
    sections: [
      { heading: "Fechas orientativas", paragraphs: ["La tabla usa el día 25 como fecha nominal de ejemplo y desplaza una fecha que coincida con fin de semana o [festivo nacional de 2026](/calendario/2026) al día laborable anterior. No representa una fecha de pago garantizada por todas las empresas."] },
      { heading: "Cómo leer la tabla", paragraphs: ["Cada fila muestra el mes, el día nominal, la fecha ajustada según el calendario nacional y su semana ISO. Los festivos autonómicos, locales y los acuerdos de empresa pueden cambiar el resultado aplicable."] },
      { heading: "Confirma con tu empresa", paragraphs: ["La fecha de abono puede depender del convenio, el calendario de nóminas y los tiempos de compensación bancaria. Confirma la fecha con el departamento de personal o la entidad pagadora."] },
    ],
    faqs: [
      { question: "¿Es una fecha oficial de pago?", answer: "No. Es una fecha calculada con un día nominal de referencia; la fecha real depende de cada empresa." },
      { question: "¿Se incluyen los festivos de mi comunidad?", answer: "La fecha de referencia solo descuenta fines de semana y festivos nacionales calculados. Consulta también el calendario autonómico y local." },
    ],
    related: [
      { label: "Fechas de pago del SEPE", href: "/pagos-sepe-2026" },
      { label: "Pago de pensiones", href: "/pago-pensiones-2026" },
      { label: "Calendario 2026 con festivos", href: "/calendario/2026" },
    ],
  },
  "pagos-sepe-2026": {
    title: "Fechas de pago del SEPE en 2026",
    metaTitle: "Pagos del SEPE 2026: fechas orientativas | NumeroSemanas",
    description: "Calendario orientativo de pagos del SEPE en 2026: fecha de referencia de cada mes ajustada a fines de semana y festivos nacionales, con su semana ISO.",
    eyebrow: "Prestaciones 2026",
    intro: "Consulta fechas nominales de referencia para organizarte. El día en que se abona una prestación puede variar según la entidad financiera.",
    sections: [
      { heading: "Calendario de referencia", paragraphs: ["La tabla calcula una fecha nominal de ejemplo (día 10) y la mueve al día laborable anterior si coincide con fin de semana o festivo nacional. No es un calendario oficial de pagos del SEPE ni confirma el abono efectivo."] },
      { heading: "Quién determina el abono", paragraphs: ["El SEPE reconoce y ordena las prestaciones, mientras que la entidad financiera puede anticipar o reflejar el ingreso en fechas distintas. Consulta el estado de tu prestación y las comunicaciones de tu banco."] },
      { heading: "Fuentes oficiales", paragraphs: ["Para información sobre prestaciones, requisitos o incidencias, consulta el Servicio Público de Empleo Estatal. El cálculo de esta página solo es una ayuda orientativa de calendario."] },
    ],
    faqs: [
      { question: "¿El SEPE paga siempre el día 10?", answer: "No se debe interpretar el día nominal de esta tabla como una promesa de abono. La fecha efectiva puede depender del proceso de pago y del banco." },
      { question: "¿Dónde confirmo mi pago?", answer: "Consulta la sede electrónica y los canales oficiales del SEPE, además de la información de tu entidad financiera." },
    ],
    related: [
      { label: "Días de cobro de nómina", href: "/dias-de-cobro-2026" },
      { label: "Fechas de cobro de pensiones", href: "/pago-pensiones-2026" },
      { label: "Fuentes de datos", href: "/fuentes" },
    ],
  },
  "pago-pensiones-2026": {
    title: "Fechas de cobro de pensiones en 2026",
    metaTitle: "Cobro de pensiones 2026: fechas orientativas | NumeroSemanas",
    description: "Fechas orientativas de cobro de pensiones en 2026, mes a mes, ajustadas a fines de semana y festivos nacionales. Confirma la fecha con tu banco.",
    eyebrow: "Pensiones 2026",
    intro: "Revisa las fechas de referencia y su semana ISO. El día efectivo de ingreso depende de la entidad pagadora.",
    sections: [
      { heading: "Fechas de referencia", paragraphs: ["La tabla parte del día 25 de cada mes y desplaza la fecha si cae en fin de semana o festivo nacional. Es un cálculo de calendario, no una confirmación oficial de abono."] },
      { heading: "La fecha puede variar por entidad", paragraphs: ["La Seguridad Social establece el marco de las prestaciones, pero las entidades financieras pueden anticipar el ingreso. Comprueba el calendario publicado por tu banco y la información oficial de la prestación."] },
      { heading: "Consulta fuentes oficiales", paragraphs: ["Para importes, requisitos, incidencias o derechos relacionados con pensiones, consulta los canales de la Seguridad Social. No uses una fecha orientativa para asumir que un pago ya se ha emitido."] },
    ],
    faqs: [
      { question: "¿Todas las pensiones se ingresan el día 25?", answer: "No. Las fechas pueden variar según el ciclo de pago y la entidad financiera. El día 25 de esta tabla es solo una referencia para el cálculo." },
      { question: "¿Qué fuente debo consultar?", answer: "Consulta la Seguridad Social para la prestación y tu entidad financiera para la fecha efectiva del abono." },
    ],
    related: [
      { label: "Días de cobro de nómina", href: "/dias-de-cobro-2026" },
      { label: "Fechas de pago del SEPE", href: "/pagos-sepe-2026" },
      { label: "Fuentes de datos", href: "/fuentes" },
    ],
  },
  "cambio-de-hora-2026": {
    title: "Cambio de hora en España en 2026",
    metaTitle: "Cambio de hora 2026 en España | NumeroSemanas",
    description: "Cambio de hora en España en 2026: horario de verano el 29 de marzo y de invierno el 25 de octubre, con la hora exacta en la península y en Canarias.",
    eyebrow: "Horario oficial",
    intro: "Consulta los dos cambios de hora previstos en el calendario de 2026 y cuánto falta para el siguiente.",
    sections: [
      { heading: "Cuándo empieza el horario de verano", paragraphs: ["El cambio al horario de verano se produce el último domingo de marzo. En la España peninsular y Baleares, a las 02:00 el reloj pasa a las 03:00; en Canarias, a la 01:00 pasa a las 02:00."] },
      { heading: "Cuándo vuelve el horario de invierno", paragraphs: ["El cambio al horario de invierno se produce el último domingo de octubre. En la España peninsular y Baleares, a las 03:00 el reloj vuelve a las 02:00; en Canarias, a las 02:00 vuelve a la 01:00."] },
      { heading: "Comprueba la publicación vigente", paragraphs: ["Las fechas se calculan con la regla europea vigente para 2026. Antes de planificar transportes, turnos o sistemas informáticos, contrasta cualquier cambio normativo con la publicación oficial."] },
    ],
    faqs: [
      { question: "¿Qué ocurre con la hora del reloj en marzo?", answer: "En la España peninsular, a las 02:00 se adelanta a las 03:00. En Canarias, el adelanto se produce a la 01:00 local." },
      { question: "¿Qué ocurre en octubre?", answer: "El reloj se retrasa una hora: a las 03:00 pasa a las 02:00 en la península, y a las 02:00 pasa a la 01:00 en Canarias." },
    ],
    related: [
      { label: "Calendario 2026 con semanas ISO", href: "/calendario/2026" },
      { label: "Amanecer y atardecer", href: "/amanecer-atardecer" },
      { label: "Fuentes de datos", href: "/fuentes" },
    ],
  },
  "fases-luna-2026": {
    title: "Fases de la Luna en 2026",
    metaTitle: "Fases lunares 2026: calendario | NumeroSemanas",
    description: "Calendario de fases lunares de 2026 mes a mes: luna nueva, cuarto creciente, luna llena y cuarto menguante, calculadas con el modelo astronómico de Meeus.",
    eyebrow: "Calendario lunar",
    intro: "Tabla de lunas nuevas, cuartos y lunas llenas, calculada con una aproximación astronómica.",
    sections: [
      { heading: "Cómo se calcula", paragraphs: ["Las fechas se obtienen mediante una serie astronómica de fases lunares basada en el modelo de Meeus y el mes sinódico medio. Son estimaciones calculadas, no efemérides oficiales para una ubicación concreta."] },
      { heading: "La hora depende de la zona", paragraphs: ["La fase ocurre en un instante global, pero su fecha y hora local pueden cambiar según la zona horaria. La tabla presenta la fecha en hora UTC para que el resultado sea reproducible."] },
      { heading: "Observación del cielo", paragraphs: ["La visibilidad también depende de la nubosidad, el horizonte y la contaminación lumínica. Para observaciones precisas, consulta un observatorio o una efeméride astronómica actualizada."] },
    ],
    faqs: [
      { question: "¿Las fechas son observaciones oficiales?", answer: "No. Son resultados calculados mediante una aproximación astronómica y pueden diferir ligeramente de una efeméride especializada." },
      { question: "¿Por qué puede variar el día local?", answer: "La fase sucede en un instante UTC; al convertirlo a una zona horaria local, la fecha del calendario puede cambiar." },
    ],
    related: [
      { label: "Amanecer y atardecer", href: "/amanecer-atardecer" },
      { label: "Calendario 2026 con semanas ISO", href: "/calendario/2026" },
      { label: "Metodología", href: "/metodologia" },
    ],
  },
  "amanecer-atardecer": {
    title: "Hora de amanecer y atardecer en España",
    metaTitle: "Amanecer y atardecer en España por ciudad | NumeroSemanas",
    description: "Hora de amanecer y atardecer hoy en las principales ciudades de España, con una tabla de los próximos 12 meses en la zona horaria de cada ciudad.",
    eyebrow: "Sol y luz del día",
    intro: "Elige una ciudad para consultar la hora solar de hoy y una tabla mensual de amaneceres y atardeceres aproximados.",
    sections: [
      { heading: "Coordenadas de referencia", paragraphs: ["Las horas se calculan con coordenadas de referencia del centro de cada ciudad. El resultado representa una aproximación y puede variar por el relieve y el horizonte local."] },
      { heading: "Zona horaria local", paragraphs: ["Las ciudades peninsulares, Baleares, Ceuta y Melilla usan Europe/Madrid; las ciudades canarias usan Atlantic/Canary. La presentación aplica la zona horaria de la ciudad."] },
      { heading: "Cálculo astronómico", paragraphs: ["El cálculo usa el algoritmo solar NOAA para estimar la salida y puesta del Sol. No sustituye una observación oficial ni tiene en cuenta edificios, montañas u obstáculos cercanos."] },
    ],
    faqs: [
      { question: "¿Las horas son exactas para cualquier punto de la ciudad?", answer: "No. Se calculan con una coordenada de referencia y pueden cambiar según la ubicación y el horizonte." },
      { question: "¿Qué zona horaria se utiliza en Canarias?", answer: "Las ciudades canarias se muestran en la zona Atlantic/Canary, una hora por detrás de la península." },
    ],
    related: [
      { label: "Fases lunares 2026", href: "/fases-luna-2026" },
      { label: "Cambio de hora 2026", href: "/cambio-de-hora-2026" },
      { label: "Metodología", href: "/metodologia" },
    ],
  },
  "widget-numero-semana": {
    title: "Widget de número de semana",
    metaTitle: "Widget para mostrar la semana ISO | NumeroSemanas",
    description: "Widget gratuito para mostrar el número de semana ISO actual en tu web. Elige tamaño, tema e idioma y copia el código iframe para insertarlo.",
    eyebrow: "Integraciones",
    intro: "Configura una tarjeta compacta con la semana ISO actual y copia el código para insertarla en tu web.",
    sections: [
      { heading: "Previsualización", paragraphs: ["El widget muestra el número de semana ISO y el año correspondiente. El diseño mantiene una presentación simple para adaptarse a una barra lateral o página informativa."] },
      { heading: "Personaliza el código", paragraphs: ["Elige un tamaño, tema e idioma para generar un iframe. El contenido se sirve desde una ruta mínima, sin navegación adicional."] },
      { heading: "Uso e integración", paragraphs: ["Antes de publicar una inserción, revisa las políticas de contenido y accesibilidad de tu sitio. El código generado enlaza con NumeroSemanas como fuente del calendario."] },
    ],
    faqs: [
      { question: "¿El widget se actualiza solo?", answer: "Sí. Al cargar la página del iframe, el widget calcula la semana ISO del día mostrado por el servidor." },
      { question: "¿Puedo cambiar su aspecto?", answer: "El generador permite seleccionar tamaño, tema e idioma y actualiza el código para copiar." },
    ],
    related: [
      { label: "Qué es el número de semana", href: "/numeros-de-semana" },
      { label: "Datos abiertos", href: "/datos-abiertos" },
      { label: "Metodología", href: "/metodologia" },
    ],
  },
};

export const footerPageSlugs = Object.keys(footerPages);

export function isFooterPageIndexable(slug: string): boolean {
  return Boolean(footerPages[slug]);
}

export const indexableFooterPageSlugs = footerPageSlugs.filter(isFooterPageIndexable);

/** Consolidated URLs (301); defined in ./redirects so the middleware can import them cheaply. */
export { consolidatedRedirects } from "./redirects";
