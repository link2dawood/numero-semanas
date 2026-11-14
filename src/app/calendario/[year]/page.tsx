import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CalendarYearContent, {
  calendarYearMetadata,
} from "@/components/pages/CalendarYearContent";
import { getMadridToday } from "@/components/pages/WeeksYearContent";
import { dateToIso } from "@/lib/weeks";

type CalendarPageProps = { params: Promise<{ year: string }> };

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: 16 }, (_, index) => ({
    year: String(2020 + index),
  }));
}

export async function generateMetadata({
  params,
}: CalendarPageProps): Promise<Metadata> {
  const { year: yearText } = await params;
  const year = Number(yearText);
  if (!Number.isInteger(year) || year < 2020 || year > 2035) return {};
  return calendarYearMetadata(year);
}

export default async function CalendarByYearPage({
  params,
}: CalendarPageProps) {
  const { year: yearText } = await params;
  const year = Number(yearText);
  if (!Number.isInteger(year) || year < 2020 || year > 2035) notFound();
  if (year === 2027) permanentRedirect("/calendario-2027");
  return (
    <CalendarYearContent
      year={year}
      today={dateToIso(getMadridToday())}
    />
  );
}
