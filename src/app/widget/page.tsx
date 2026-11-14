import type { Metadata } from "next";
import { WeekWidget } from "@/components/pages/FooterContentPage";

// Bare iframe embed configured through its query string (?size, ?theme, ?lang),
// so it is rendered per request. Its landing page is /widget-numero-semana.
export const metadata: Metadata = {
  title: "Widget de semana ISO | NumeroSemanas",
  description: "Widget compacto con el número de semana ISO actual.",
  robots: { index: false, follow: false },
};

type WidgetPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WidgetPage({ searchParams }: WidgetPageProps) {
  const query = await searchParams;
  return (
    <WeekWidget
      options={{
        size: firstValue(query.size, "medium"),
        theme: firstValue(query.theme, "olive"),
        language: firstValue(query.lang, "es"),
      }}
    />
  );
}

function firstValue(value: string | string[] | undefined, fallback: string): string {
  return (Array.isArray(value) ? value[0] : value) ?? fallback;
}
