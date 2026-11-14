import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";

type ParityAndIsoProps = {
  week: number;
  nextWeek: number;
  year: number;
  weeks: number;
};

export default function ParityAndIso({
  week,
  nextWeek,
  year,
  weeks,
}: ParityAndIsoProps) {
  const parity = (value: number) => (value % 2 === 0 ? "Par" : "Impar");

  return (
    <div className="flex flex-wrap gap-6">
      <section
        aria-labelledby="s-par"
        className="flex min-w-0 flex-[1_1_420px] flex-col gap-[18px] rounded-3xl border border-border bg-card p-6 sm:p-8"
      >
        <h2 id="s-par" className="m-0 font-heading text-[28px] font-bold">
          Paridad de la semana actual
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-2xl bg-olive-dark p-4 text-white sm:p-[18px]">
            <span className="text-[13px] text-mint">Esta semana · sem. {week}</span>
            <span className="font-heading text-2xl font-bold">{parity(week)}</span>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-mint p-4 text-ink sm:p-[18px]">
            <span className="text-[13px] text-olive-dark">
              Próxima semana · sem. {nextWeek}
            </span>
            <span className="font-heading text-2xl font-bold">
              {parity(nextWeek)}
            </span>
          </div>
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-muted">
          Las semanas pares e impares se usan, por ejemplo, en la custodia
          compartida, los turnos de recogida de residuos y los cuadrantes de
          trabajo.
        </p>
        <Link
          href="/semanas-pares-e-impares"
          className="inline-flex min-h-11 items-center self-start pt-2 text-[15px] font-semibold"
        >
          <span>Lee la guía sobre semanas pares e impares</span>
          <ArrowRightIcon className="ml-1 size-4" />
        </Link>
      </section>

      <section
        aria-labelledby="s-iso"
        className="flex min-w-0 flex-[1_1_420px] flex-col gap-4 rounded-3xl bg-cream p-6 sm:p-8"
      >
        <h2 id="s-iso" className="m-0 font-heading text-[28px] font-bold">
          Números de semana en España
        </h2>
        <p className="m-0 text-[15px] leading-relaxed">
          En España las semanas se numeran según la norma ISO 8601.
        </p>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {[
            "La semana empieza el lunes y termina el domingo.",
            "La primera semana del año es la que contiene el primer jueves.",
            `Un año tiene 52 o 53 semanas — ${year} tiene ${weeks}.`,
          ].map((text, index) => (
            <li
              key={text}
              className="flex items-start gap-3 text-[15px] leading-relaxed"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-olive text-[13px] font-bold text-white">
                {index + 1}
              </span>
              {text}
            </li>
          ))}
        </ul>
        <Link
          href="/numeros-de-semana"
          className="inline-flex min-h-11 items-center self-start pt-2 text-[15px] font-semibold"
        >
          <span>Más sobre los números de semana</span>
          <ArrowRightIcon className="ml-1 size-4" />
        </Link>
      </section>
    </div>
  );
}
