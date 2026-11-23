import Link from "next/link";

export default function Apps() {
  return (
    <section className="space-y-4">
      <h3 className="text-center font-serif text-2xl font-bold text-[#141E16] sm:text-left">
        El número de semana también en tu navegador y tu móvil
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Chrome Extension Card (Dark Green) */}
        <div className="flex flex-col justify-between rounded-3xl bg-[#1E2B20] p-6 text-white shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] sm:p-8">
          <div>
            <span className="rounded-full bg-[#2A3C2D] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-300">
              EXTENSIÓN DE CHROME
            </span>
            <h4 className="mb-2 mt-4 font-serif text-xl font-bold text-white">
              El número de semana siempre en tu barra
            </h4>
            <p className="text-sm font-normal leading-relaxed text-stone-300">
              Consulta la semana actual de un vistazo, sin abrir una pestaña nueva.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#2A3C2D] pt-4">
            <Link
              href="/extension-chrome"
              className="flex items-center gap-2 rounded-xl bg-[#F7F5EE] px-4 py-2.5 text-sm font-bold text-[#141E16] transition hover:bg-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c1.3 0 2.52.31 3.6.86L12 12l-7.29.01A8.001 8.001 0 0112 4zm0 16c-4.41 0-8-3.59-8-8h8l3.6 6.86C14.52 19.69 13.3 20 12 20zm7.29-5.99L16 12l3.6-6.86A8.001 8.001 0 0119.29 14.01z"/>
              </svg>
              Añadir a Chrome — gratis
            </Link>
            <Link
              href="/extension-chrome"
              className="flex items-center gap-1.5 text-sm font-semibold text-stone-300 transition hover:text-white"
            >
              Más sobre la extensión
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Android App Card (Soft Sage / Olive Card) */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#CCD8C8] bg-[#E4ECE1] p-6 text-[#141E16] shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] sm:p-8">
          <div>
            <span className="rounded-full bg-[#D3E0CE] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E2B20]">
              APP PARA ANDROID
            </span>
            <h4 className="mb-2 mt-4 font-serif text-xl font-bold text-[#141E16]">
              Semanas, calendario y 7 widgets
            </h4>
            <p className="text-sm font-normal leading-relaxed text-stone-700">
              El número de semana en tu pantalla de inicio, con festivos y
              calendario siempre a mano.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#D5E1D1] pt-4">
            <Link
              href="/app-android"
              className="flex items-center gap-2 rounded-xl bg-[#1E2B20] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2A3C2D]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5S6 2.67 6 3.5v17c0 .83-.67 1.5-1.5 1.5S3 21.33 3 20.5zm15 0v-17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5zm-6.47-5.68l3.56-6.17c.24-.41.08-.94-.33-1.17a.868.868 0 00-1.17.33l-3.59 6.22-3.59-6.22a.868.868 0 00-1.17-.33c-.41.24-.56.76-.33 1.17l3.56 6.17-3.56 6.17c-.24.41-.08.94.33 1.17.14.08.29.11.42.11.3 0 .59-.15.75-.44l3.59-6.22 3.59 6.22c.16.29.45.44.75.44.14 0 .29-.04.42-.11.41-.24.56-.76.33-1.17l-3.56-6.17z"/>
              </svg>
              Descargar en Google Play
            </Link>
            <Link
              href="/app-android"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1E2B20] transition hover:text-[#3D5441]"
            >
              Más sobre la app
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
