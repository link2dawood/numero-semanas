import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import WeeksYearContent, {
  getMadridToday,
  weekYearMetadata,
} from "@/components/pages/WeeksYearContent";

type YearPageProps = { params: Promise<{ year: string }> };

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: 16 }, (_, index) => ({
    year: String(2020 + index),
  }));
}

export async function generateMetadata({
  params,
}: YearPageProps): Promise<Metadata> {
  const { year: yearText } = await params;
  const year = Number(yearText);
  if (!Number.isInteger(year) || year < 2020 || year > 2035) return {};
  return weekYearMetadata(year);
}

export default async function WeeksYearPage({ params }: YearPageProps) {
  const { year: yearText } = await params;
  const year = Number(yearText);
  if (!Number.isInteger(year) || year < 2020 || year > 2035) notFound();
  if (year === 2026) permanentRedirect("/semanas-2026");
  return <WeeksYearContent year={year} today={getMadridToday()} />;
}
