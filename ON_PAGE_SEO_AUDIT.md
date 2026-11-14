# On-page SEO audit — NumeroSemanas

**Audit date:** 14 November 2026  
**Environment:** Local optimized production build with launch-mode metadata  
**Configured canonical origin:** `https://numerosemanas.es`  
**Scope:** 74 indexable sitemap URLs, 24 intentional noindex pages, and all pages/links reachable in the 101-URL site crawl

## Executive result

The indexable site already has strong on-page fundamentals. Every indexable URL has a unique, intent-aligned title and meta description, exactly one relevant H1, a valid heading hierarchy, contextual internal links, and accurate image alt text. One verified issue was found and fixed: the sitewide X profile link returned HTTP 404. It was removed from the footer. No metadata or heading copy was changed merely for variation; the existing values are relevant, distinct, and avoid keyword stuffing.

## Implemented finding

| Area | Affected URLs | Original value | Recommended change | Implementation status | Verification |
|---|---|---|---|---|---|
| External links | All 101 rendered pages using the sitewide footer | `https://x.com/numerosemanas` — HTTP 404 | Remove the dead X profile until a valid official profile is available | **Completed** in `src/components/Footer.tsx` | Fresh build and crawl passed; the dead URL is absent from rendered HTML |

The remaining rendered external destinations were checked directly and returned HTTP 200: Facebook, Pinterest, Bluesky, BOE, SEPE, Seguridad Social, and IGN.

## Unique important pages: original and recommended values

For every row below, the recommended value is **retain original**. Each title is no longer than 60 characters and each description is 140–160 characters in the rendered build.

