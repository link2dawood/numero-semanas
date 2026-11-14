import type { Metadata } from "next";
import CalendarYearContent, {
  calendarYearMetadata,
} from "@/components/pages/CalendarYearContent";
import { getMadridToday } from "@/components/pages/WeeksYearContent";
import { dateToIso } from "@/lib/weeks";

export const revalidate = 3600;

export const metadata: Metadata = calendarYearMetadata(2027);

export default function Calendar2027Page() {
  return (
    <CalendarYearContent year={2027} today={dateToIso(getMadridToday())} />
  );
}
