/**
 * Spanish Holiday Calendar - ISO 8601 compliant
 *
 * Official Sources (BOE):
 * - 2020: BOE-A-2019-14552 (Resolución de 3 de octubre de 2019)
 * - 2021: BOE-A-2020-13343 (Resolución de 28 de octubre de 2020)
 * - 2022: BOE-A-2021-17113 (Resolución de 14 de octubre de 2021)
 * - 2023: BOE-A-2022-16755 (Resolución de 7 de octubre de 2022)
 * - 2024: BOE-A-2023-22014 (Resolución de 23 de octubre de 2023)
 * - 2025: BOE-A-2024-21316 (Resolución de 15 de octubre de 2024)
 * - 2026: BOE-A-2025-21667 (Resolución de 17 de octubre de 2025)
 * - 2027: BOE-A-2026-21254 (Resolución de 8 de octubre de 2026)
 *
 * Calendar index: https://administracion.gob.es/informacion/calendarios/laborales
 */

export type HolidayScope = "national" | "regional" | "local";
export type HolidayType = "day_off" | "observance";
export type VerificationStatus = "verified" | "projected" | "pending";

export type Holiday = {
  date: string;
  name: string;
  scope: HolidayScope;
  type: HolidayType;
  territories?: string[];
  observanceDate?: string;
  source?: string;
  verified?: VerificationStatus;
};

// Fixed national holidays (non-substitutable, marked * in BOE)
const NATIONAL_FIXED_DATES = [
  { month: 1, day: 1, name: "Año Nuevo" },
  { month: 5, day: 1, name: "Fiesta del Trabajo" },
  { month: 10, day: 12, name: "Fiesta Nacional de España" },
  { month: 12, day: 8, name: "Inmaculada Concepción" },
  { month: 12, day: 25, name: "Natividad del Señor" },
] as const;

// Holidays that may move to Monday when falling on Sunday
const NATIONAL_SUBSTITUTABLE_DATES = [
  { month: 1, day: 6, name: "Epifanía del Señor" },
  { month: 8, day: 15, name: "Asunción de la Virgen" },
  { month: 11, day: 1, name: "Todos los Santos" },
  { month: 12, day: 6, name: "Día de la Constitución Española" },
] as const;

// All 17 autonomous communities + 2 autonomous cities
export const TERRITORIES = [
  { name: "Andalucía", slug: "andalucia" },
  { name: "Aragón", slug: "aragon" },
  { name: "Asturias", slug: "asturias" },
  { name: "Illes Balears", slug: "illes-balears" },
  { name: "Canarias", slug: "canarias" },
  { name: "Cantabria", slug: "cantabria" },
  { name: "Castilla-La Mancha", slug: "castilla-la-mancha" },
  { name: "Castilla y León", slug: "castilla-y-leon" },
  { name: "Cataluña", slug: "cataluna" },
  { name: "Comunitat Valenciana", slug: "comunitat-valenciana" },
  { name: "Extremadura", slug: "extremadura" },
  { name: "Galicia", slug: "galicia" },
  { name: "Comunidad de Madrid", slug: "comunidad-de-madrid" },
  { name: "Región de Murcia", slug: "region-de-murcia" },
  { name: "Navarra", slug: "navarra" },
  { name: "País Vasco", slug: "pais-vasco" },
  { name: "La Rioja", slug: "la-rioja" },
  { name: "Ceuta", slug: "ceuta" },
  { name: "Melilla", slug: "melilla" },
] as const;

export const TERRITORY_SLUGS = TERRITORIES.map(t => t.slug);
export type TerritorySlug = typeof TERRITORY_SLUGS[number];

// All territories except those listed
function allExcept(...excluded: TerritorySlug[]): TerritorySlug[] {
  return TERRITORY_SLUGS.filter(t => !excluded.includes(t)) as TerritorySlug[];
}

/**
 * Compute Easter Sunday using the Anonymous Gregorian algorithm.
 */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function goodFriday(year: number): Date {
  const easter = easterSunday(year);
  return new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() - 2);
}

export function maundyThursday(year: number): Date {
  const easter = easterSunday(year);
  return new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() - 3);
}

export function easterMonday(year: number): Date {
  const easter = easterSunday(year);
  return new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 1);
}

function dateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function dateFromDate(d: Date): string {
  return dateString(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function dayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  return dateFromDate(date);
}

type RegionalHolidayData = {
  source: string;
  verified: VerificationStatus;
  national: {
    juevessanto: TerritorySlug[];
    mondaySubstitutions: Record<string, TerritorySlug[]>;
  };
  regional: Record<string, { date: string; name: string; observanceDate?: string }[]>;
  islamic: { ceuta: { date: string; name: string }[]; melilla: { date: string; name: string }[] };
  canaryIslands?: Record<string, { date: string; name: string }>;
  canaryIslandsSource?: string; // BOC decree reference
};

// ============================================================================
// CANARY ISLANDS CONFIGURATION
// ============================================================================

/**
 * All Canary Islands including La Graciosa.
 * La Graciosa is administratively part of the municipality of Teguise (Lanzarote)
 * and shares Lanzarote's island holiday.
 */
export const CANARY_ISLANDS = [
  { slug: "tenerife", name: "Tenerife", patronFeast: "Virgen de la Candelaria" },
  { slug: "gran-canaria", name: "Gran Canaria", patronFeast: "Nuestra Señora del Pino" },
  { slug: "lanzarote", name: "Lanzarote", patronFeast: "Nuestra Señora de los Volcanes" },
  { slug: "fuerteventura", name: "Fuerteventura", patronFeast: "Nuestra Señora de la Peña" },
  { slug: "la-palma", name: "La Palma", patronFeast: "Nuestra Señora de Las Nieves" },
  { slug: "la-gomera", name: "La Gomera", patronFeast: "Nuestra Señora de Guadalupe" },
  { slug: "el-hierro", name: "El Hierro", patronFeast: "Nuestra Señora de los Reyes" },
  { slug: "la-graciosa", name: "La Graciosa", patronFeast: "Nuestra Señora de los Volcanes", followsIsland: "lanzarote" },
] as const;

export const CANARY_ISLAND_SLUGS = CANARY_ISLANDS.map(i => i.slug);
export type CanaryIslandSlug = typeof CANARY_ISLAND_SLUGS[number];

// ============================================================================
// MUNICIPAL HOLIDAYS FRAMEWORK
// ============================================================================

export type MunicipalHolidayStatus = "verified" | "pending" | "unavailable";

export type Municipality = {
  code: string; // INE municipality code (5 digits)
  name: string;
  province: string;
  provinceCode: string; // INE province code (2 digits)
  communitySlug: TerritorySlug;
};

export type MunicipalHolidayYear = {
  year: number;
  status: MunicipalHolidayStatus;
  holidays?: { date: string; name: string }[];
  source?: string;
  sourceUrl?: string;
  lastUpdated?: string;
};

// Import municipal holiday data from JSON
import municipalData from "../../data/festivos-municipales.json";

type MunicipalDataYear = {
  status: "verified" | "pending" | "unavailable";
  source?: string;
  sourceUrl?: string;
  lastUpdated?: string;
  dates?: { date: string; name: string }[];
};

type MunicipalDataHolidays = Record<string, Record<string, MunicipalDataYear>>;
type MunicipalDataMunicipalities = Record<string, { name: string; province: string }>;
type MunicipalDataProvinces = Record<string, { name: string; community: TerritorySlug; bulletin: string }>;

const municipalHolidays = municipalData.holidays as MunicipalDataHolidays;
const municipalMunicipalities = municipalData.municipalities as MunicipalDataMunicipalities;
const municipalProvinces = municipalData.provinces as MunicipalDataProvinces;

/**
 * Check municipal holiday availability for a year.
 */
export function getMunicipalHolidayStatus(municipalityCode: string, year: number): MunicipalHolidayStatus {
  const yearData = municipalHolidays[municipalityCode]?.[String(year)];
  if (!yearData) return "unavailable";
  return yearData.status as MunicipalHolidayStatus;
}

/**
 * Get municipal holidays if available.
 */
export function getMunicipalHolidays(municipalityCode: string, year: number): { date: string; name: string }[] | null {
  const yearData = municipalHolidays[municipalityCode]?.[String(year)];
  if (!yearData || yearData.status !== "verified" || !yearData.dates) return null;
  return yearData.dates;
}

/**
 * Get municipal holiday source information.
 */
export function getMunicipalHolidaySource(municipalityCode: string, year: number): { source: string; sourceUrl?: string } | null {
  const yearData = municipalHolidays[municipalityCode]?.[String(year)];
  if (!yearData || !yearData.source) return null;
  return { source: yearData.source, sourceUrl: yearData.sourceUrl };
}

/**
 * Get municipality info by INE code.
 */
export function getMunicipalityInfo(municipalityCode: string): { name: string; province: string; provinceName: string; community: TerritorySlug } | null {
  const municipality = municipalMunicipalities[municipalityCode];
  if (!municipality) return null;
  const province = municipalProvinces[municipality.province];
  if (!province) return null;
  return {
    name: municipality.name,
    province: municipality.province,
    provinceName: province.name,
    community: province.community,
  };
}

/**
 * Get available municipalities for a community and year.
 */
export function getAvailableMunicipalities(
  communitySlug: TerritorySlug,
  year: number
): { code: string; name: string; status: MunicipalHolidayStatus }[] {
  const results: { code: string; name: string; status: MunicipalHolidayStatus }[] = [];

  for (const [code, municipality] of Object.entries(municipalMunicipalities)) {
    const province = municipalProvinces[municipality.province];
    if (!province || province.community !== communitySlug) continue;

    const yearData = municipalHolidays[code]?.[String(year)];
    if (yearData) {
      results.push({
        code,
        name: municipality.name,
        status: yearData.status as MunicipalHolidayStatus,
      });
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name, "es"));
}

/**
 * Get coverage statistics for the municipal holiday data.
 */
export function getMunicipalCoverageStats(): {
  totalMunicipalities: number;
  byYear: Record<number, { verified: number; pending: number }>;
  byProvince: Record<string, { name: string; count: number }>;
} {
  const byYear: Record<number, { verified: number; pending: number }> = {};
  const byProvince: Record<string, { name: string; count: number }> = {};

  for (const [code, years] of Object.entries(municipalHolidays)) {
    const municipality = municipalMunicipalities[code];
    if (!municipality) continue;

    // Count by province
    const province = municipalProvinces[municipality.province];
    if (province) {
      if (!byProvince[municipality.province]) {
        byProvince[municipality.province] = { name: province.name, count: 0 };
      }
      byProvince[municipality.province].count++;
    }

    // Count by year
    for (const [yearStr, data] of Object.entries(years)) {
      const year = Number(yearStr);
      if (!byYear[year]) {
        byYear[year] = { verified: 0, pending: 0 };
      }
      if (data.status === "verified") {
        byYear[year].verified++;
      } else if (data.status === "pending") {
        byYear[year].pending++;
      }
    }
  }

  return {
    totalMunicipalities: Object.keys(municipalMunicipalities).length,
    byYear,
    byProvince,
  };
}

// ============================================================================
// VERIFIED HOLIDAY DATA BY YEAR (from official BOE publications)
// ============================================================================

const HOLIDAY_DATA_2020: RegionalHolidayData = {
  source: "BOE-A-2019-14552",
  verified: "verified",
  national: {
    // Jueves Santo everywhere except Cataluña and Comunitat Valenciana
    juevessanto: allExcept("cataluna", "comunitat-valenciana"),
    // Nov 1 (Sunday) → Nov 2; Dec 6 (Sunday) → Dec 7
    mondaySubstitutions: {
      "2020-11-02": ["andalucia", "aragon", "asturias", "castilla-y-leon", "extremadura", "comunidad-de-madrid"],
      "2020-12-07": allExcept("castilla-la-mancha", "cantabria", "cataluna", "comunitat-valenciana", "galicia", "pais-vasco"),
    },
  },
  regional: {
    "andalucia": [{ date: "2020-02-28", name: "Día de Andalucía" }],
    "aragon": [{ date: "2020-04-23", name: "San Jorge / Día de Aragón" }],
    "asturias": [{ date: "2020-09-08", name: "Día de Asturias" }],
    "illes-balears": [
      { date: "2020-04-13", name: "Lunes de Pascua" },
      { date: "2020-12-26", name: "San Esteban" },
    ],
    "canarias": [{ date: "2020-05-30", name: "Día de Canarias" }],
    "cantabria": [
      { date: "2020-07-28", name: "Día de las Instituciones de Cantabria" },
      { date: "2020-09-15", name: "La Bien Aparecida" },
    ],
    "castilla-la-mancha": [
      { date: "2020-06-11", name: "Corpus Christi" },
    ],
    "castilla-y-leon": [{ date: "2020-04-23", name: "Fiesta de Castilla y León" }],
    "cataluna": [
      { date: "2020-04-13", name: "Lunes de Pascua" },
      { date: "2020-06-24", name: "San Juan" },
      { date: "2020-09-11", name: "Fiesta Nacional de Cataluña" },
      { date: "2020-12-26", name: "Sant Esteve" },
    ],
    "comunitat-valenciana": [
      { date: "2020-03-19", name: "San José" },
      { date: "2020-04-13", name: "Lunes de Pascua" },
      { date: "2020-10-09", name: "Día de la Comunitat Valenciana" },
    ],
    "extremadura": [{ date: "2020-09-08", name: "Día de Extremadura" }],
    "galicia": [
      { date: "2020-05-17", name: "Día de las Letras Gallegas" },
      { date: "2020-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [{ date: "2020-05-02", name: "Fiesta de la Comunidad de Madrid" }],
    "region-de-murcia": [
      { date: "2020-03-19", name: "San José" },
      { date: "2020-06-09", name: "Día de la Región de Murcia" },
    ],
    "navarra": [
      { date: "2020-03-19", name: "San José" },
      { date: "2020-04-13", name: "Lunes de Pascua" },
    ],
    "pais-vasco": [
      { date: "2020-03-19", name: "San José" },
      { date: "2020-04-13", name: "Lunes de Pascua" },
      { date: "2020-07-25", name: "Santiago Apóstol" },
    ],
    "la-rioja": [
      { date: "2020-04-13", name: "Lunes de Pascua" },
      { date: "2020-06-09", name: "Día de La Rioja" },
    ],
    "ceuta": [{ date: "2020-09-02", name: "Día de Ceuta" }],
    "melilla": [{ date: "2020-03-13", name: "Estatuto de Autonomía de Melilla" }],
  },
  islamic: {
    ceuta: [{ date: "2020-07-31", name: "Fiesta del Eid al-Adha" }],
    melilla: [{ date: "2020-07-31", name: "Fiesta del Eid al-Adha" }],
  },
  canaryIslands: {
    "tenerife": { date: "2020-09-07", name: "Virgen de la Candelaria" }, // Moved from Feb 2 (Sunday)
    "gran-canaria": { date: "2020-09-08", name: "Nuestra Señora del Pino" },
    "fuerteventura": { date: "2020-09-18", name: "Nuestra Señora de la Peña" },
    "lanzarote": { date: "2020-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-graciosa": { date: "2020-09-15", name: "Nuestra Señora de los Volcanes" }, // Follows Lanzarote
    "la-palma": { date: "2020-08-05", name: "Nuestra Señora de Las Nieves" },
    "la-gomera": { date: "2020-10-05", name: "Nuestra Señora de Guadalupe" },
    "el-hierro": { date: "2020-09-25", name: "Nuestra Señora de los Reyes" },
  },
  canaryIslandsSource: "Decreto 83/2019 (BOC)", // https://www.gobiernodecanarias.org/boc/2019/
};

const HOLIDAY_DATA_2021: RegionalHolidayData = {
  source: "BOE-A-2020-13343",
  verified: "verified",
  national: {
    juevessanto: allExcept("cataluna", "comunitat-valenciana"),
    // Aug 15 (Sunday) → Aug 16
    mondaySubstitutions: {
      "2021-08-16": ["andalucia", "aragon", "asturias", "canarias", "castilla-y-leon"],
    },
  },
  regional: {
    "andalucia": [{ date: "2021-02-28", name: "Día de Andalucía" }],
    "aragon": [{ date: "2021-04-23", name: "San Jorge / Día de Aragón" }],
    "asturias": [{ date: "2021-09-08", name: "Día de Asturias" }],
    "illes-balears": [
      { date: "2021-03-01", name: "Día de les Illes Balears" },
      { date: "2021-04-05", name: "Lunes de Pascua" },
    ],
    "canarias": [{ date: "2021-05-30", name: "Día de Canarias" }],
    "cantabria": [{ date: "2021-07-28", name: "Día de las Instituciones de Cantabria" }],
    "castilla-la-mancha": [{ date: "2021-06-03", name: "Corpus Christi" }],
    "castilla-y-leon": [{ date: "2021-04-23", name: "Fiesta de Castilla y León" }],
    "cataluna": [
      { date: "2021-04-05", name: "Lunes de Pascua" },
      { date: "2021-06-24", name: "San Juan" },
      { date: "2021-09-11", name: "Fiesta Nacional de Cataluña" },
      { date: "2021-12-26", name: "Sant Esteve" },
    ],
    "comunitat-valenciana": [
      { date: "2021-03-19", name: "San José" },
      { date: "2021-04-05", name: "Lunes de Pascua" },
      { date: "2021-10-09", name: "Día de la Comunitat Valenciana" },
    ],
    "extremadura": [{ date: "2021-09-08", name: "Día de Extremadura" }],
    "galicia": [
      { date: "2021-05-17", name: "Día de las Letras Gallegas" },
      { date: "2021-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [
      { date: "2021-05-03", name: "Lunes siguiente al Día de la Comunidad de Madrid" },
    ],
    "region-de-murcia": [{ date: "2021-06-09", name: "Día de la Región de Murcia" }],
    "navarra": [{ date: "2021-12-03", name: "San Francisco Javier" }],
    "pais-vasco": [
      { date: "2021-03-19", name: "San José" },
      { date: "2021-07-25", name: "Santiago Apóstol" },
    ],
    "la-rioja": [{ date: "2021-06-09", name: "Día de La Rioja" }],
    "ceuta": [{ date: "2021-09-02", name: "Día de Ceuta" }],
    "melilla": [{ date: "2021-03-13", name: "Estatuto de Autonomía de Melilla" }],
  },
  islamic: {
    ceuta: [{ date: "2021-07-20", name: "Fiesta del Eid al-Adha" }],
    melilla: [{ date: "2021-07-21", name: "Fiesta del Eid al-Adha" }],
  },
  canaryIslands: {
    "tenerife": { date: "2021-02-02", name: "Virgen de la Candelaria" },
    "gran-canaria": { date: "2021-09-08", name: "Nuestra Señora del Pino" },
    "fuerteventura": { date: "2021-09-18", name: "Nuestra Señora de la Peña" },
    "lanzarote": { date: "2021-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-graciosa": { date: "2021-09-15", name: "Nuestra Señora de los Volcanes" }, // Follows Lanzarote
    "la-palma": { date: "2021-08-05", name: "Nuestra Señora de Las Nieves" },
    "la-gomera": { date: "2021-10-04", name: "Nuestra Señora de Guadalupe" },
    "el-hierro": { date: "2021-09-24", name: "Nuestra Señora de los Reyes" },
  },
  canaryIslandsSource: "Decreto 110/2020, BOC 2020/209", // https://www.gobiernodecanarias.org/boc/2020/209/001.html
};

const HOLIDAY_DATA_2022: RegionalHolidayData = {
  source: "BOE-A-2021-17113",
  verified: "verified",
  national: {
    juevessanto: allExcept("cataluna"),
    // May 1 (Sunday) → May 2; Dec 25 (Sunday) → Dec 26
    mondaySubstitutions: {
      "2022-05-02": TERRITORY_SLUGS as unknown as TerritorySlug[],
      "2022-12-26": TERRITORY_SLUGS as unknown as TerritorySlug[],
    },
  },
  regional: {
    "andalucia": [{ date: "2022-02-28", name: "Día de Andalucía" }],
    "aragon": [{ date: "2022-04-23", name: "San Jorge / Día de Aragón" }],
    "asturias": [{ date: "2022-09-08", name: "Día de Asturias" }],
    "illes-balears": [
      { date: "2022-03-01", name: "Día de les Illes Balears" },
      { date: "2022-04-18", name: "Lunes de Pascua" },
    ],
    "canarias": [{ date: "2022-05-30", name: "Día de Canarias" }],
    "cantabria": [{ date: "2022-07-28", name: "Día de las Instituciones de Cantabria" }],
    "castilla-la-mancha": [{ date: "2022-06-16", name: "Corpus Christi" }],
    "castilla-y-leon": [{ date: "2022-04-23", name: "Fiesta de Castilla y León" }],
    "cataluna": [
      { date: "2022-04-18", name: "Lunes de Pascua" },
      { date: "2022-06-24", name: "San Juan" },
      { date: "2022-09-11", name: "Fiesta Nacional de Cataluña" },
    ],
    "comunitat-valenciana": [
      { date: "2022-03-19", name: "San José" },
      { date: "2022-04-18", name: "Lunes de Pascua" },
      { date: "2022-10-09", name: "Día de la Comunitat Valenciana" },
    ],
    "extremadura": [{ date: "2022-09-08", name: "Día de Extremadura" }],
    "galicia": [
      { date: "2022-05-17", name: "Día de las Letras Gallegas" },
      { date: "2022-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [{ date: "2022-05-02", name: "Fiesta de la Comunidad de Madrid" }],
    "region-de-murcia": [
      { date: "2022-03-19", name: "San José" },
      { date: "2022-06-09", name: "Día de la Región de Murcia" },
    ],
    "navarra": [{ date: "2022-12-03", name: "San Francisco Javier" }],
    "pais-vasco": [
      { date: "2022-03-19", name: "San José" },
      { date: "2022-07-25", name: "Santiago Apóstol" },
    ],
    "la-rioja": [{ date: "2022-06-09", name: "Día de La Rioja" }],
    "ceuta": [
      { date: "2022-08-05", name: "Nuestra Señora de África" },
      { date: "2022-09-02", name: "Día de Ceuta" },
    ],
    "melilla": [],
  },
  islamic: {
    ceuta: [{ date: "2022-07-09", name: "Fiesta del Eid al-Adha" }],
    melilla: [
      { date: "2022-05-03", name: "Fiesta del Eid al-Fitr" },
      { date: "2022-07-11", name: "Fiesta del Eid al-Adha" },
    ],
  },
  canaryIslands: {
    "tenerife": { date: "2022-02-02", name: "Virgen de la Candelaria" },
    "gran-canaria": { date: "2022-09-08", name: "Nuestra Señora del Pino" },
    "fuerteventura": { date: "2022-09-17", name: "Nuestra Señora de la Peña" },
    "lanzarote": { date: "2022-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-graciosa": { date: "2022-09-15", name: "Nuestra Señora de los Volcanes" }, // Explicitly in BOC
    "la-palma": { date: "2022-08-05", name: "Nuestra Señora de Las Nieves" },
    "la-gomera": { date: "2022-10-03", name: "Nuestra Señora de Guadalupe" },
    "el-hierro": { date: "2022-09-24", name: "Nuestra Señora de los Reyes" },
  },
  canaryIslandsSource: "Decreto 66/2021, BOC 2021/136", // https://www.gobiernodecanarias.org/boc/2021/136/001.html
};

const HOLIDAY_DATA_2023: RegionalHolidayData = {
  source: "BOE-A-2022-16755",
  verified: "verified",
  national: {
    juevessanto: allExcept("cataluna"),
    // Jan 1 (Sunday) → Jan 2
    mondaySubstitutions: {
      "2023-01-02": TERRITORY_SLUGS as unknown as TerritorySlug[],
    },
  },
  regional: {
    "andalucia": [{ date: "2023-02-28", name: "Día de Andalucía" }],
    "aragon": [
      { date: "2023-04-23", name: "San Jorge / Día de Aragón", observanceDate: "2023-04-23" },
      { date: "2023-04-24", name: "Lunes siguiente a San Jorge / Día de Aragón" },
    ],
    "asturias": [{ date: "2023-09-08", name: "Día de Asturias" }],
    "illes-balears": [
      { date: "2023-03-01", name: "Día de les Illes Balears" },
      { date: "2023-04-10", name: "Lunes de Pascua" },
    ],
    "canarias": [{ date: "2023-05-30", name: "Día de Canarias" }],
    "cantabria": [{ date: "2023-07-28", name: "Día de las Instituciones de Cantabria" }],
    "castilla-la-mancha": [{ date: "2023-06-08", name: "Corpus Christi" }],
    "castilla-y-leon": [
      { date: "2023-04-23", name: "Fiesta de Castilla y León", observanceDate: "2023-04-23" },
      { date: "2023-04-24", name: "Lunes siguiente a Fiesta de Castilla y León" },
    ],
    "cataluna": [
      { date: "2023-04-10", name: "Lunes de Pascua" },
      { date: "2023-06-24", name: "San Juan" },
      { date: "2023-09-11", name: "Fiesta Nacional de Cataluña" },
      { date: "2023-12-26", name: "Sant Esteve" },
    ],
    "comunitat-valenciana": [
      { date: "2023-04-10", name: "Lunes de Pascua" },
      { date: "2023-10-09", name: "Día de la Comunitat Valenciana" },
    ],
    "extremadura": [{ date: "2023-09-08", name: "Día de Extremadura" }],
    "galicia": [
      { date: "2023-05-17", name: "Día de las Letras Gallegas" },
      { date: "2023-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [{ date: "2023-05-02", name: "Fiesta de la Comunidad de Madrid" }],
    "region-de-murcia": [{ date: "2023-06-09", name: "Día de la Región de Murcia" }],
    "navarra": [{ date: "2023-12-03", name: "San Francisco Javier" }],
    "pais-vasco": [
      { date: "2023-03-19", name: "San José" },
      { date: "2023-07-25", name: "Santiago Apóstol" },
    ],
    "la-rioja": [{ date: "2023-06-09", name: "Día de La Rioja" }],
    "ceuta": [{ date: "2023-09-02", name: "Día de Ceuta" }],
    "melilla": [],
  },
  islamic: {
    ceuta: [{ date: "2023-06-29", name: "Fiesta del Eid al-Adha" }],
    melilla: [
      { date: "2023-04-21", name: "Fiesta del Eid al-Fitr" },
      { date: "2023-06-29", name: "Fiesta del Eid al-Adha" },
    ],
  },
  canaryIslands: {
    "tenerife": { date: "2023-02-02", name: "Virgen de la Candelaria" },
    "gran-canaria": { date: "2023-09-08", name: "Nuestra Señora del Pino" },
    "fuerteventura": { date: "2023-09-16", name: "Nuestra Señora de la Peña" },
    "lanzarote": { date: "2023-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-graciosa": { date: "2023-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-palma": { date: "2023-08-05", name: "Nuestra Señora de Las Nieves" },
    "la-gomera": { date: "2023-10-09", name: "Nuestra Señora de Guadalupe" },
    "el-hierro": { date: "2023-09-25", name: "Nuestra Señora de los Reyes" },
  },
  canaryIslandsSource: "Decreto 156/2022, BOC 2022/137", // https://www.gobiernodecanarias.org/boc/2022/137/001.html
};

const HOLIDAY_DATA_2024: RegionalHolidayData = {
  source: "BOE-A-2023-22014",
  verified: "verified",
  national: {
    juevessanto: allExcept("cataluna", "comunitat-valenciana"),
    // Dec 8 (Sunday) → Dec 9
    mondaySubstitutions: {
      "2024-12-09": TERRITORY_SLUGS as unknown as TerritorySlug[],
    },
  },
  regional: {
    "andalucia": [{ date: "2024-02-28", name: "Día de Andalucía" }],
    "aragon": [{ date: "2024-04-23", name: "San Jorge / Día de Aragón" }],
    "asturias": [
      { date: "2024-09-08", name: "Día de Asturias", observanceDate: "2024-09-08" },
      { date: "2024-09-09", name: "Lunes siguiente al Día de Asturias" },
    ],
    "illes-balears": [
      { date: "2024-03-01", name: "Día de les Illes Balears" },
      { date: "2024-04-01", name: "Lunes de Pascua" },
    ],
    "canarias": [{ date: "2024-05-30", name: "Día de Canarias" }],
    "cantabria": [{ date: "2024-07-28", name: "Día de las Instituciones de Cantabria" }],
    "castilla-la-mancha": [{ date: "2024-05-30", name: "Corpus Christi" }],
    "castilla-y-leon": [{ date: "2024-04-23", name: "Fiesta de Castilla y León" }],
    "cataluna": [
      { date: "2024-04-01", name: "Lunes de Pascua" },
      { date: "2024-06-24", name: "San Juan" },
      { date: "2024-09-11", name: "Fiesta Nacional de Cataluña" },
      { date: "2024-12-26", name: "Sant Esteve" },
    ],
    "comunitat-valenciana": [
      { date: "2024-03-19", name: "San José" },
      { date: "2024-04-01", name: "Lunes de Pascua" },
      { date: "2024-10-09", name: "Día de la Comunitat Valenciana" },
    ],
    "extremadura": [
      { date: "2024-09-08", name: "Día de Extremadura", observanceDate: "2024-09-08" },
    ],
    "galicia": [
      { date: "2024-05-17", name: "Día de las Letras Gallegas" },
      { date: "2024-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [{ date: "2024-05-02", name: "Fiesta de la Comunidad de Madrid" }],
    "region-de-murcia": [{ date: "2024-06-09", name: "Día de la Región de Murcia" }],
    "navarra": [{ date: "2024-12-03", name: "San Francisco Javier" }],
    "pais-vasco": [
      { date: "2024-03-19", name: "San José" },
      { date: "2024-07-25", name: "Santiago Apóstol" },
    ],
    "la-rioja": [
      { date: "2024-06-09", name: "Día de La Rioja", observanceDate: "2024-06-09" },
      { date: "2024-06-10", name: "Lunes siguiente al Día de La Rioja" },
    ],
    "ceuta": [
      { date: "2024-08-05", name: "Nuestra Señora de África" },
      { date: "2024-09-02", name: "Día de Ceuta" },
    ],
    "melilla": [{ date: "2024-03-19", name: "San José" }],
  },
  islamic: {
    ceuta: [{ date: "2024-06-17", name: "Fiesta del Eid al-Adha" }],
    melilla: [{ date: "2024-06-17", name: "Fiesta del Eid al-Adha" }],
  },
  canaryIslands: {
    "tenerife": { date: "2024-02-02", name: "Virgen de la Candelaria" },
    "gran-canaria": { date: "2024-09-09", name: "Nuestra Señora del Pino" }, // Sep 8 is Sunday
    "fuerteventura": { date: "2024-09-21", name: "Nuestra Señora de la Peña" },
    "lanzarote": { date: "2024-09-16", name: "Nuestra Señora de los Volcanes" }, // Sep 15 is Sunday
    "la-graciosa": { date: "2024-09-16", name: "Nuestra Señora de los Volcanes" },
    "la-palma": { date: "2024-08-05", name: "Nuestra Señora de Las Nieves" },
    "la-gomera": { date: "2024-10-07", name: "Nuestra Señora de Guadalupe" },
    "el-hierro": { date: "2024-09-24", name: "Nuestra Señora de los Reyes" },
  },
  canaryIslandsSource: "BOC 2023/184", // https://www.gobiernodecanarias.org/boc/2023/184/001.html
};

const HOLIDAY_DATA_2025: RegionalHolidayData = {
  source: "BOE-A-2024-21316",
  verified: "verified",
  national: {
    juevessanto: allExcept("cataluna", "comunitat-valenciana"),
    // Oct 12 (Sunday) → Oct 13
    mondaySubstitutions: {
      "2025-10-13": ["andalucia", "aragon", "asturias", "castilla-y-leon", "extremadura"],
    },
  },
  regional: {
    "andalucia": [{ date: "2025-02-28", name: "Día de Andalucía" }],
    "aragon": [{ date: "2025-04-23", name: "San Jorge / Día de Aragón" }],
    "asturias": [{ date: "2025-09-08", name: "Día de Asturias" }],
    "illes-balears": [
      { date: "2025-03-01", name: "Día de les Illes Balears" },
      { date: "2025-04-21", name: "Lunes de Pascua" },
    ],
    "canarias": [{ date: "2025-05-30", name: "Día de Canarias" }],
    "cantabria": [{ date: "2025-07-28", name: "Día de las Instituciones de Cantabria" }],
    "castilla-la-mancha": [{ date: "2025-06-19", name: "Corpus Christi" }],
    "castilla-y-leon": [{ date: "2025-04-23", name: "Fiesta de Castilla y León" }],
    "cataluna": [
      { date: "2025-04-21", name: "Lunes de Pascua" },
      { date: "2025-06-24", name: "San Juan" },
      { date: "2025-09-11", name: "Fiesta Nacional de Cataluña" },
      { date: "2025-12-26", name: "Sant Esteve" },
    ],
    "comunitat-valenciana": [
      { date: "2025-03-19", name: "San José" },
      { date: "2025-04-21", name: "Lunes de Pascua" },
      { date: "2025-10-09", name: "Día de la Comunitat Valenciana" },
    ],
    "extremadura": [{ date: "2025-09-08", name: "Día de Extremadura" }],
    "galicia": [
      { date: "2025-05-17", name: "Día de las Letras Gallegas" },
      { date: "2025-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [{ date: "2025-05-02", name: "Fiesta de la Comunidad de Madrid" }],
    "region-de-murcia": [{ date: "2025-06-09", name: "Día de la Región de Murcia" }],
    "navarra": [
      { date: "2025-03-19", name: "San José" },
      { date: "2025-12-03", name: "San Francisco Javier" },
    ],
    "pais-vasco": [
      { date: "2025-03-19", name: "San José" },
      { date: "2025-07-25", name: "Santiago Apóstol" },
    ],
    "la-rioja": [{ date: "2025-06-09", name: "Día de La Rioja" }],
    "ceuta": [
      { date: "2025-08-05", name: "Nuestra Señora de África" },
      { date: "2025-09-02", name: "Día de Ceuta" },
    ],
    "melilla": [{ date: "2025-03-19", name: "San José" }],
  },
  islamic: {
    ceuta: [{ date: "2025-06-06", name: "Fiesta del Eid al-Adha" }],
    melilla: [
      { date: "2025-03-31", name: "Fiesta del Eid al-Fitr" },
      { date: "2025-06-06", name: "Fiesta del Eid al-Adha" },
    ],
  },
  canaryIslands: {
    "tenerife": { date: "2025-02-03", name: "Virgen de la Candelaria" }, // Feb 2 is Sunday
    "gran-canaria": { date: "2025-09-08", name: "Nuestra Señora del Pino" },
    "fuerteventura": { date: "2025-09-20", name: "Nuestra Señora de la Peña" },
    "lanzarote": { date: "2025-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-graciosa": { date: "2025-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-palma": { date: "2025-08-05", name: "Nuestra Señora de Las Nieves" },
    "la-gomera": { date: "2025-10-06", name: "Nuestra Señora de Guadalupe" },
    "el-hierro": { date: "2025-09-24", name: "Nuestra Señora de los Reyes" },
  },
  canaryIslandsSource: "BOC 2024/187", // https://www.gobiernodecanarias.org/boc/2024/187/3013.html
};

const HOLIDAY_DATA_2026: RegionalHolidayData = {
  source: "BOE-A-2025-21667",
  verified: "verified",
  national: {
    // 2026: Jueves Santo excluded for Cataluña and Comunitat Valenciana
    // Per BOE-A-2025-21667 annex: all territories have ** except Cataluña and C.Valenciana (blank)
    juevessanto: allExcept("cataluna", "comunitat-valenciana"),
    // Nov 1 (Sunday) → Nov 2; Dec 6 (Sunday) → Dec 7
    // Per BOE-A-2025-21667 annex (verified from PDF):
    // Nov 2: Andalucía, Aragón, Asturias, Canarias, Castilla-La Mancha, Castilla y León, Extremadura, Com. Madrid (8 territories)
    // Dec 7: Andalucía, Aragón, Asturias, Cantabria, Castilla y León, Extremadura, Com. Madrid, Región de Murcia, La Rioja, Melilla (10 territories)
    mondaySubstitutions: {
      "2026-11-02": ["andalucia", "aragon", "asturias", "canarias", "castilla-la-mancha", "castilla-y-leon", "extremadura", "comunidad-de-madrid"],
      "2026-12-07": ["andalucia", "aragon", "asturias", "cantabria", "castilla-y-leon", "extremadura", "comunidad-de-madrid", "region-de-murcia", "la-rioja", "melilla"],
    },
  },
  regional: {
    "andalucia": [{ date: "2026-02-28", name: "Día de Andalucía" }],
    "aragon": [{ date: "2026-04-23", name: "San Jorge / Día de Aragón" }],
    "asturias": [{ date: "2026-09-08", name: "Día de Asturias" }],
    "illes-balears": [
      { date: "2026-03-01", name: "Día de les Illes Balears", observanceDate: "2026-03-01" },
      { date: "2026-03-02", name: "Lunes siguiente al Día de les Illes Balears" },
      { date: "2026-04-06", name: "Lunes de Pascua" },
      { date: "2026-12-26", name: "San Esteban" },
    ],
    "canarias": [{ date: "2026-05-30", name: "Día de Canarias" }],
    "cantabria": [{ date: "2026-07-28", name: "Día de las Instituciones de Cantabria" }],
    "castilla-la-mancha": [
      { date: "2026-05-31", name: "Día de Castilla-La Mancha" },
      { date: "2026-06-04", name: "Corpus Christi" },
    ],
    "castilla-y-leon": [{ date: "2026-04-23", name: "Fiesta de Castilla y León" }],
    "cataluna": [
      { date: "2026-04-06", name: "Lunes de Pascua" },
      { date: "2026-06-24", name: "San Juan" },
      { date: "2026-09-11", name: "Fiesta Nacional de Cataluña" },
      { date: "2026-12-26", name: "Sant Esteve" },
    ],
    "comunitat-valenciana": [
      { date: "2026-03-19", name: "San José" },
      { date: "2026-10-09", name: "Día de la Comunitat Valenciana" },
    ],
    "extremadura": [{ date: "2026-09-08", name: "Día de Extremadura" }],
    "galicia": [
      { date: "2026-05-17", name: "Día de las Letras Gallegas" },
      { date: "2026-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [{ date: "2026-05-02", name: "Fiesta de la Comunidad de Madrid" }],
    "region-de-murcia": [{ date: "2026-06-09", name: "Día de la Región de Murcia" }],
    "navarra": [
      { date: "2026-03-19", name: "San José" },
      { date: "2026-12-03", name: "San Francisco Javier" },
    ],
    "pais-vasco": [
      { date: "2026-03-19", name: "San José" },
      { date: "2026-10-25", name: "Día del País Vasco / Euskadi Eguna" },
    ],
    "la-rioja": [{ date: "2026-06-09", name: "Día de La Rioja" }],
    "ceuta": [{ date: "2026-09-02", name: "Día de Ceuta" }],
    "melilla": [{ date: "2026-09-17", name: "Día de Melilla" }],
  },
  islamic: {
    ceuta: [
      { date: "2026-03-20", name: "Fiesta del Eid al-Fitr" },
      { date: "2026-05-27", name: "Fiesta del Eid al-Adha" },
    ],
    melilla: [
      { date: "2026-03-20", name: "Fiesta del Eid al-Fitr" },
      { date: "2026-05-27", name: "Fiesta del Eid al-Adha" },
    ],
  },
  canaryIslands: {
    "el-hierro": { date: "2026-09-24", name: "Nuestra Señora de los Reyes" },
    "fuerteventura": { date: "2026-09-18", name: "Nuestra Señora de la Peña" },
    "gran-canaria": { date: "2026-09-08", name: "Nuestra Señora del Pino" },
    "la-gomera": { date: "2026-10-05", name: "Nuestra Señora de Guadalupe" },
    "la-graciosa": { date: "2026-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-palma": { date: "2026-08-05", name: "Nuestra Señora de Las Nieves" },
    "lanzarote": { date: "2026-09-15", name: "Nuestra Señora de los Volcanes" },
    "tenerife": { date: "2026-02-02", name: "Virgen de la Candelaria" },
  },
  canaryIslandsSource: "Decreto 61/2025, BOC 2025/88", // https://www.gobiernodecanarias.org/boc/archivo/2025/088/
};

const HOLIDAY_DATA_2027: RegionalHolidayData = {
  source: "BOE-A-2026-21254",
  verified: "verified",
  national: {
    juevessanto: allExcept("cataluna"),
    // Aug 15 (Sunday) → Aug 16 for some territories
    mondaySubstitutions: {
      "2027-08-16": ["andalucia", "aragon", "asturias", "canarias", "castilla-y-leon", "comunidad-de-madrid"],
    },
  },
  regional: {
    "andalucia": [
      { date: "2027-02-28", name: "Día de Andalucía", observanceDate: "2027-02-28" },
      { date: "2027-03-01", name: "Lunes siguiente al Día de Andalucía" },
    ],
    "aragon": [{ date: "2027-04-23", name: "San Jorge / Día de Aragón" }],
    "asturias": [{ date: "2027-09-08", name: "Día de Asturias" }],
    "illes-balears": [
      { date: "2027-03-01", name: "Día de les Illes Balears" },
      { date: "2027-03-29", name: "Lunes de Pascua" },
      { date: "2027-12-26", name: "San Esteban" },
    ],
    "canarias": [{ date: "2027-05-30", name: "Día de Canarias" }],
    "cantabria": [
      { date: "2027-07-28", name: "Día de las Instituciones de Cantabria" },
      { date: "2027-09-15", name: "La Bien Aparecida" },
    ],
    "castilla-la-mancha": [
      { date: "2027-05-27", name: "Corpus Christi" },
      { date: "2027-05-31", name: "Día de Castilla-La Mancha" },
    ],
    "castilla-y-leon": [{ date: "2027-04-23", name: "Fiesta de Castilla y León" }],
    "cataluna": [
      { date: "2027-03-29", name: "Lunes de Pascua" },
      { date: "2027-06-24", name: "San Juan" },
      { date: "2027-09-11", name: "Fiesta Nacional de Cataluña" },
      { date: "2027-12-26", name: "Sant Esteve" },
    ],
    "comunitat-valenciana": [
      { date: "2027-03-19", name: "San José" },
      { date: "2027-10-09", name: "Día de la Comunitat Valenciana" },
      { date: "2027-10-11", name: "Sustitución del 15 de agosto" },
    ],
    "extremadura": [{ date: "2027-09-08", name: "Día de Extremadura" }],
    "galicia": [
      { date: "2027-05-17", name: "Día de las Letras Gallegas" },
      { date: "2027-07-25", name: "Santiago Apóstol" },
    ],
    "comunidad-de-madrid": [{ date: "2027-05-02", name: "Fiesta de la Comunidad de Madrid" }],
    "region-de-murcia": [{ date: "2027-06-09", name: "Día de la Región de Murcia" }],
    "navarra": [
      { date: "2027-03-19", name: "San José" },
      { date: "2027-10-11", name: "Sustitución del 15 de agosto" },
      { date: "2027-12-03", name: "San Francisco Javier" },
    ],
    "pais-vasco": [
      { date: "2027-03-19", name: "San José" },
      { date: "2027-10-07", name: "Aniversario 1er Gobierno Euskadi" },
    ],
    "la-rioja": [{ date: "2027-06-09", name: "Día de La Rioja" }],
    "ceuta": [
      { date: "2027-08-05", name: "Nuestra Señora de África" },
      { date: "2027-09-02", name: "Día de Ceuta" },
    ],
    "melilla": [{ date: "2027-09-17", name: "Día de Melilla" }],
  },
  islamic: {
    // 2027: Eid al-Fitr only in Melilla (10 March), Eid al-Adha in both cities
    ceuta: [
      { date: "2027-05-17", name: "Fiesta del Eid al-Adha" },
    ],
    melilla: [
      { date: "2027-03-10", name: "Fiesta del Eid al-Fitr" },
      { date: "2027-05-17", name: "Fiesta del Eid al-Adha" },
    ],
  },
  canaryIslands: {
    "el-hierro": { date: "2027-09-24", name: "Nuestra Señora de los Reyes" },
    "fuerteventura": { date: "2027-09-17", name: "Nuestra Señora de la Peña" },
    "gran-canaria": { date: "2027-09-08", name: "Nuestra Señora del Pino" },
    "la-gomera": { date: "2027-10-04", name: "Nuestra Señora de Guadalupe" },
    "la-graciosa": { date: "2027-09-15", name: "Nuestra Señora de los Volcanes" },
    "la-palma": { date: "2027-08-05", name: "Nuestra Señora de Las Nieves" },
    "lanzarote": { date: "2027-09-15", name: "Nuestra Señora de los Volcanes" },
    "tenerife": { date: "2027-02-02", name: "Virgen de la Candelaria" },
  },
  canaryIslandsSource: "Decreto 73/2026, BOC 2026/202", // https://www.gobiernodecanarias.org/boc/archivo/2026/202/
};

// ============================================================================
// PROJECTED HOLIDAY DATA FOR FUTURE YEARS (2028-2035)
// Status: "projected" - dates calculated but pending official BOE publication
// BOE typically publishes calendars in October of the preceding year
// ============================================================================

/**
 * Generate projected regional data for unpublished years.
 * Uses typical patterns but marks as "projected" status.
 * Regional details will be filled when BOE publishes.
 */
function generateProjectedData(year: number): RegionalHolidayData {
  // Most regions have Jueves Santo except Cataluña (and sometimes C. Valenciana)
  // This is a projection based on historical patterns
  return {
    source: "Pendiente de publicación oficial",
    verified: "projected",
    national: {
      juevessanto: allExcept("cataluna"), // Historical default
      mondaySubstitutions: {}, // Will be determined by BOE
    },
    regional: {
      // Core regional holidays that rarely change
      "andalucia": [{ date: `${year}-02-28`, name: "Día de Andalucía" }],
      "aragon": [{ date: `${year}-04-23`, name: "San Jorge / Día de Aragón" }],
      "asturias": [{ date: `${year}-09-08`, name: "Día de Asturias" }],
      "illes-balears": [], // Varies - Lunes de Pascua + others
      "canarias": [{ date: `${year}-05-30`, name: "Día de Canarias" }],
      "cantabria": [{ date: `${year}-07-28`, name: "Día de las Instituciones de Cantabria" }],
      "castilla-la-mancha": [], // Corpus varies
      "castilla-y-leon": [{ date: `${year}-04-23`, name: "Fiesta de Castilla y León" }],
      "cataluna": [], // Varies significantly
      "comunitat-valenciana": [], // San José + Lunes de Pascua + Oct 9 varies
      "extremadura": [{ date: `${year}-09-08`, name: "Día de Extremadura" }],
      "galicia": [
        { date: `${year}-05-17`, name: "Día de las Letras Gallegas" },
        { date: `${year}-07-25`, name: "Santiago Apóstol" },
      ],
      "comunidad-de-madrid": [{ date: `${year}-05-02`, name: "Fiesta de la Comunidad de Madrid" }],
      "region-de-murcia": [{ date: `${year}-06-09`, name: "Día de la Región de Murcia" }],
      "navarra": [], // San Javier + San José varies
      "pais-vasco": [], // Varies
      "la-rioja": [{ date: `${year}-06-09`, name: "Día de La Rioja" }],
      "ceuta": [{ date: `${year}-09-02`, name: "Día de Ceuta" }],
      "melilla": [{ date: `${year}-09-17`, name: "Día de Melilla" }],
    },
    islamic: {
      // Islamic holidays shift ~11 days earlier each Gregorian year
      // These are projections and must be verified when published
      ceuta: [],
      melilla: [],
    },
    // Canary Islands patron feasts - dates are fixed but Sunday transfers vary
    canaryIslands: undefined,
  };
}

const HOLIDAY_DATA: Record<number, RegionalHolidayData> = {
  2020: HOLIDAY_DATA_2020,
  2021: HOLIDAY_DATA_2021,
  2022: HOLIDAY_DATA_2022,
  2023: HOLIDAY_DATA_2023,
  2024: HOLIDAY_DATA_2024,
  2025: HOLIDAY_DATA_2025,
  2026: HOLIDAY_DATA_2026,
  2027: HOLIDAY_DATA_2027,
  // Projected years - generated on demand but stored for consistency
  2028: generateProjectedData(2028),
  2029: generateProjectedData(2029),
  2030: generateProjectedData(2030),
  2031: generateProjectedData(2031),
  2032: generateProjectedData(2032),
  2033: generateProjectedData(2033),
  2034: generateProjectedData(2034),
  2035: generateProjectedData(2035),
};

// ============================================================================
// HOLIDAY FUNCTIONS
// ============================================================================

/**
 * Returns national holidays for a year (basic set without regional filtering).
 */
export function nationalHolidaysForYear(year: number): Holiday[] {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return [];

  const holidays: Holiday[] = [];
  const data = HOLIDAY_DATA[year];
  const isVerified = data?.verified === "verified";

  // Fixed national holidays
  for (const { month, day, name } of NATIONAL_FIXED_DATES) {
    const date = dateString(year, month, day);
    const dow = dayOfWeek(date);

    if (dow === 0) {
      // Sunday - add observance and Monday off
      holidays.push({ date, name, scope: "national", type: "observance" });
      holidays.push({
        date: addDays(date, 1),
        name: `Lunes siguiente a ${name}`,
        scope: "national",
        type: "day_off",
        observanceDate: date,
      });
    } else {
      holidays.push({ date, name, scope: "national", type: "day_off" });
    }
  }

  // Substitutable national holidays
  for (const { month, day, name } of NATIONAL_SUBSTITUTABLE_DATES) {
    const date = dateString(year, month, day);
    const dow = dayOfWeek(date);

    if (dow === 0) {
      holidays.push({ date, name, scope: "national", type: "observance" });
      const mondayDate = addDays(date, 1);

      if (data?.national.mondaySubstitutions[mondayDate]) {
        holidays.push({
          date: mondayDate,
          name: `Lunes siguiente a ${name}`,
          scope: "national",
          type: "day_off",
          observanceDate: date,
          territories: data.national.mondaySubstitutions[mondayDate],
        });
      } else {
        holidays.push({
          date: mondayDate,
          name: `Lunes siguiente a ${name}`,
          scope: "national",
          type: "day_off",
          observanceDate: date,
          verified: isVerified ? "verified" : "projected",
        });
      }
    } else {
      holidays.push({ date, name, scope: "national", type: "day_off" });
    }
  }

  // Good Friday - national everywhere
  const gf = goodFriday(year);
  holidays.push({
    date: dateFromDate(gf),
    name: "Viernes Santo",
    scope: "national",
    type: "day_off",
  });

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Returns all holidays for a year, optionally filtered by territory.
 */
export function holidaysForYearAndTerritory(
  year: number,
  territory?: TerritorySlug
): Holiday[] {
  if (!Number.isInteger(year) || year < 2020 || year > 2035) return [];

  const holidays: Holiday[] = [];
  const data = HOLIDAY_DATA[year];
  const isVerified = data?.verified === "verified";

  // 1. Fixed national holidays
  for (const { month, day, name } of NATIONAL_FIXED_DATES) {
    const date = dateString(year, month, day);
    const dow = dayOfWeek(date);

    if (dow === 0) {
      holidays.push({ date, name, scope: "national", type: "observance" });
      holidays.push({
        date: addDays(date, 1),
        name: `Lunes siguiente a ${name}`,
        scope: "national",
        type: "day_off",
        observanceDate: date,
      });
    } else {
      holidays.push({ date, name, scope: "national", type: "day_off" });
    }
  }

  // 2. Substitutable national holidays
  for (const { month, day, name } of NATIONAL_SUBSTITUTABLE_DATES) {
    const date = dateString(year, month, day);
    const dow = dayOfWeek(date);

    if (dow === 0) {
      holidays.push({ date, name, scope: "national", type: "observance" });
      const mondayDate = addDays(date, 1);

      if (data?.national.mondaySubstitutions[mondayDate]) {
        const territories = data.national.mondaySubstitutions[mondayDate];
        if (!territory || territories.includes(territory)) {
          holidays.push({
            date: mondayDate,
            name: `Lunes siguiente a ${name}`,
            scope: "national",
            type: "day_off",
            observanceDate: date,
            territories,
          });
        }
      } else {
        holidays.push({
          date: mondayDate,
          name: `Lunes siguiente a ${name}`,
          scope: "national",
          type: "day_off",
          observanceDate: date,
        });
      }
    } else {
      holidays.push({ date, name, scope: "national", type: "day_off" });
    }
  }

  // 3. Good Friday - national everywhere
  const gf = goodFriday(year);
  holidays.push({
    date: dateFromDate(gf),
    name: "Viernes Santo",
    scope: "national",
    type: "day_off",
  });

  // 4. Jueves Santo (varies by territory)
  if (data) {
    const mt = maundyThursday(year);
    if (!territory || data.national.juevessanto.includes(territory)) {
      holidays.push({
        date: dateFromDate(mt),
        name: "Jueves Santo",
        scope: "regional",
        type: "day_off",
        territories: data.national.juevessanto,
        verified: isVerified ? "verified" : "projected",
      });
    }
  }

  // 5. Regional holidays
  if (data && territory && data.regional[territory]) {
    for (const h of data.regional[territory]) {
      holidays.push({
        date: h.date,
        name: h.name,
        scope: "regional",
        type: h.observanceDate ? "observance" : "day_off",
        observanceDate: h.observanceDate,
        verified: isVerified ? "verified" : "projected",
        source: data.source,
      });
    }
  }

  // 6. Islamic holidays for Ceuta and Melilla
  if (data && territory === "ceuta") {
    for (const h of data.islamic.ceuta) {
      holidays.push({
        date: h.date,
        name: h.name,
        scope: "regional",
        type: "day_off",
        verified: isVerified ? "verified" : "projected",
        source: data.source,
      });
    }
  }
  if (data && territory === "melilla") {
    for (const h of data.islamic.melilla) {
      holidays.push({
        date: h.date,
        name: h.name,
        scope: "regional",
        type: "day_off",
        verified: isVerified ? "verified" : "projected",
        source: data.source,
      });
    }
  }

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Count days off for a year and territory.
 */
export function countDaysOff(year: number, territory?: TerritorySlug): number {
  const holidays = holidaysForYearAndTerritory(year, territory);
  return holidays.filter(h => h.type === "day_off").length;
}

/**
 * Legacy export for backward compatibility.
 */
export const holidays: Holiday[] = Array.from({ length: 16 }, (_, index) =>
  nationalHolidaysForYear(2020 + index),
).flat();

/**
 * Check if a year has verified BOE data.
 */
export function hasVerifiedData(year: number): boolean {
  return year in HOLIDAY_DATA && HOLIDAY_DATA[year].verified === "verified";
}

/**
 * Get the BOE source for a year.
 */
export function getSource(year: number): string | undefined {
  return HOLIDAY_DATA[year]?.source;
}

/**
 * Get Canary Islands island-specific holidays.
 */
export function getCanaryIslandHolidays(year: number): Record<string, { date: string; name: string }> | undefined {
  return HOLIDAY_DATA[year]?.canaryIslands;
}

/**
 * Get Canary Islands BOC source reference.
 */
export function getCanaryIslandsSource(year: number): string | undefined {
  return HOLIDAY_DATA[year]?.canaryIslandsSource;
}

/**
 * Get verification status for a year.
 */
export function getVerificationStatus(year: number): VerificationStatus {
  const data = HOLIDAY_DATA[year];
  if (!data) return "pending";
  return data.verified;
}

/**
 * Check if year's calendar is officially published.
 * Returns false for projected/pending years.
 */
export function isOfficiallyPublished(year: number): boolean {
  return hasVerifiedData(year);
}

/**
 * Get workday count for a year and territory.
 * Excludes weekends and holidays.
 * Returns { total, provisional } where provisional indicates pending local holidays.
 */
export function getWorkdayCount(
  year: number,
  territory?: TerritorySlug,
  municipalityCode?: string
): { total: number; provisional: boolean; note?: string } {
  // Calculate total days in year
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;

  // Count weekend days
  let weekendDays = 0;
  for (let d = 0; d < totalDays; d++) {
    const date = new Date(year, 0, 1 + d);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) weekendDays++;
  }

  // Get holidays (excluding observances which fall on Sunday)
  const holidays = holidaysForYearAndTerritory(year, territory);
  const holidayDates = new Set<string>();
  for (const h of holidays) {
    if (h.type === "day_off") {
      // Check if not a weekend
      const dow = dayOfWeek(h.date);
      if (dow !== 0 && dow !== 6) {
        holidayDates.add(h.date);
      }
    }
  }

  // Calculate workdays
  const workdays = totalDays - weekendDays - holidayDates.size;

  // Determine if provisional (missing local holidays or unpublished year)
  const isVerified = hasVerifiedData(year);
  const hasMunicipalHolidays = municipalityCode
    ? getMunicipalHolidayStatus(municipalityCode, year) === "verified"
    : false;

  const provisional = !isVerified || (!!municipalityCode && !hasMunicipalHolidays);

  let note: string | undefined;
  if (!isVerified) {
    note = "Pendiente de publicación oficial";
  } else if (municipalityCode && !hasMunicipalHolidays) {
    note = "Festivos locales pendientes de verificación";
  } else if (!municipalityCode) {
    note = "Sin incluir los 2 festivos locales del municipio";
  }

  return { total: workdays, provisional, note };
}