| URL | Original SEO title | Original meta description | Original H1 | Recommendation / status |
|---|---|---|---|---|
| `/` | ¿Qué semana es hoy? Semana 46 de 2026 \| NumeroSemanas | Hoy es la semana 46 de 2026, del 9 al 15 de noviembre. Revisa sus fechas, el calendario ISO, los festivos nacionales y si la semana es par o impar. | La semana actual es la Semana 46 | Retain; dynamic current-week intent verified |
| `/semanas-2026` | Semanas de 2026: lista de fechas ISO \| NumeroSemanas | Lista de las 53 semanas ISO de 2026 con sus fechas de lunes a domingo, la paridad de cada semana y los festivos nacionales de España. Copia la lista completa. | Semanas de 2026: calendario y fechas | Retain; year/list intent verified |
| `/lista-semanas-2027` | Lista de semanas 2027 para imprimir \| NumeroSemanas | Consulta e imprime las 52 semanas ISO de 2027 con su fecha de inicio (lunes) y de fin (domingo). Lista preparada para A4 y descargable en PDF. | Lista de semanas 2027 | Retain; print intent verified |
| `/calendario-2027` | Calendario 2027 con semanas ISO \| NumeroSemanas | Calendario de 2027 con los 12 meses, los números de semana ISO y los festivos nacionales de España, con opción de ver festivos autonómicos e imprimirlo. | Calendario 2027 con semanas ISO | Retain; calendar intent verified |
| `/calendario-imprimible` | Calendario imprimible y plantillas PDF \| NumeroSemanas | Descarga gratis plantillas PDF para imprimir: calendario anual 2027 con semanas ISO, calendario mensual, planificador semanal y planificador de curso escolar. | Calendario imprimible y plantillas | Retain; download intent verified |
| `/cuantas-semanas-tiene-un-anio` | Cuántas semanas tiene un año: 52 o 53 \| NumeroSemanas | Un año ISO tiene 52 o 53 semanas. Descubre cuándo aparece la semana 53, cómo se comprueba con el 28 de diciembre y cuántas semanas tiene este año. | ¿Cuántas semanas tiene un año? | Retain; informational intent verified |
| `/numeros-de-semana` | Número de semana: qué es y cómo se calcula \| NumeroSemanas | Qué es el número de semana ISO 8601, por qué la semana empieza en lunes, cómo se determina la semana 1, qué pasa en el cambio de año y qué semana es hoy. | Qué es el número de semana ISO | Retain; definition intent verified |
| `/semanas-pares-e-impares` | Semana par o impar: ¿esta semana es par? \| NumeroSemanas | Comprueba si esta semana es par o impar según la numeración ISO 8601, cómo usar la paridad para organizar turnos alternos y qué ocurre tras una semana 53. | Semana actual: par o impar | Retain; query wording verified |
| `/datos-abiertos` | API de semanas ISO y festivos \| NumeroSemanas | API JSON pública y sin clave para consultar la semana ISO de cualquier fecha y los festivos nacionales de España, con un ejemplo de uso en JavaScript. | Datos abiertos de semanas y festivos | Retain; developer intent verified |
| `/gestion-del-tiempo` | Gestión del tiempo con semanas ISO \| NumeroSemanas | Ideas prácticas para planificar proyectos y plazos por semanas ISO: entregas semanales, días laborables, festivos y revisiones periódicas en equipo. | Gestión del tiempo con semanas ISO | Retain |
| `/suscripcion-calendario` | Calendario iCal con semanas y festivos \| NumeroSemanas | Descarga un archivo iCal (.ics) con las semanas ISO y los festivos nacionales de 2026 e impórtalo en Google Calendar, Apple Calendar u Outlook. | Añade semanas y festivos a tu calendario | Retain; download/import intent verified |
| `/metodologia` | Metodología: cómo calculamos las semanas ISO \| NumeroSemanas | Cómo calculamos las semanas ISO 8601, las diferencias entre fechas, los festivos y los horarios solares, y qué datos conviene contrastar con fuentes oficiales. | Metodología de cálculo | Retain |
| `/fuentes` | Fuentes oficiales de datos y referencias \| NumeroSemanas | Fuentes oficiales para calendarios, festivos, prestaciones y astronomía en España (BOE, SEPE, Seguridad Social, IGN) y qué datos calculamos nosotros. | Fuentes de datos y referencias | Retain; authoritative-source links verified |
| `/sobre-nosotros` | Sobre NumeroSemanas \| Información del proyecto | NumeroSemanas es una herramienta web gratuita para consultar semanas ISO y organizar fechas en España. Conoce su propósito, su alcance y cómo contactar. | Sobre NumeroSemanas | Retain |
| `/principios-editoriales` | Principios editoriales y correcciones \| NumeroSemanas | Cómo separamos los cálculos de la información oficial, cómo verificamos los datos de calendario y cómo corregimos los errores en NumeroSemanas. | Principios editoriales | Retain |
| `/contacto` | Contacto: consultas y avisos de errores \| NumeroSemanas | Envía una consulta o comunica un error de calendario mediante el formulario de contacto de NumeroSemanas. Indica la página, la fecha y la fuente. | Contacta con NumeroSemanas | Retain |
| `/aviso-legal` | Aviso legal de NumeroSemanas | Aviso legal de NumeroSemanas: identificación del sitio, objeto y condiciones de uso, propiedad intelectual y responsabilidad sobre los contenidos. | Aviso legal | Retain |
| `/terminos-de-uso` | Términos de uso \| NumeroSemanas | Condiciones de acceso y uso del servicio gratuito de NumeroSemanas: uso de calendarios y herramientas, disponibilidad y cambios del servicio. | Términos de uso | Retain |
| `/politica-de-privacidad` | Política de privacidad \| NumeroSemanas | Qué datos trata NumeroSemanas, con qué finalidad y base jurídica, cuánto tiempo se conservan y cómo ejercer tus derechos de protección de datos. | Política de privacidad | Retain |
| `/devoluciones` | Devoluciones y cancelaciones \| NumeroSemanas | NumeroSemanas no ofrece productos ni servicios de pago. Consulta qué condiciones de devolución y cancelación se publicarían si eso cambiara. | Política de devoluciones y cancelaciones | Retain; contextual link from `/terminos-de-uso` verified |
| `/politica-de-cookies` | Política de cookies \| NumeroSemanas | Cómo gestiona NumeroSemanas las cookies y el consentimiento de analítica, qué servicios solo se cargan si los aceptas y cómo cambiar tu elección. | Política de cookies | Retain |
| `/dias-de-cobro-2026` | Días de cobro de nómina 2026 mes a mes \| NumeroSemanas | Fechas de referencia para cobrar la nómina en 2026, mes a mes, ajustadas a fines de semana y festivos nacionales, con su número de semana ISO. | Días de cobro de nómina en 2026 | Retain; wording correctly signals estimates |
| `/pagos-sepe-2026` | Pagos del SEPE 2026: fechas orientativas \| NumeroSemanas | Calendario orientativo de pagos del SEPE en 2026: fecha de referencia de cada mes ajustada a fines de semana y festivos nacionales, con su semana ISO. | Fechas de pago del SEPE en 2026 | Retain; official SEPE link verified |
| `/pago-pensiones-2026` | Cobro de pensiones 2026: fechas orientativas \| NumeroSemanas | Fechas orientativas de cobro de pensiones en 2026, mes a mes, ajustadas a fines de semana y festivos nacionales. Confirma la fecha con tu banco. | Fechas de cobro de pensiones en 2026 | Retain; official Seguridad Social link verified |
| `/cambio-de-hora-2026` | Cambio de hora 2026 en España \| NumeroSemanas | Cambio de hora en España en 2026: horario de verano el 29 de marzo y de invierno el 25 de octubre, con la hora exacta en la península y en Canarias. | Cambio de hora en España en 2026 | Retain |
| `/fases-luna-2026` | Fases lunares 2026: calendario \| NumeroSemanas | Calendario de fases lunares de 2026 mes a mes: luna nueva, cuarto creciente, luna llena y cuarto menguante, calculadas con el modelo astronómico de Meeus. | Fases de la Luna en 2026 | Retain |
| `/amanecer-atardecer` | Amanecer y atardecer en España por ciudad \| NumeroSemanas | Hora de amanecer y atardecer hoy en las principales ciudades de España, con una tabla de los próximos 12 meses en la zona horaria de cada ciudad. | Hora de amanecer y atardecer en España | Retain; hub intent verified |
| `/widget-numero-semana` | Widget para mostrar la semana ISO \| NumeroSemanas | Widget gratuito para mostrar el número de semana ISO actual en tu web. Elige tamaño, tema e idioma y copia el código iframe para insertarlo. | Widget de número de semana | Retain; embed intent verified |

