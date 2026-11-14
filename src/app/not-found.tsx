import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada | NumeroSemanas",
  description: "La página que buscas no existe o ha cambiado de dirección.",
  // Next.js already emits <meta name="robots" content="noindex"> and a 404 status.
};

const suggestions = [
  { label: "Semanas de 2026", href: "/semanas-2026" },
  { label: "Calendario 2027", href: "/calendario-2027" },
  { label: "Qué es el número de semana", href: "/numeros-de-semana" },
  { label: "Semanas pares e impares", href: "/semanas-pares-e-impares" },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-center px-4 py-16 sm:px-5">
      <section className="max-w-2xl rounded-3xl border border-border bg-card p-8 sm:p-12">
        <p className="m-0 text-sm font-semibold uppercase tracking-wide text-olive">
          Error 404
        </p>
        <h1 className="mb-4 mt-3 font-heading text-4xl font-bold">
          Página no encontrada
        </h1>
        <p className="m-0 leading-relaxed text-muted">
          La página que buscas no existe o ha cambiado de dirección. Puedes
          consultar la semana actual o visitar alguna de estas secciones.
        </p>
        <ul className="mb-0 mt-5 flex flex-col gap-2 pl-5">
          {suggestions.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-semibold text-olive-dark">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-olive-dark px-5 font-semibold text-white no-underline"
        >
          Ver semana actual
        </Link>
      </section>
    </main>
  );
}
