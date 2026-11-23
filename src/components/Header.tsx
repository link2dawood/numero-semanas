"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationLinks } from "@/lib/content";
import { colors } from "@/lib/theme";
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

  const weekHref = `${weeksYearHref(weekYear)}#semana-${week}`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#E9E4D8] bg-[#F7F5EE]/95 backdrop-blur-md transition-all print:hidden">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          title="NumeroSemanas.es"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E2B20] text-white shadow-sm transition group-hover:bg-[#2A3C2D]">
            <div className="flex h-5 items-end gap-1">
              <span className="h-3 w-1.5 rounded-sm bg-amber-400"></span>
              <span className="h-5 w-1.5 rounded-sm bg-white"></span>
              <span className="h-4 w-1.5 rounded-sm bg-[#EEF0E6]"></span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`flex items-center font-serif text-xl font-bold tracking-tight text-[${colors.forest[900]}]`}>
              Numero<span className={`font-normal text-[${colors.forest[600]}]`}>Semanas</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-base font-medium text-stone-700 md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-1 transition hover:text-[#1E2B20]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button / Current Week Pill */}
        <div className="flex items-center gap-3">
          <Link
            href={weekHref}
            title={`Semana ${week} de ${weekYear}: fechas de lunes a domingo`}
            onClick={() => setMenuOpen(false)}
            className="inline-flex transform items-center gap-2 rounded-full bg-[#1E2B20] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2A3C2D]"
          >
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400"></span>
            <span>Sem. {week}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#E9E4D8] bg-white text-[#263028] hover:bg-[#F7F5EE] md:hidden"
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
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        id="primary-navigation"
        aria-label="Menú principal"
        className={`${menuOpen ? "grid" : "hidden"} w-full grid-cols-1 gap-1 border-t border-[#E9E4D8] bg-[#FDFBF7] p-3 text-[15px] font-medium md:hidden`}
      >
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="flex min-h-11 items-center rounded-xl px-3 text-[#263028] no-underline hover:bg-[#F7F5EE]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