## Template-driven URLs: original and recommended values

The following pages use controlled metadata templates. The year/city makes every rendered value distinct, so this is useful templating rather than duplicate metadata.

| Exact URLs | Original title pattern | Original description pattern | Original H1 pattern | Recommendation / status |
|---|---|---|---|---|
| `/semanas/2020`, `/semanas/2021`, `/semanas/2022`, `/semanas/2023`, `/semanas/2024`, `/semanas/2025`, `/semanas/2027`, `/semanas/2028`, `/semanas/2029`, `/semanas/2030`, `/semanas/2031`, `/semanas/2032`, `/semanas/2033`, `/semanas/2034`, `/semanas/2035` | `Semanas de {year}: lista de fechas ISO \| NumeroSemanas` | `Lista de las {52/53} semanas ISO de {year} con sus fechas de lunes a domingo, la paridad de cada semana y los festivos nacionales de España. Copia la lista completa.` | `Semanas de {year}: calendario y fechas` | Retain; all 15 rendered values verified |
| `/calendario/2020`, `/calendario/2021`, `/calendario/2022`, `/calendario/2023`, `/calendario/2024`, `/calendario/2025`, `/calendario/2026`, `/calendario/2028`, `/calendario/2029`, `/calendario/2030`, `/calendario/2031`, `/calendario/2032`, `/calendario/2033`, `/calendario/2034`, `/calendario/2035` | `Calendario {year} con semanas ISO \| NumeroSemanas` | `Calendario de {year} con los 12 meses, los números de semana ISO y los festivos nacionales de España, con opción de ver festivos autonómicos e imprimirlo.` | `Calendario {year} con semanas ISO` | Retain; all 15 rendered values verified |
| `/amanecer-atardecer/a-coruna`, `/amanecer-atardecer/alicante`, `/amanecer-atardecer/barcelona`, `/amanecer-atardecer/bilbao`, `/amanecer-atardecer/cordoba`, `/amanecer-atardecer/las-palmas`, `/amanecer-atardecer/madrid`, `/amanecer-atardecer/malaga`, `/amanecer-atardecer/murcia`, `/amanecer-atardecer/palma`, `/amanecer-atardecer/santa-cruz-de-tenerife`, `/amanecer-atardecer/sevilla`, `/amanecer-atardecer/valencia`, `/amanecer-atardecer/valladolid`, `/amanecer-atardecer/vigo`, `/amanecer-atardecer/zaragoza` | City-specific `Amanecer y atardecer en {city} ...` title | City-specific sunrise/sunset description with local intent | City-specific sunrise/sunset H1 | Retain; all 16 city URLs verified |

