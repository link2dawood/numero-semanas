import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";

export default function Apps() {
  return (
    <section aria-labelledby="s-apps" className="flex flex-col gap-5">
      <h2 id="s-apps" className="m-0 font-heading text-[32px] font-bold">
        El número de semana también en tu navegador y tu móvil
      </h2>
      <div className="flex flex-wrap gap-6">
        <article className="flex min-w-0 flex-[1_1_400px] flex-col gap-3.5 rounded-3xl bg-olive-dark p-6 text-white sm:p-8">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-mint">
            Extensión de Chrome
          </span>
          <h3 className="m-0 font-heading text-2xl font-bold">
            El número de semana siempre en tu barra
          </h3>
          <p className="m-0 text-[15px] leading-relaxed text-cream">
            Consulta la semana actual de un vistazo, sin abrir una pestaña nueva.
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <Link
              href="/extension-chrome"
              className="flex min-h-11 items-center rounded-full bg-tan px-5 text-[15px] font-bold text-ink no-underline hover:bg-cream"
            >
              Añadir a Chrome – gratis
            </Link>
            <Link
              href="/extension-chrome"
              className="flex min-h-11 items-center px-1 text-[15px] font-semibold text-white"
            >
              <span>Más sobre la extensión</span>
              <ArrowRightIcon className="ml-1 size-4" />
            </Link>
          </div>
        </article>
        <article className="flex min-w-0 flex-[1_1_400px] flex-col gap-3.5 rounded-3xl bg-mint p-6 text-ink sm:p-8">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-olive-dark">
            App para Android
          </span>
          <h3 className="m-0 font-heading text-2xl font-bold">
            Semanas, calendario y 7 widgets
          </h3>
          <p className="m-0 text-[15px] leading-relaxed">
            El número de semana en tu pantalla de inicio, con festivos y
            calendario siempre a mano.
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <Link
              href="/app-android"
              className="flex min-h-11 items-center rounded-full bg-olive-dark px-5 text-[15px] font-bold text-white no-underline hover:bg-olive"
            >
              Descargar en Google Play
            </Link>
            <Link
              href="/app-android"
              className="flex min-h-11 items-center px-1 text-[15px] font-semibold text-ink"
            >
              <span>Más sobre la app</span>
              <ArrowRightIcon className="ml-1 size-4" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
