"use client";

import { useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import PrintButton from "@/components/PrintButton";
import regionalData from "../../../data/festivos-autonomicos.json";
import {
  holidaysForYearAndTerritory,
  nationalHolidaysForYear,
  hasVerifiedData,
  getSource,
  getCanaryIslandHolidays,
  getCanaryIslandsSource,
  getAvailableMunicipalities,
  getMunicipalHolidays,
  getMunicipalHolidaySource,
  getMunicipalityInfo,
  CANARY_ISLANDS,
  type TerritorySlug
} from "@/lib/holidays";
import { addDays, dateToIso, isoWeek, mondayOf } from "@/lib/weeks";

type CalendarYearViewProps = {
  year: number;
  today: string;
};

// Icons for download buttons
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1v9m0 0L5 7m3 3l3-3M2 12v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const WEEKDAYS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];
const WEEKDAY_FULL = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/**
 * Generate accessible date label with weekday, day, month and year.
 * This uses the actual date's values, not the displayed month's context.
 */
function accessibleDateLabel(date: Date): string {
  const weekday = WEEKDAY_FULL[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}, ${day} de ${month} de ${year}`;
}

function monthRows(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const rows: Date[][] = [];
  for (let weekStart = mondayOf(first); weekStart <= last; weekStart = addDays(weekStart, 7)) {
    rows.push(Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)));
  }
  return rows;
}

type HolidayInfo = {
  name: string;
  type: "day_off" | "observance";
  scope: "national" | "regional" | "local";
};

export default function CalendarYearView({
  year,
  today,
}: CalendarYearViewProps) {
  const [communitySlug, setCommunitySlug] = useState<string>("");
  const [islandSlug, setIslandSlug] = useState<string>("");
  const [municipalityCode, setMunicipalityCode] = useState<string>("");

  const hasVerified = hasVerifiedData(year);
  const source = getSource(year);
  const isCanarias = communitySlug === "canarias";
  const canaryIslandData = getCanaryIslandHolidays(year);
  const canaryIslandsSource = getCanaryIslandsSource(year);

  // Get available municipalities for selected community
  const availableMunicipalities = useMemo(() => {
    if (!communitySlug || isCanarias) return [];
    return getAvailableMunicipalities(communitySlug as TerritorySlug, year);
  }, [communitySlug, year, isCanarias]);

  // Get municipal holidays if municipality selected
  const municipalHolidays = useMemo(() => {
    if (!municipalityCode) return null;
    return getMunicipalHolidays(municipalityCode, year);
  }, [municipalityCode, year]);

  const municipalSource = municipalityCode ? getMunicipalHolidaySource(municipalityCode, year) : null;
  const municipalityInfo = municipalityCode ? getMunicipalityInfo(municipalityCode) : null;

  const holidayMap = useMemo(() => {
    const map = new Map<string, HolidayInfo[]>();

    // Get holidays based on selected territory (for all verified years 2020-2027)
    const holidays = communitySlug && hasVerified
      ? holidaysForYearAndTerritory(year, communitySlug as TerritorySlug)
      : nationalHolidaysForYear(year);

    for (const holiday of holidays) {
      const existing = map.get(holiday.date) || [];
      existing.push({
        name: holiday.name,
        type: holiday.type,
        scope: holiday.scope,
      });
      map.set(holiday.date, existing);
    }

    // Add Canary Islands island-specific holiday if selected
    if (isCanarias && islandSlug && canaryIslandData && canaryIslandData[islandSlug]) {
      const islandHoliday = canaryIslandData[islandSlug];
      const existing = map.get(islandHoliday.date) || [];
      // Check if this date already has an entry (avoid duplicates)
      if (!existing.some(h => h.name === islandHoliday.name)) {
        existing.push({
          name: islandHoliday.name,
          type: "day_off",
          scope: "regional",
        });
        map.set(islandHoliday.date, existing);
      }
    }

    // Add municipal holidays if municipality selected
    if (municipalHolidays) {
      for (const holiday of municipalHolidays) {
        const existing = map.get(holiday.date) || [];
        if (!existing.some(h => h.name === holiday.name)) {
          existing.push({
            name: holiday.name,
            type: "day_off",
            scope: "local",
          });
          map.set(holiday.date, existing);
        }
      }
    }

    return map;
  }, [communitySlug, year, hasVerified, isCanarias, islandSlug, canaryIslandData, municipalHolidays]);

  // Count days off for display
  const daysOffCount = useMemo(() => {
    const dates = new Set<string>();
    holidayMap.forEach((holidays, date) => {
      if (holidays.some(h => h.type === "day_off")) {
        dates.add(date);
      }
    });
    return dates.size;
  }, [holidayMap]);

  const communityName = regionalData.communities.find(c => c.slug === communitySlug)?.name;
  const islandName = CANARY_ISLANDS.find(i => i.slug === islandSlug)?.name;

  // Clear island and municipality selection when community changes
  const handleCommunityChange = (slug: string) => {
    setCommunitySlug(slug);
    setMunicipalityCode("");
    if (slug !== "canarias") {
      setIslandSlug("");
    }
  };

  // Build download URLs based on current selection
  const downloadUrls = useMemo(() => {
    let pdfUrl = `/api/pdf/semanas/${year}`;
    let icsFilename = `festivos-${year}`;

    if (communitySlug) {
      pdfUrl += `?territorio=${communitySlug}`;
      if (communitySlug === "canarias" && islandSlug) {
        pdfUrl += `&isla=${islandSlug}`;
        icsFilename += `-canarias-${islandSlug}`;
      } else {
        icsFilename += `-${communitySlug}`;
      }

      // Add municipality parameter if selected
      if (municipalityCode) {
        pdfUrl += `&municipio=${municipalityCode}`;
        icsFilename += `-${municipalityCode}`;
      }
    }

    return {
      pdf: pdfUrl,
      ics: `/api/ics/${icsFilename}.ics`,
    };
  }, [year, communitySlug, islandSlug, municipalityCode]);

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <div>
              <label
                htmlFor="community"
                className="mb-1.5 block text-sm font-semibold"
              >
                Comunidad autónoma
              </label>
              <select
                id="community"
                value={communitySlug}
                onChange={(event) => handleCommunityChange(event.currentTarget.value)}
                className="min-h-11 w-full min-w-56 rounded-xl border border-border bg-card px-3 text-ink"
              >
                <option value="">Solo festivos nacionales</option>
                {regionalData.communities.map((community) => (
                  <option key={community.slug} value={community.slug}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Canary Islands island selector */}
            {isCanarias && canaryIslandData && (
              <div>
                <label
                  htmlFor="island"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Isla
                </label>
                <select
                  id="island"
                  value={islandSlug}
                  onChange={(event) => setIslandSlug(event.currentTarget.value)}
                  className="min-h-11 w-full min-w-48 rounded-xl border border-border bg-card px-3 text-ink"
                >
                  <option value="">Solo festivos de Canarias</option>
                  {CANARY_ISLANDS.map((island) => (
                    <option key={island.slug} value={island.slug}>
                      {island.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Municipality selector (when available for selected community) */}
            {communitySlug && !isCanarias && availableMunicipalities.length > 0 && (
              <div>
                <label
                  htmlFor="municipality"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Municipio
                </label>
                <select
                  id="municipality"
                  value={municipalityCode}
                  onChange={(event) => setMunicipalityCode(event.currentTarget.value)}
                  className="min-h-11 w-full min-w-48 rounded-xl border border-border bg-card px-3 text-ink"
                >
                  <option value="">Sin festivos locales</option>
                  {availableMunicipalities.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.name}
                      {m.status === "pending" ? " (pendiente)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Holiday count indicator */}
          <div className="text-sm text-muted">
            {communitySlug ? (
              <>
                <span className="font-semibold text-ink">{daysOffCount} días festivos</span>
                {" "}para {communityName}
                {islandSlug && <> ({islandName})</>}
                {municipalityInfo && <> - {municipalityInfo.name}</>}
                {!hasVerified && (
                  <span className="ml-2 rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    Pendiente de publicación oficial
                  </span>
                )}
                {hasVerified && !municipalityCode && !isCanarias && availableMunicipalities.length > 0 && (
                  <span className="ml-2 text-xs text-muted">
                    (selecciona municipio para ver festivos locales)
                  </span>
                )}
                {hasVerified && !municipalityCode && (isCanarias || availableMunicipalities.length === 0) && (
                  <span className="ml-2 text-xs text-muted">
                    (sin los 2 festivos locales del municipio)
                  </span>
                )}
                {municipalityCode && municipalHolidays && (
                  <span className="ml-2 text-xs text-sage">
                    (incluye festivos locales)
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold text-ink">{daysOffCount} festivos nacionales</span>
                {" "}(sin incluir los 2 festivos locales ni los autonómicos)
                {!hasVerified && (
                  <span className="ml-2 rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    Previsión
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton label="Imprimir calendario" />
          <a
            href={downloadUrls.pdf}
            download
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-olive px-4 font-semibold text-white hover:bg-forest"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Descargar PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
          <a
            href={downloadUrls.ics}
            download
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-olive bg-card px-4 font-semibold text-olive hover:bg-olive/10"
          >
            <CalendarIcon />
            <span className="hidden sm:inline">Añadir a calendario</span>
            <span className="sm:hidden">iCal</span>
          </a>
        </div>
      </section>

      <div className="calendar-print-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MONTHS.map((monthName, month) => (
          <section
            key={monthName}
            aria-labelledby={`month-${month}`}
            className="calendar-print-month rounded-2xl border border-border bg-card p-4"
          >
            <h3
              id={`month-${month}`}
              className="mb-3 mt-0 font-heading text-xl font-bold capitalize"
            >
              {monthName} {year}
            </h3>
            <div
              role="row"
              className="mb-1 grid grid-cols-[30px_repeat(7,minmax(0,1fr))] gap-0.5 text-center text-xs font-semibold text-muted"
            >
              <span role="columnheader" aria-label="Semana">Sem</span>
              {WEEKDAYS.map((day) => (
                <span key={day} role="columnheader">{day}</span>
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              {monthRows(year, month).map((row) => (
                <div
                  key={dateToIso(row[0])}
                  role="row"
                  className="grid grid-cols-[30px_repeat(7,minmax(0,1fr))] gap-0.5"
                >
                  <span
                    role="rowheader"
                    className="flex min-h-9 items-center justify-center text-xs font-bold text-olive"
                  >
                    {isoWeek(row[0]).week}
                  </span>
                  {row.map((date) => {
                    const iso = dateToIso(date);
                    const holidays = holidayMap.get(iso) || [];
                    const dayOff = holidays.find(h => h.type === "day_off");
                    const observance = holidays.find(h => h.type === "observance");
                    const holiday = dayOff || observance;
                    const inMonth = date.getMonth() === month;
                    const current = iso === today;
                    const isRegional = holiday?.scope === "regional";
                    const isLocal = holiday?.scope === "local";

                    // Build tooltip with all holiday info
                    const tooltip = holidays.map(h => {
                      const typeLabel = h.type === "observance" ? " (celebración)" : "";
                      const scopeLabel = h.scope === "local" ? " [local]" : h.scope === "regional" ? " [autonómico]" : "";
                      return `${h.name}${typeLabel}${scopeLabel}`;
                    }).join("; ");

                    // Build accessible label from actual date (includes weekday, day, month, year)
                    const dateLabel = accessibleDateLabel(date);
                    const fullLabel = `${dateLabel}${tooltip ? `, ${tooltip}` : ""}${current ? ", hoy" : ""}`;

                    return (
                      <span
                        key={iso}
                        role="cell"
                        aria-label={fullLabel}
                        title={tooltip || undefined}
                        className={`relative flex min-h-9 items-center justify-center rounded-lg text-xs ${
                          inMonth ? "text-ink" : "text-muted/60"
                        } ${dayOff ? "bg-tan/60 font-bold" : ""} ${
                          observance && !dayOff ? "bg-tan/30 italic" : ""
                        } ${isRegional && dayOff ? "ring-1 ring-sage ring-inset" : ""} ${
                          isLocal && dayOff ? "ring-1 ring-forest ring-inset" : ""} ${
                          current ? "ring-2 ring-olive ring-inset" : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="calendar-print-legend rounded-2xl bg-panel p-4 text-sm leading-relaxed text-muted">
        <p className="m-0">
          {communitySlug ? (
            <>
              Mostrando el calendario de <strong>{communityName}</strong>
              {islandSlug && <> ({islandName})</>}
              {municipalityInfo && <> - <strong>{municipalityInfo.name}</strong></>} para {year}.
              {hasVerified && source && (
                <> Fuente: <a
                  href={`https://www.boe.es/buscar/doc.php?id=${source}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-olive hover:underline"
                >{source}</a>.</>
              )}
              {isCanarias && islandSlug && canaryIslandsSource && (
                <> Festivo insular: {canaryIslandsSource}.</>
              )}
              {municipalSource && (
                <> Festivos locales: {municipalSource.sourceUrl ? (
                  <a href={municipalSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-olive hover:underline">
                    {municipalSource.source}
                  </a>
                ) : municipalSource.source}.</>
              )}
              {!hasVerified && (
                <> <strong>Los festivos mostrados son una previsión</strong> y pueden cambiar cuando se publique el calendario oficial.</>
              )}
            </>
          ) : (
            <>
              Mostrando solo festivos nacionales. Selecciona una comunidad autónoma para ver su calendario completo.
              {!hasVerified && (
                <> <strong>Previsión:</strong> pendiente de publicación oficial del BOE.</>
              )}
            </>
          )}
        </p>
        <p className="mt-2 text-xs">
          {municipalityCode && municipalHolidays ? (
            <>
              <strong>Festivos locales incluidos:</strong> {municipalHolidays.map(h => h.name).join(", ")}.
            </>
          ) : (
            <>
              <strong>Festivos locales:</strong> Los 2 festivos locales dependen del municipio.
              {availableMunicipalities.length > 0
                ? " Selecciona tu municipio arriba para verlos."
                : " Consulta la publicación oficial de tu ayuntamiento para obtener las fechas exactas."}
            </>
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-tan" aria-hidden="true" />
            Día festivo (no laborable)
          </span>
          {communitySlug && (
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-tan ring-1 ring-sage ring-inset" aria-hidden="true" />
              Festivo autonómico{islandSlug && " / insular"}
            </span>
          )}
          {municipalityCode && municipalHolidays && (
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-tan ring-1 ring-forest ring-inset" aria-hidden="true" />
              Festivo local
            </span>
          )}
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-tan/30" aria-hidden="true" />
            Celebración (en domingo)
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm ring-2 ring-olive ring-inset" aria-hidden="true" />
            Hoy
          </span>
        </div>
      </div>
      <AdSlot id={`ad-calendar-inline-${year}`} size="responsive" />
    </>
  );
}
