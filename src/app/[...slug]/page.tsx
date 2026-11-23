import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FooterContentPage from "@/components/pages/FooterContentPage";
import { footerPages } from "@/lib/footer-pages";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { sunCities } from "@/lib/sun";

type SlugPageProps = {
  params: Promise<{ slug: string[] }>;
};

// Static (ISR): no request-time APIs are read here, so every footer and city
// page is prerendered and refreshed hourly. /widget, which reads its query
// string, lives in its own dynamic route (src/app/widget/page.tsx).
export const revalidate = 3600;

export function generateStaticParams() {
  return [
    ...Object.keys(footerPages).map((slug) => ({ slug: [slug] })),
    ...sunCities.map((city) => ({ slug: ["amanecer-atardecer", city.slug] })),
  ];
}

function resolvePage(slug: string[]) {
  const path = slug.join("/");
  if (slug.length === 1 && footerPages[path]) {
    return { key: path, title: footerPages[path].title };
  }
  if (slug.length === 2 && slug[0] === "amanecer-atardecer") {
    const city = sunCities.find((item) => item.slug === slug[1]);
    if (city) {
      return {
        key: path,
        title: `Amanecer y atardecer en ${city.name}`,
        cityName: city.name,
      };
    }
  }
  return null;
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) return { title: "Página no encontrada | NumeroSemanas" };

  const details = footerPages[slug.join("/")] ?? footerPages[slug[0]];
  const title =
    details && !page.cityName
      ? details.metaTitle
      : withBrand(`Amanecer y atardecer hoy en ${page.cityName}`);
  const description =
    details && !page.cityName
      ? details.description
      : fitLength(140, 160, [
          `Hora de amanecer y atardecer hoy en ${page.cityName} y tabla de los próximos 12 meses, calculadas con el algoritmo solar de la NOAA para su zona horaria local.`,
          `Hora de amanecer y atardecer hoy en ${page.cityName} y tabla de los próximos 12 meses, calculadas con el algoritmo solar de la NOAA para su hora local.`,
          `Hora de amanecer y atardecer hoy en ${page.cityName} y tabla de los próximos 12 meses, calculadas con el algoritmo NOAA para su hora local.`,
        ]);
  const canonical = `/${slug.join("/")}`;

  return {
    title,
    description,
    // Single-language site: no hreflang alternates needed.
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: canonical,
      title,
      description,
      siteName: "NumeroSemanas",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function FooterSlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) notFound();
  return <FooterContentPage slug={page.key} />;
}

/** Append the brand only while the title stays within ~60 characters. */
function withBrand(title: string): string {
  const branded = `${title} | NumeroSemanas`;
  return branded.length <= 60 ? branded : title;
}

/** First candidate whose length is within [min, max]; otherwise the shortest one. */
function fitLength(min: number, max: number, candidates: string[]): string {
  return (
    candidates.find(({ length }) => length >= min && length <= max) ??
    [...candidates].sort((first, second) => first.length - second.length)[0]
  );
}
