import { NextResponse } from "next/server";
import { nationalHolidaysForYear } from "@/lib/holidays";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get("year");
  const year = value && /^\d{4}$/.test(value) ? Number(value) : NaN;
  const holidays = nationalHolidaysForYear(year);
  if (holidays.length === 0) {
    return NextResponse.json(
      { error: "Indica un año válido entre 2020 y 2035." },
      { status: 400, headers: { ...corsHeaders, "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    { year, festivos: holidays },
    { headers: corsHeaders },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
