export type Holiday = {
  date: string;
  name: string;
  scope: "national";
};

const NATIONAL_FIXED_DATES = [
  { month: 1, day: 1, name: "Año Nuevo" },
  { month: 1, day: 6, name: "Epifanía del Señor" },
  { month: 5, day: 1, name: "Fiesta del Trabajo" },
  { month: 8, day: 15, name: "Asunción de la Virgen" },
  { month: 10, day: 12, name: "Fiesta Nacional de España" },
  { month: 11, day: 1, name: "Todos los Santos" },
  { month: 12, day: 6, name: "Día de la Constitución" },
  { month: 12, day: 8, name: "Inmaculada Concepción" },
  { month: 12, day: 25, name: "Natividad del Señor" },
] as const;

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

export function nationalHolidaysForYear(year: number): Holiday[] {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return [];

  const holidays: Holiday[] = NATIONAL_FIXED_DATES.map(({ month, day, name }) => ({
    date: dateString(year, month, day),
    name,
    scope: "national",
  }));
  const goodFriday = easterSunday(year);
  goodFriday.setDate(goodFriday.getDate() - 2);
  holidays.push({
    date: dateString(
      goodFriday.getFullYear(),
      goodFriday.getMonth() + 1,
      goodFriday.getDate(),
    ),
    name: "Viernes Santo",
    scope: "national",
  });
  return holidays.sort((first, second) =>
    first.date.localeCompare(second.date),
  );
}

export const holidays: Holiday[] = Array.from({ length: 16 }, (_, index) =>
  nationalHolidaysForYear(2020 + index),
).flat();

function dateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
