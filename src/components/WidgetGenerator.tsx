"use client";

import { useState } from "react";

export default function WidgetGenerator() {
  const [size, setSize] = useState("medium");
  const [theme, setTheme] = useState("olive");
  const [language, setLanguage] = useState("es");
  const [copied, setCopied] = useState(false);
  const query = new URLSearchParams({ size, theme, lang: language }).toString();
  const url = `/widget?${query}`;
  const code = `<iframe src="https://numerosemanas.es${url}" title="Número de semana ISO" width="${size === "small" ? 220 : 320}" height="150" loading="lazy"></iframe>`;

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="widget-config-heading">
      <h2 id="widget-config-heading" className="m-0 font-heading text-2xl font-bold">
        Configura el widget
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2 font-semibold">
          Tamaño
          <select
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="min-h-11 rounded-xl border border-border bg-card px-3"
          >
            <option value="small">Compacto</option>
            <option value="medium">Mediano</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 font-semibold">
          Tema
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            className="min-h-11 rounded-xl border border-border bg-card px-3"
          >
            <option value="olive">Oliva</option>
            <option value="light">Claro</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 font-semibold">
          Idioma
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="min-h-11 rounded-xl border border-border bg-card px-3"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
      <iframe
        src={url}
        title="Previsualización del widget del número de semana"
        width={size === "small" ? 220 : 320}
        height="150"
        className="max-w-full rounded-2xl border border-border bg-card"
      />
      <div className="flex flex-col gap-3">
        <label htmlFor="widget-embed" className="font-semibold">
          Código para insertar
        </label>
        <textarea
          id="widget-embed"
          readOnly
          value={code}
          rows={3}
          className="w-full rounded-xl border border-border bg-card p-3 font-mono text-sm"
        />
        <button
          type="button"
          onClick={copyCode}
          className="min-h-11 self-start rounded-full bg-olive-dark px-5 font-semibold text-white"
        >
          {copied ? "Código copiado" : "Copiar código"}
        </button>
      </div>
    </section>
  );
}
