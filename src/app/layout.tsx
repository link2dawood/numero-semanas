import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SiteChrome from "@/components/SiteChrome";
import { SITE_URL } from "@/lib/site";
import { isoWeek, parseIsoDate } from "@/lib/weeks";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NumeroSemanas – Semana actual",
  description:
    "Consulta el número de semana actual en España, explora calendarios ISO, festivos y semanas pares o impares.",
  other: {
    google: "notranslate",
  },
};

function todayInMadrid(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return parseIsoDate(`${values.year}-${values.month}-${values.day}`)!;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const today = todayInMadrid();
  const { week, year: weekYear } = isoWeek(today);
  const year = today.getFullYear();

  return (
    <html lang="es-ES" translate="no" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <SiteChrome>
          <Header week={week} weekYear={weekYear} />
        </SiteChrome>
        {children}
        <SiteChrome>
          <Footer year={year} />
          <CookieConsent />
        </SiteChrome>
      </body>
    </html>
  );
}
