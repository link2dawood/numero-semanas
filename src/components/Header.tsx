"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationLinks } from "@/lib/content";
import { colors } from "@/lib/theme";
import { weeksYearHref } from "@/lib/site";

type HeaderProps = { week: number; weekYear: number };

export default function Header({ week, weekYear }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setExpandedMobile(null);
        setOpenDropdown(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const weekHref = `${weeksYearHref(weekYear)}#semana-${week}`;

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobile(expandedMobile === label ? null : label);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

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
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 lg:flex">
          {navigationLinks.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                data-dropdown
              >
                <button
                  type="button"
                  className="flex items-center gap-1 py-1 transition hover:text-[#1E2B20]"
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                  onClick={() => toggleDropdown(item.label)}
                >
                  {item.label}
                  <svg
                    className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === item.label && (
                  <div
                    className="absolute left-0 top-full mt-2 min-w-[220px] rounded-xl border border-[#E9E4D8] bg-white py-2 shadow-xl"
                    style={{ zIndex: 9999 }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-stone-700 transition hover:bg-[#F7F5EE] hover:text-[#1E2B20]"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="py-1 transition hover:text-[#1E2B20]"
              >
                {item.label}
              </Link>
            )
          )}
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
            className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#E9E4D8] bg-white text-[#263028] hover:bg-[#F7F5EE] lg:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="flex size-5 flex-col items-center justify-center gap-1">
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
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
        className={`${menuOpen ? "block" : "hidden"} w-full border-t border-[#E9E4D8] bg-[#FDFBF7] p-3 text-[15px] font-medium lg:hidden`}
      >
        {navigationLinks.map((item) =>
          item.children ? (
            <div key={item.label} className="mb-1">
              <button
                type="button"
                onClick={() => toggleMobileSubmenu(item.label)}
                className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-[#263028] hover:bg-[#F7F5EE]"
                aria-expanded={expandedMobile === item.label}
              >
                <span>{item.label}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${expandedMobile === item.label ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedMobile === item.label && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#E9E4D8] pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => {
                        setMenuOpen(false);
                        setExpandedMobile(null);
                      }}
                      className="flex min-h-10 items-center rounded-lg px-2 text-sm text-stone-600 hover:bg-[#F7F5EE] hover:text-[#1E2B20]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 text-[#263028] no-underline hover:bg-[#F7F5EE]"
            >
              {item.label}
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
