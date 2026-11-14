import { NextResponse } from "next/server";
import { parseIsoDate, isoWeek } from "@/lib/weeks";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

export async function GET(request: Request) {
  const dateValue = new URL(request.url).searchParams.get("fecha");
  const date = parseIsoDate(dateValue);
  if (!date) {
    return NextResponse.json(
      { error: "Indica una fecha válida con el formato YYYY-MM-DD." },
      { status: 400, headers: { ...corsHeaders, "Cache-Control": "no-store" } },
    );
  }
  const { week, year } = isoWeek(date);
  return NextResponse.json(
    { fecha: dateValue, semana: week, anio: year, sistema: "ISO 8601" },
    { headers: corsHeaders },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
