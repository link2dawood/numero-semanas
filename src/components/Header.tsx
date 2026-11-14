"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/numerosemanas-logo-web.png";
import { useEffect, useState } from "react";
import { navigationLinks } from "@/lib/content";
import { weeksYearHref } from "@/lib/site";

type HeaderProps = { week: number; weekYear: number };

export default function Header({ week, weekYear }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Row of the current week in its ISO year (e.g. 1 Jan 2027 is still 2026-W53).
  const weekHref = `${weeksYearHref(weekYear)}#semana-${week}`;

  return (
    <header className="border-b border-border bg-card print:hidden">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
        <Link
          href="/"
          className="flex min-h-11 items-center text-ink no-underline"
          aria-label="NumeroSemanas, inicio"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src={logo}
            alt="NumeroSemanas"
            width={240}
            height={34}
            priority
            className="h-auto w-[205px] sm:w-[240px]"
          />
        </Link>

        <button
          type="button"
          className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-ink hover:bg-panel xl:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className="flex size-5 flex-col items-center justify-center gap-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <nav
          id="primary-navigation"
          aria-label="Menú principal"
          className={`${menuOpen ? "grid" : "hidden"} w-full grid-cols-1 gap-x-5 gap-y-1 rounded-2xl border border-border bg-panel p-3 text-[15px] font-medium sm:grid-cols-2 xl:flex xl:w-auto xl:flex-row xl:flex-wrap xl:items-center xl:gap-x-5 xl:gap-y-1 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0`}
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 text-ink no-underline hover:bg-card hover:text-olive-dark xl:rounded-none xl:px-0 xl:hover:bg-transparent"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={weekHref}
            title={`Semana ${week} de ${weekYear}: fechas de lunes a domingo`}
            onClick={() => setMenuOpen(false)}
            className="flex min-h-11 items-center self-start rounded-full bg-olive px-4 font-semibold text-white no-underline hover:bg-olive-dark sm:col-span-2 xl:col-span-1 xl:self-auto"
          >
            Sem. {week}
          </Link>
        </nav>
      </div>
    </header>
  );
}
