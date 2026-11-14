import { nationalHolidaysForYear } from "./holidays";

export type PaymentMonth = {
  month: number;
  nominalDate: Date;
  paymentDate: Date;
};

export function moveToPreviousWorkingDay(
  date: Date,
  holidays: readonly string[] = [],
): Date {
  const holidayDates = new Set(holidays);
  const adjusted = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  while (
    adjusted.getDay() === 0 ||
    adjusted.getDay() === 6 ||
    holidayDates.has(dateKey(adjusted))
  ) {
    adjusted.setDate(adjusted.getDate() - 1);
  }
  return adjusted;
}

export function paymentDatesForYear(
  year: number,
  nominalDay: number,
): PaymentMonth[] {
  if (
    !Number.isInteger(year) ||
    year < 1 ||
    year > 9999 ||
    !Number.isInteger(nominalDay) ||
    nominalDay < 1 ||
    nominalDay > 31
  ) {
    return [];
  }
  const holidays = nationalHolidaysForYear(year).map(({ date }) => date);
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const lastDate = new Date(year, month, 0).getDate();
    const nominalDate = new Date(year, index, Math.min(nominalDay, lastDate));
    return {
      month,
      nominalDate,
      paymentDate: moveToPreviousWorkingDay(nominalDate, holidays),
    };
  });
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
