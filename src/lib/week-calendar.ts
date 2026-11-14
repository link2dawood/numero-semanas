import { holidays } from "@/lib/holidays";
import {
  addDays,
  formatLong,
  isEven,
  isoWeek,
  isoWeeksForYear,
} from "@/lib/weeks";

export type WeekRow = {
  week: number;
  monday: Date;
  sunday: Date;
  parity: "par" | "impar";
  holidays: string[];
};

export function getWeekRows(year: number): WeekRow[] {
  return isoWeeksForYear(year).map((monday) => {
    const sunday = addDays(monday, 6);
    const week = isoWeek(monday).week;
    const holidayNames = holidays
      .filter((holiday) => holiday.date >= localIso(monday) && holiday.date <= localIso(sunday))
      .map((holiday) => `${holiday.name} · ${formatLong(parseLocal(holiday.date))}`);

    return {
      week,
      monday,
      sunday,
      parity: isEven(week) ? "par" : "impar",
      holidays: holidayNames,
    };
  });
}

function localIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseLocal(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