## H1 and heading hierarchy audit

- All 74 indexable pages have exactly one H1.
- The H1 is the first heading in document order on every indexable page.
- No empty or duplicate same-level headings were found.
- No heading-level jumps were found.
- Calendar pages correctly use H2 for the annual section and H3 for individual months.
- Sitewide footer headings follow the page H1/H2 structure and do not create hierarchy errors.

No H1–H6 changes were required.

## Internal and external link audit

- 99 unique internal destinations return HTTP 200 directly.
- No internal link points through a redirect.
- No broken links, redirect chains, redirect loops, empty link labels, or generic anchors were found.
- Every sitemap page has at least one inbound HTML link; none is orphaned.
- `/devoluciones` has a relevant contextual link from `/terminos-de-uso` in addition to sitewide navigation.
- The dead sitewide X link was removed.
- Remaining external sources and social profiles resolved successfully during the audit.

## Image alt-text audit

The rendered site uses one meaningful raster image source: the NumeroSemanas logo, rendered in the header and footer. Its original alt text is `NumeroSemanas`.

| Image | Original alt | Recommended alt | Status |
|---|---|---|---|
| NumeroSemanas logo | `NumeroSemanas` | `NumeroSemanas` | Retained; concise and accurate brand identification |

The repeated alt text is appropriate because both instances are the same logo, not unrelated images. Decorative SVG icons are correctly hidden with `aria-hidden="true"`, while icon-only social links have descriptive accessible labels. No missing, generic, keyword-stuffed, or inaccurate alt text was found.

## Intentional noindex pages reviewed

The following development placeholders/tools were reviewed but are intentionally excluded from the index until their promised functionality or substantive content exists: `/app-android`, `/calculadora-dias`, `/calculadora-edad`, `/calculadora-semanas`, `/calculadora-vacaciones`, `/calculadoras`, `/calendario-laboral`, `/calendario-mensual`, `/cambio-hora-2027`, `/dias-hasta-navidad`, `/dias-laborables`, `/dias-laborables-2027`, `/duracion-del-dia`, `/extension-chrome`, `/festivos-2026`, `/festivos-2027`, `/festivos-por-comunidad`, `/preguntas-frecuentes`, `/puentes-2026`, `/puentes-2027`, `/santoral`, `/solsticio-invierno`, `/vacaciones-escolares`, and `/widget`.

Their short metadata is not treated as an indexable-page defect. They should receive a fresh intent/content review before removing `noindex`.

## Before-and-after verification

| Check | Before | After |
|---|---|---|
| Sitewide X link | Rendered on every page; destination returned HTTP 404 | Removed from the footer and absent from rendered pages |
| Indexable metadata | 74/74 unique titles and descriptions within target lengths | 74/74 still pass |
| H1 and hierarchy | 74/74 with one H1 and valid hierarchy | 74/74 still pass |
| Internal destinations | 99 unique targets returned 200 directly | 99/99 still pass |
| Image alt text | All rendered images had accurate alt text | All still pass |
| Build/tests | Baseline passed | Optimized build, ESLint, and 28 unit tests passed |

## Items that require a deployed site

The local audit cannot verify Google title/description rewrites, live SERP click-through rate, production analytics, or whether social profiles are later renamed. Re-run the external-link and rendered-metadata audit after deployment and monitor Google Search Console performance before changing already relevant metadata.
