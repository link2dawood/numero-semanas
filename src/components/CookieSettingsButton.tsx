"use client";

/** Reopens the cookie banner (CookieConsent listens for this event). */
export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className={className}
    >
      Configuración de cookies
    </button>
  );
}
