import {
  nationalHolidaysForYear,
  holidaysForYearAndTerritory,
  hasVerifiedData,
  getCanaryIslandHolidays,
  TERRITORIES,
  CANARY_ISLANDS,
  type TerritorySlug,
  type CanaryIslandSlug,
  type Holiday,
} from "@/lib/holidays";
import { isoWeeksForYear, isoWeek } from "@/lib/weeks";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ filename: string }> };

/**
 * iCal route supporting:
 * - festivos-2027.ics (national holidays only - backward compatible)
 * - festivos-2027-comunidad-de-madrid.ics (regional holidays)
 * - festivos-2027-canarias-tenerife.ics (Canary Islands with island holiday)
 */
export async function GET(request: Request, { params }: RouteContext) {
  const { filename } = await params;

  // Parse filename: festivos-YYYY[-territorio[-isla]].ics
  const nationalMatch = /^festivos-(\d{4})\.ics$/.exec(filename);
  const regionalMatch = /^festivos-(\d{4})-([a-z-]+)\.ics$/.exec(filename);
  const islandMatch = /^festivos-(\d{4})-canarias-([a-z-]+)\.ics$/.exec(filename);

  let year: number;
  let territory: TerritorySlug | undefined;
  let island: CanaryIslandSlug | undefined;

  if (islandMatch) {
    year = Number(islandMatch[1]);
    territory = "canarias";
    const islandSlug = islandMatch[2];
    const validIsland = CANARY_ISLANDS.find(i => i.slug === islandSlug);
    if (!validIsland) {
      return new Response("Isla no válida", { status: 400 });
    }
    island = islandSlug as CanaryIslandSlug;
  } else if (regionalMatch) {
    year = Number(regionalMatch[1]);
    const territorySlug = regionalMatch[2];
    const validTerritory = TERRITORIES.find(t => t.slug === territorySlug);
    if (!validTerritory) {
      return new Response("Comunidad autónoma no válida", { status: 400 });
    }
    territory = territorySlug as TerritorySlug;
  } else if (nationalMatch) {
    year = Number(nationalMatch[1]);
  } else {
    return new Response("Formato de archivo no válido. Use: festivos-YYYY.ics, festivos-YYYY-territorio.ics o festivos-YYYY-canarias-isla.ics", { status: 400 });
  }

  const Mondays = isoWeeksForYear(year);
  const isVerified = hasVerifiedData(year);

  if (Mondays.length === 0 || year < 2020 || year > 2035) {
    return new Response("Año fuera del intervalo disponible", { status: 404 });
  }

  // Get holidays based on territory selection
  let holidays: Holiday[];
  if (territory) {
    holidays = holidaysForYearAndTerritory(year, territory).filter(h => h.type === "day_off");

    // Add Canary Islands island-specific holiday if selected
    if (territory === "canarias" && island) {
      const canaryData = getCanaryIslandHolidays(year);
      if (canaryData && canaryData[island]) {
        const islandHoliday = canaryData[island];
        // Check if not already included
        if (!holidays.some(h => h.date === islandHoliday.date && h.name === islandHoliday.name)) {
          holidays.push({
            date: islandHoliday.date,
            name: islandHoliday.name,
            scope: "regional",
            type: "day_off",
          });
        }
      }
    }
  } else {
    holidays = nationalHolidaysForYear(year).filter(h => h.type === "day_off");
  }

  // Sort holidays by date
  holidays.sort((a, b) => a.date.localeCompare(b.date));

  // Build calendar name based on location
  let calendarName = `Festivos España ${year}`;
  let uidSuffix = "";
  if (territory) {
    const territoryName = TERRITORIES.find(t => t.slug === territory)?.name || territory;
    if (island) {
      const islandName = CANARY_ISLANDS.find(i => i.slug === island)?.name || island;
      calendarName = `Festivos ${territoryName} (${islandName}) ${year}`;
      uidSuffix = `-${territory}-${island}`;
    } else {
      calendarName = `Festivos ${territoryName} ${year}`;
      uidSuffix = `-${territory}`;
    }
  }

  const events = [
    ...Mondays.map((monday) => {
      const start = localDateKey(monday);
      const nextMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
      // Use ISO week-year for the week number (important around New Year)
      const { week, year: isoYear } = isoWeek(monday);
      return [
        "BEGIN:VEVENT",
        `UID:semana-${isoYear}-${week}@numerosemanas.es`,
        `DTSTAMP:${utcTimestamp(new Date())}`,
        `DTSTART;VALUE=DATE:${compactDate(start)}`,
        `DTEND;VALUE=DATE:${compactDate(localDateKey(nextMonday))}`,
        `SUMMARY:${escapeIcs(`Semana ISO ${week} de ${isoYear}`)}`,
        "END:VEVENT",
      ].join("\r\n");
    }),
    ...holidays.map(({ date, name, scope }) => {
      // Add provisional label for unpublished years
      let displayName = name;
      if (!isVerified) {
        displayName = `${name} (Previsión)`;
      } else if (scope === "regional") {
        // Mark regional holidays in calendar
        displayName = `${name} (Autonómico)`;
      }
      return [
        "BEGIN:VEVENT",
        `UID:festivo-${date}${uidSuffix}@numerosemanas.es`,
        `DTSTAMP:${utcTimestamp(new Date())}`,
        `DTSTART;VALUE=DATE:${compactDate(date)}`,
        `DTEND;VALUE=DATE:${compactDate(addOneDay(date))}`,
        `SUMMARY:${escapeIcs(displayName)}`,
        "END:VEVENT",
      ].join("\r\n");
    }),
  ];
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NumeroSemanas//Calendario ISO ES//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(calendarName)}`,
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  // Build output filename
  let outputFilename = `festivos-${year}`;
  if (territory) {
    outputFilename += `-${territory}`;
    if (island) {
      outputFilename += `-${island}`;
    }
  }
  outputFilename += ".ics";

  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${outputFilename}"`,
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
