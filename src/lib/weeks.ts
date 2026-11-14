const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const WEEKDAYS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export type IsoWeek = { week: number; year: number };

export function isoWeek(date: Date): IsoWeek {
  const thursday = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const weekday = thursday.getUTCDay() || 7;
  thursday.setUTCDate(thursday.getUTCDate() + 4 - weekday);
  const year = thursday.getUTCFullYear();
  const week = Math.ceil(
    ((thursday.getTime() - Date.UTC(year, 0, 1)) / 86_400_000 + 1) / 7,
  );
  return { week, year };
}

export function weeksInYear(year: number): number {
  return isoWeek(new Date(year, 11, 28)).week;
}

export function addDays(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount,
  );
}

export function mondayOf(date: Date): Date {
  return addDays(date, -((date.getDay() + 6) % 7));
}

export function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function dayOfYear(date: Date): number {
  return (
    Math.round(
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 1)) /
        86_400_000,
    ) + 1
  );
}

export function yearProgressPct(date: Date): number {
  const yearDays = isLeapYear(date.getFullYear()) ? 366 : 365;
  return Math.round((dayOfYear(date) / yearDays) * 100);
}

export function isEven(week: number): boolean {
  return week % 2 === 0;
}

export function formatLong(date: Date): string {
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatShort(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export function weekdayName(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function dateToIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return dateToIso(parsed) === value ? parsed : null;
}

export function calendarDayDifference(first: Date, second: Date): number {
  const firstUtc = Date.UTC(
    first.getFullYear(),
    first.getMonth(),
    first.getDate(),
  );
  const secondUtc = Date.UTC(
    second.getFullYear(),
    second.getMonth(),
    second.getDate(),
  );
  return Math.round((secondUtc - firstUtc) / 86_400_000);
}

export function isoWeeksForYear(year: number): Date[] {
  const weekCount = weeksInYear(year);
  const firstMonday = mondayOf(new Date(year, 0, 4));
  return Array.from({ length: weekCount }, (_, index) =>
    addDays(firstMonday, index * 7),
  );
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
