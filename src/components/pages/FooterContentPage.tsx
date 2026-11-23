import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import CopyButton from "@/components/CopyButton";
import FaqBlock from "@/components/FaqBlock";
import { ArrowRightIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import RelatedLinks from "@/components/RelatedLinks";
import WidgetGenerator from "@/components/WidgetGenerator";
import { footerPages } from "@/lib/footer-pages";
import { parseInlineLinks } from "@/lib/inline-links";
import { getMadridToday } from "./WeeksYearContent";
import {
  calendarDayDifference,
  dateToIso,
  formatLong,
  isEven,
  isoWeek,
  weeksInYear,
} from "@/lib/weeks";
import { paymentDatesForYear } from "@/lib/payments";
import { moonPhasesForYear } from "@/lib/moon";
import { formatSunTime, nearbySunCities, sunCities, sunTimesForDate } from "@/lib/sun";

type FooterContentPageProps = {
  slug: string;
  widgetOptions?: { size: string; theme: string; language: string };
};

function LiveInfo({ slug, today }: { slug: string; today: Date }) {
  const iso = isoWeek(today);
  const weekCount = weeksInYear(iso.year);
  let title = "Semana actual";
  let value = `Semana ${iso.week} de ${iso.year}`;
  let caption = "ISO 8601 · de lunes a domingo";

  if (slug === "cuantas-semanas-tiene-un-anio") {
    title = `Año ${iso.year}`;
    value = `${weekCount} semanas ISO`;
    caption = "El año ISO puede tener 52 o 53 semanas";
  } else if (slug === "semanas-pares-e-impares") {
    title = `Semana ${iso.week}`;
    value = isEven(iso.week) ? "Semana par" : "Semana impar";
    caption = "La próxima semana también se calcula con ISO 8601";
  }

  return (
    <div className="rounded-2xl bg-[#1E2B20] px-5 py-4 text-white">
      <p className="m-0 text-sm font-semibold text-mint">{title}</p>
      <p className="mb-0 mt-1 font-heading text-2xl font-bold">{value}</p>
      <p className="mb-0 mt-1 text-sm text-cream">{caption}</p>
    </div>
  );
}

function PageExtras({
  slug,
  widgetOptions,
}: {
  slug: string;
  widgetOptions?: { size: string; theme: string; language: string };
}) {
  const [pageSlug, citySlug] = slug.split("/");

  if (slug === "contacto") {
    return (
      <section aria-labelledby="contact-form-heading" className="flex flex-col gap-4">
        <h2 id="contact-form-heading" className="m-0 font-heading text-2xl font-bold">
          Envíanos un mensaje
        </h2>
        <ContactForm />
      </section>
    );
  }

  if (slug === "calendario-imprimible") {
    const templates = [
      { title: "Calendario anual 2027", text: "Vista anual con semanas ISO y fechas para anotar hitos.", href: "/api/pdf/plantilla/anual?year=2027" },
      { title: "Calendario mensual", text: "Planifica el mes de enero con una fila para cada semana.", href: "/api/pdf/plantilla/mensual?year=2027&month=1" },
      { title: "Planificador semanal", text: "Organiza una semana de lunes a domingo con espacio para tareas.", href: "/api/pdf/plantilla/semanal" },
      { title: "Planificador de curso escolar", text: "Organiza semanas del curso; las fechas lectivas dependen de cada comunidad.", href: "/api/pdf/plantilla/curso-escolar?year=2026" },
    ];
    return (
      <section aria-labelledby="templates-heading" className="flex flex-col gap-4">
        <h2 id="templates-heading" className="m-0 font-heading text-2xl font-bold">
          Elige una plantilla
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((template) => (
            <article key={template.title} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex min-h-32 items-center justify-center rounded-xl bg-panel text-center font-heading text-xl font-bold text-olive">
                {template.title}
              </div>
              <p className="m-0 text-sm leading-relaxed text-muted">{template.text}</p>
              <form action={template.href} className="mt-3">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center border-0 bg-transparent p-0 font-semibold text-olive-dark underline underline-offset-4"
                >
                  <span>Descargar PDF</span>
                  <ArrowRightIcon className="ml-1 size-4" />
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (slug === "datos-abiertos") {
    const sample = `fetch("/api/v1/semana?fecha=2026-11-11")\n  .then((respuesta) => respuesta.json())\n  .then(console.log);`;
    return (
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 font-heading text-xl font-bold">Ejemplo con JavaScript</h2>
          <CopyButton text={sample} label="Copiar ejemplo" />
        </div>
        <pre className="overflow-x-auto rounded-xl bg-panel p-4 text-sm">
          <code>{sample}</code>
        </pre>
        <p className="mb-0 text-sm text-muted">
          Festivos: <code>/api/v1/festivos?year=2026</code>
        </p>
      </section>
    );
  }

  if (slug === "app-android" || slug === "extension-chrome") {
    const android = slug === "app-android";
    const storeUrl = android
      ? process.env.NEXT_PUBLIC_ANDROID_URL
      : process.env.NEXT_PUBLIC_CHROME_URL;
    return (
      <section aria-labelledby="product-heading" className="flex flex-col gap-4">
        <h2 id="product-heading" className="m-0 font-heading text-2xl font-bold">
          Una consulta clara, estés donde estés
        </h2>
        <div
          role="img"
          aria-label={`Vista previa de ${android ? "la aplicación Android" : "la extensión de Chrome"}`}
          className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-tan bg-panel p-6 text-center font-heading text-xl font-semibold text-olive"
        >
          Vista previa de NumeroSemanas
        </div>
        {storeUrl ? (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-fit items-center rounded-full bg-[#1E2B20] px-5 font-semibold text-white hover:bg-[#2A3C2D]"
          >
            {android ? "Abrir Google Play" : "Abrir Chrome Web Store"}
          </a>
        ) : (
          <p className="m-0 text-sm text-muted">
            El enlace oficial de descarga se publicará cuando la ficha esté disponible.
          </p>
        )}
      </section>
    );
  }

  if (slug === "numeros-de-semana" || slug === "cuantas-semanas-tiene-un-anio" || slug === "semanas-pares-e-impares") {
    return null;
  }

  if (
    pageSlug === "dias-de-cobro-2026" ||
    pageSlug === "pagos-sepe-2026" ||
    pageSlug === "pago-pensiones-2026"
  ) {
    const nominalDay = pageSlug === "pagos-sepe-2026" ? 10 : 25;
    const dates = paymentDatesForYear(2026, nominalDay);
    const today = getMadridToday();
    const nextPayment = dates.find(({ paymentDate }) => paymentDate >= today);
    const nextDate = nextPayment?.paymentDate ?? paymentDatesForYear(2027, nominalDay)[0].paymentDate;
    const daysUntil = Math.max(0, calendarDayDifference(today, nextDate));
    const monthNames = new Intl.DateTimeFormat("es-ES", { month: "long" });
    const title =
      pageSlug === "dias-de-cobro-2026"
        ? "Nómina"
        : pageSlug === "pagos-sepe-2026"
          ? "Prestación"
          : "Pensión";
    const source =
      pageSlug === "pagos-sepe-2026"
        ? { label: "Consultar información oficial del SEPE", href: "https://www.sepe.es/" }
        : pageSlug === "pago-pensiones-2026"
          ? { label: "Consultar información oficial de la Seguridad Social", href: "https://www.seg-social.es/" }
          : { label: "Consultar el calendario laboral publicado en el BOE", href: "https://www.boe.es/" };
    return (
      <>
        <section className="rounded-2xl bg-[#1E2B20] p-5 text-white">
          <p className="m-0 text-sm text-mint">Próxima fecha de referencia</p>
          <p className="mb-0 mt-1 font-heading text-2xl font-bold">
            {formatLong(nextDate)}
          </p>
          <p className="mb-0 mt-1">Próximo pago de referencia en {daysUntil} días</p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="m-0 font-heading text-2xl font-bold">Calendario mensual de {title.toLowerCase()}</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-panel">
                <tr>
                  {["Mes", "Fecha nominal", "Fecha de referencia", "Semana ISO"].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-3">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dates.map(({ month, nominalDate, paymentDate }) => (
                  <tr key={month} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 capitalize">
                      {monthNames.format(new Date(2026, month - 1, 1))}
                    </th>
                    <td className="px-4 py-3">{formatLong(nominalDate)}</td>
                    <td className="px-4 py-3">{formatLong(paymentDate)}</td>
                    <td className="px-4 py-3">{isoWeek(paymentDate).week}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="m-0 text-sm leading-relaxed text-muted">
            Fechas orientativas calculadas con festivos nacionales y fines de semana. Comprueba el calendario oficial, los festivos autonómicos y la fecha comunicada por tu empresa, el SEPE o tu entidad pagadora.
          </p>
          <a href={source.href} target="_blank" rel="noopener noreferrer" className="min-h-11 self-start font-semibold">
            <span>{source.label}</span>
            <ArrowRightIcon className="ml-1 size-4" />
          </a>
        </section>
      </>
    );
  }

  if (pageSlug === "cambio-de-hora-2026") {
    const today = getMadridToday();
    const changes = [
      { date: lastSunday(2026, 2), name: "Horario de verano", before: "02:00", after: "03:00" },
      { date: lastSunday(2026, 9), name: "Horario de invierno", before: "03:00", after: "02:00" },
    ];
    const nextChange =
      changes.find(({ date }) => date >= today) ??
      { ...changes[0], date: lastSunday(2027, 2) };
    const countdown = Math.max(0, calendarDayDifference(today, nextChange.date));
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-2xl bg-[#1E2B20] p-5 text-white">
          <p className="m-0 text-sm text-mint">Próximo cambio: {nextChange.name}</p>
          <p className="mb-0 mt-1 font-heading text-2xl font-bold">{formatLong(nextChange.date)}</p>
          <p className="mb-0 mt-1">Faltan {countdown} días · de {nextChange.before} a {nextChange.after} (hora peninsular)</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {changes.map((change) => (
            <article key={change.name} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="m-0 font-heading text-xl font-bold">{change.name}</h2>
              <p className="mb-0 mt-2">{formatLong(change.date)} · de {change.before} a {change.after}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (pageSlug === "fases-luna-2026") {
    const phases = moonPhasesForYear(2026);
    const phasesByMonth = Array.from({ length: 12 }, (_, month) => ({
      month,
      phases: phases.filter((phase) => phase.date.getUTCMonth() === month),
    }));
    return (
      <section className="flex flex-col gap-4">
        <h2 className="m-0 font-heading text-2xl font-bold">Calendario mensual de fases</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="bg-panel">
              <tr>
                <th scope="col" className="px-4 py-3">Mes</th>
                <th scope="col" className="px-4 py-3">Fases y fechas (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {phasesByMonth.map(({ month, phases: monthPhases }) => (
                <tr key={month} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-3 capitalize">
                    {new Intl.DateTimeFormat("es-ES", { month: "long" }).format(new Date(2026, month, 1))}
                  </th>
                  <td className="px-4 py-3">
                    <ul className="m-0 list-none space-y-1 p-0">
                      {monthPhases.map((phase) => (
                        <li key={`${phase.phase}-${phase.date.toISOString()}`}>
                          {phase.phase}: {new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", timeZone: "UTC" }).format(phase.date)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 text-sm text-muted">Las fechas se muestran en UTC; la fecha local puede variar según la zona horaria.</p>
      </section>
    );
  }

  if (pageSlug === "amanecer-atardecer") {
    const today = getMadridToday();
    if (!citySlug) {
      return (
        <section className="flex flex-col gap-4">
          <h2 className="m-0 font-heading text-2xl font-bold">Selecciona tu ciudad</h2>
          <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {sunCities.map((city) => (
              <li key={city.slug}>
                <Link className="flex min-h-11 items-center rounded-xl border border-border bg-card px-4 font-semibold" href={`/amanecer-atardecer/${city.slug}`}>
                  <span>{city.name}</span>
                  <ArrowRightIcon className="ml-auto size-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      );
    }

    const city = sunCities.find((item) => item.slug === citySlug);
    if (!city) return <p>La ciudad solicitada no está disponible.</p>;
    const currentSun = sunTimesForDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), city);
    const months = Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + index, 15);
      return {
        date: monthDate,
        times: sunTimesForDate(monthDate.getFullYear(), monthDate.getMonth() + 1, monthDate.getDate(), city),
      };
    });
    const timeFormatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: city.timeZone,
      day: "numeric",
      month: "long",
    });
    return (
      <>
        <section className="rounded-2xl bg-[#1E2B20] p-5 text-white">
          <p className="m-0 text-sm text-mint">{city.name} · hoy, {formatLong(today)}</p>
          {currentSun ? (
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <p className="m-0"><span className="block text-sm text-cream">Amanecer</span><strong className="text-2xl">{formatSunTime(currentSun.sunrise, city.timeZone)}</strong></p>
              <p className="m-0"><span className="block text-sm text-cream">Atardecer</span><strong className="text-2xl">{formatSunTime(currentSun.sunset, city.timeZone)}</strong></p>
            </div>
          ) : <p className="mb-0 mt-2">No hay salida o puesta de sol calculable para esta fecha y ubicación.</p>}
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="m-0 font-heading text-2xl font-bold">Próximos 12 meses en {city.name}</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="bg-panel">
                <tr>
                  {["Fecha de referencia", "Amanecer", "Atardecer"].map((heading) => <th key={heading} scope="col" className="px-4 py-3">{heading}</th>)}
                </tr>
              </thead>
              <tbody>
                {months.map(({ date, times }) => (
                  <tr key={dateToIso(date)} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 capitalize">{timeFormatter.format(date)}</th>
                    <td className="px-4 py-3">{times ? formatSunTime(times.sunrise, city.timeZone) : "—"}</td>
                    <td className="px-4 py-3">{times ? formatSunTime(times.sunset, city.timeZone) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-heading text-2xl font-bold">Ciudades cercanas a {city.name}</h2>
          <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {nearbySunCities(city).map((other) => (
              <li key={other.slug}>
                <Link className="flex min-h-11 items-center rounded-xl border border-border bg-card px-4 font-semibold" href={`/amanecer-atardecer/${other.slug}`}>
                  Amanecer y atardecer en {other.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/amanecer-atardecer" className="inline-flex items-center font-semibold">
            <span>Ver las {sunCities.length} ciudades</span>
            <ArrowRightIcon className="ml-1 size-4" />
          </Link>
        </section>
      </>
    );
  }

  if (slug === "widget-numero-semana") {
    return <WidgetGenerator />;
  }
  if (slug === "widget") {
    return <WeekWidget options={widgetOptions} />;
  }

  if (slug === "suscripcion-calendario") {
    return (
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="m-0 font-heading text-2xl font-bold">Descargar calendario iCalendar</h2>
        <p className="leading-relaxed text-muted">Descarga las semanas ISO y festivos nacionales de 2026 como un archivo .ics.</p>
        <a
          href="/api/ics/festivos-2026.ics"
          className="inline-flex min-h-11 items-center rounded-full bg-[#1E2B20] px-5 font-semibold text-white hover:bg-[#2A3C2D]"
        >
          Descargar calendario 2026
        </a>
      </section>
    );
  }

  if (slug === "fuentes") {
    const sources = [
      { label: "Boletín Oficial del Estado (BOE)", href: "https://www.boe.es/" },
      { label: "Servicio Público de Empleo Estatal (SEPE)", href: "https://www.sepe.es/" },
      { label: "Seguridad Social", href: "https://www.seg-social.es/" },
      { label: "Instituto Geográfico Nacional (IGN)", href: "https://www.ign.es/" },
    ];
    return (
      <section className="flex flex-col gap-3">
        <h2 className="m-0 font-heading text-2xl font-bold">Fuentes oficiales</h2>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          {sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return null;
}

export default function FooterContentPage({
  slug,
  widgetOptions,
}: FooterContentPageProps) {
  const pageSlug = slug.split("/")[0];
  const citySlug = slug.split("/")[1];
  if (slug === "widget") return <WeekWidget options={widgetOptions} />;
  const page = footerPages[pageSlug];
  if (!page) return null;
  if (citySlug && (pageSlug !== "amanecer-atardecer" || !sunCities.some((item) => item.slug === citySlug))) {
    return null;
  }
  const city = pageSlug === "amanecer-atardecer"
    ? sunCities.find((item) => item.slug === citySlug)
    : undefined;
  const title = city ? `Amanecer y atardecer en ${city.name}` : page.title;
  const today = getMadridToday();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          ...(city ? [{ label: page.title, href: "/amanecer-atardecer" }] : []),
          { label: title },
        ]}
      />
      <div className="mx-auto max-w-[1200px] px-4 pt-5 sm:px-5">
        <PageHero
          eyebrow={page.eyebrow}
          title={title}
          intro={city ? `Hora aproximada de salida y puesta del Sol para ${city.name}, calculada con coordenadas de referencia y su zona horaria local.` : page.intro}
          widget={
            ["numeros-de-semana", "cuantas-semanas-tiene-un-anio", "semanas-pares-e-impares"].includes(pageSlug) ? (
              <LiveInfo slug={pageSlug} today={today} />
            ) : undefined
          }
        />
      </div>
      <div className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-5">
        <AdSlot id={`ad-${pageSlug}`} size="leaderboard" />
      </div>
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-5">
        {page.legal && (
          <aside className="rounded-xl border border-tan bg-panel p-4 text-sm font-semibold">
            Última actualización: 12 de noviembre de 2026.
          </aside>
        )}
        {page.sections.map((section, index) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="m-0 font-heading text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="m-0 max-w-4xl leading-relaxed text-muted">
                <InlineText text={paragraph} />
              </p>
            ))}
            {section.bullets && (
              <ul className="m-0 flex list-disc flex-col gap-2 pl-6 text-muted">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
            {index === 0 && <AdSlot id={`ad-inline-${pageSlug}`} size="responsive" />}
          </section>
        ))}
        <PageExtras slug={slug} widgetOptions={widgetOptions} />
        <RelatedLinks links={page.related} />
        <FaqBlock faqs={page.faqs} />
      </main>
    </>
  );
}

/** Paragraph copy with `[anchor](/path)` contextual links rendered as <Link>. */
function InlineText({ text }: { text: string }) {
  return parseInlineLinks(text).map((segment, index) =>
    segment.href ? (
      <Link key={index} href={segment.href} className="font-medium">
        {segment.text}
      </Link>
    ) : (
      segment.text
    ),
  );
}

function lastSunday(year: number, month: number): Date {
  const date = new Date(year, month + 1, 0);
  date.setDate(date.getDate() - date.getDay());
  return date;
}

export function WeekWidget({
  options,
}: {
  options?: { size: string; theme: string; language: string };
}) {
  const today = getMadridToday();
  const week = isoWeek(today);
  const isEnglish = options?.language === "en";
  const isLight = options?.theme === "light";
  const compact = options?.size === "small";
  return (
    <main className={`flex min-h-screen items-center justify-center p-4 ${isLight ? "bg-white" : "bg-page"}`}>
      <article className={`w-full rounded-3xl border border-border text-center ${compact ? "max-w-xs p-4" : "max-w-sm p-6"} ${isLight ? "bg-white" : "bg-card"}`}>
        <p className="m-0 text-sm font-semibold text-olive">{isEnglish ? "ISO week number" : "Número de semana ISO"}</p>
        <h1 className={`mb-0 mt-2 font-heading font-bold text-ink ${compact ? "text-3xl" : "text-4xl"}`}>
          {isEnglish ? "Week" : "Semana"} {week.week}
        </h1>
        <p className="mb-0 mt-1 text-muted">
          {week.year} · {isEnglish ? "Monday to Sunday" : "lunes a domingo"}
        </p>
        <a href="https://numerosemanas.es" className="mt-4 inline-flex text-sm font-semibold text-olive-dark">
          NumeroSemanas
        </a>
      </article>
    </main>
  );
}
