import Link from "next/link";
import type { ReactNode } from "react";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { footerCompanyLinks as companyLinks, footerLinkGroups, type SiteLink } from "@/lib/content";
import { colors } from "@/lib/theme";

type FooterProps = { year: number };

// Override any profile URL with the matching NEXT_PUBLIC_SOCIAL_* variable.
const socialLinks: { label: string; url: string; icon: ReactNode }[] = [
  {
    label: "Facebook",
    url: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://www.facebook.com/numerosemanas",
    icon: (
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4Z" />
    ),
  },
  {
    label: "X (Twitter)",
    url: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "https://twitter.com/numerosemanas",
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    label: "Instagram",
    url: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://www.instagram.com/numerosemanas",
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    ),
  },
];

const highlightLinks = [
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Contacto", href: "/contacto" },
];

function LinkList({ links }: { links: SiteLink[] }) {
  return (
    <ul className="space-y-2.5 text-sm text-stone-400">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="transition hover:text-white">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer({ year }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-[#1E2B20] bg-[#141E16] text-stone-300 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Footer Top Section */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-[#1E2B20] pb-12 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2A3C2D] bg-[#1E2B20] text-white">
              <div className="flex h-5 items-end gap-1">
                <span className="h-3 w-1.5 rounded-sm bg-amber-400"></span>
                <span className="h-5 w-1.5 rounded-sm bg-white"></span>
                <span className="h-4 w-1.5 rounded-sm bg-[#EEF0E6]"></span>
              </div>
            </div>
            <div>
              <span className={`font-serif text-xl font-bold tracking-tight text-white`}>
                Numero<span className={`font-normal text-[${colors.olive[100]}]`}>Semanas</span>
              </span>
              <p className="text-sm text-stone-400">
                El número de semana actual y calendarios con semanas ISO 8601, festivos y herramientas para planificar tu año.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="mr-1 text-sm font-bold uppercase text-stone-400">Síguenos</span>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`NumeroSemanas en ${link.label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E2B20] text-xs text-white transition hover:bg-[#2A3C2D]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  {link.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Columns Navigation */}
        <div className="grid grid-cols-2 gap-8 py-12 text-sm md:grid-cols-4">
          {footerLinkGroups.map((group) => (
            <nav key={group.title} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {group.title}
              </h4>
              <LinkList links={group.links} />
            </nav>
          ))}

          <nav className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Empresa
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className="border-0 bg-transparent p-0 text-left text-sm text-stone-400 underline decoration-stone-500/50 underline-offset-4 transition hover:text-white" />
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#1E2B20] pt-8 text-sm text-stone-500 sm:flex-row">
          <p>© {year} NumeroSemanas. Todos los derechos reservados.</p>
          <nav className="flex items-center gap-4">
            {highlightLinks.map((link, index) => (
              <span key={link.href} className="flex items-center gap-4">
                <Link href={link.href} className="transition hover:text-stone-300">
                  {link.label}
                </Link>
                {index < highlightLinks.length - 1 && <span>·</span>}
              </span>
            ))}
          </nav>
          <p className="font-medium text-stone-400">Según la norma internacional ISO 8601</p>
        </div>
      </div>
    </footer>
  );
}
