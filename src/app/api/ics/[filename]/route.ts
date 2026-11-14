import { nationalHolidaysForYear } from "@/lib/holidays";
import { isoWeeksForYear } from "@/lib/weeks";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ filename: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { filename } = await params;
  const match = /^festivos-(\d{4})\.ics$/.exec(filename);
  if (!match) {
    return new Response("Año no válido", { status: 400 });
  }
  const year = Number(match[1]);
  const Mondays = isoWeeksForYear(year);
  const holidays = nationalHolidaysForYear(year);
  if (Mondays.length === 0 || year < 2020 || year > 2035) {
    return new Response("Año fuera del intervalo disponible", { status: 404 });
  }

  const events = [
    ...Mondays.map((monday, index) => {
      const start = localDateKey(monday);
      const nextMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
      return [
        "BEGIN:VEVENT",
        `UID:semana-${year}-${index + 1}@numerosemanas.es`,
        `DTSTAMP:${utcTimestamp(new Date())}`,
        `DTSTART;VALUE=DATE:${compactDate(start)}`,
        `DTEND;VALUE=DATE:${compactDate(localDateKey(nextMonday))}`,
        `SUMMARY:${escapeIcs(`Semana ISO ${index + 1} de ${year}`)}`,
        "END:VEVENT",
      ].join("\r\n");
    }),
    ...holidays.map(({ date, name }, index) => [
      "BEGIN:VEVENT",
      `UID:festivo-${date}-${index}@numerosemanas.es`,
      `DTSTAMP:${utcTimestamp(new Date())}`,
      `DTSTART;VALUE=DATE:${compactDate(date)}`,
      `DTEND;VALUE=DATE:${compactDate(addOneDay(date))}`,
      `SUMMARY:${escapeIcs(name)}`,
      "END:VEVENT",
    ].join("\r\n")),
  ];
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NumeroSemanas//Calendario ISO ES//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="festivos-${year}.ics"`,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function compactDate(value: string): string {
  return value.replaceAll("-", "");
}

function addOneDay(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return localDateKey(new Date(year, month - 1, day + 1));
}

function utcTimestamp(date: Date): string {
  return date.toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll(/\r?\n/g, "\\n");
}
