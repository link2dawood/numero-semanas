"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Consent = "accepted" | "necessary";

const consentKey = "numerosemanas-cookie-consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(consentKey);
    if (savedConsent === "accepted" || savedConsent === "necessary") {
      setConsent(savedConsent);
    }
    const reopen = () => setConsent(null);
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  // The initial gtag config records the landing page. App Router navigation
  // does not reload that script, so record subsequent client-side page views.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (consent !== "accepted" || !googleAnalyticsId) return;
    const analyticsWindow = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    };
    analyticsWindow.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [consent, googleAnalyticsId, pathname]);

  function chooseConsent(value: Consent) {
    window.localStorage.setItem(consentKey, value);
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && clarityId && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          src={`https://www.clarity.ms/tag/${clarityId}`}
        />
      )}
      {consent === "accepted" && googleAnalyticsId && (
        <>
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${googleAnalyticsId}', { anonymize_ip: true });`,
            }}
          />
        </>
      )}
      {consent === null && (
        <section
          aria-label="Preferencias de cookies"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-sm text-ink print:hidden sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="m-0 leading-relaxed">
            Usamos Microsoft Clarity y Google Analytics para mejorar el sitio.
            Elige si permites la analítica. Sin tu consentimiento no se carga
            ningún servicio de analítica y todas las herramientas siguen
            disponibles.{" "}
            <Link href="/politica-de-cookies" className="font-semibold underline">
              Política de cookies
            </Link>
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => chooseConsent("necessary")}
              className="min-h-11 rounded-full border border-border bg-card px-5 font-semibold text-ink hover:bg-panel"
            >
              Solo necesarias
            </button>
            <button
              type="button"
              onClick={() => chooseConsent("accepted")}
              className="min-h-11 rounded-full bg-[#1E2B20] px-5 font-semibold text-white hover:bg-[#2A3C2D]"
            >
              Permitir cookies de analítica
            </button>
          </div>
        </section>
      )}
    </>
  );
}
