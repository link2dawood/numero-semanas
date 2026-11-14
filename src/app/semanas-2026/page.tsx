import type { Metadata } from "next";
import WeeksYearContent, {
  getMadridToday,
  weekYearMetadata,
} from "@/components/pages/WeeksYearContent";

export const revalidate = 3600;

export const metadata: Metadata = weekYearMetadata(2026);

export default function Weeks2026Page() {
  return <WeeksYearContent year={2026} today={getMadridToday()} />;
}
