import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/numerosemanas-logo-web.png";
import type { ReactNode } from "react";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { footerCompanyLinks as companyLinks, footerLinkGroups, type SiteLink } from "@/lib/content";

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
    label: "Pinterest",
    url: process.env.NEXT_PUBLIC_SOCIAL_PINTEREST || "https://www.pinterest.com/numerosemanas",
    icon: (
      <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2Z" />
    ),
  },
  {
    label: "Bluesky",
    url: process.env.NEXT_PUBLIC_SOCIAL_BLUESKY || "https://bsky.app/profile/numerosemanas.bsky.social",
    icon: (
      <path d="M6.3 4.2c2.3 1.7 4.8 5.3 5.7 7.2.9-1.9 3.4-5.5 5.7-7.2 1.7-1.2 4.3-2.2 4.3.8 0 .6-.3 5-.5 5.7-.7 2.5-3.2 3.1-5.5 2.7 4 .7 5 2.9 2.8 5.2-4.2 4.3-6-1.1-6.5-2.5l-.3-.7-.3.7c-.5 1.4-2.3 6.8-6.5 2.5-2.2-2.3-1.2-4.5 2.8-5.2-2.3.4-4.8-.2-5.5-2.7C2.3 10 2 5.6 2 5c0-3 2.6-2 4.3-.8Z" />
    ),
  },
];

const highlightLinks = [
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Contacto", href: "/contacto" },
];

function LinkList({
  links,
}: {
  links: SiteLink[];
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex min-h-10 items-center text-sm text-cream hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export default function Footer({ year }: FooterProps) {
  return (
    <footer className="bg-olive-dark text-cream print:hidden">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-5 sm:py-14">
        <div className="mb-10 flex flex-col gap-4 border-b border-sage pb-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            aria-label="NumeroSemanas, inicio"
            className="inline-flex w-fit rounded-2xl bg-cream px-5 py-3 no-underline"
          >
            <Image
              src={logo}
              alt="NumeroSemanas"
              width={230}
              height={32}
              className="h-auto w-[200px] sm:w-[230px]"
            />
          </Link>
          <p className="m-0 max-w-md text-sm text-mint">
            El número de semana actual y calendarios con semanas ISO 8601, festivos y herramientas
            para planificar tu año.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-[0.8fr_1.2fr_1.2fr_1fr_1.1fr]">
          <section aria-labelledby="footer-social-title" className="flex flex-col items-start">
            <div>
              <h2
                id="footer-social-title"
                className="m-0 mb-2 text-[13px] font-bold uppercase tracking-wide text-mint"
              >
                Síguenos
              </h2>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`NumeroSemanas en ${link.label} (se abre en una pestaña nueva)`}
                      title={link.label}
                      className="flex size-11 items-center justify-center rounded-full border border-sage text-cream hover:border-cream hover:bg-cream hover:text-olive-dark"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        {link.icon}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {footerLinkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="mb-2 mt-0 text-[13px] font-bold uppercase tracking-wide text-mint">
                {group.title}
              </h2>
              <LinkList links={group.links} />
            </nav>
          ))}

          <nav aria-label="Empresa">
            <h2 className="mb-2 mt-0 text-[13px] font-bold uppercase tracking-wide text-mint">
              Empresa
            </h2>
            <div className="flex flex-col items-start gap-1">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-10 items-center text-sm text-cream hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <CookieSettingsButton className="min-h-10 border-0 bg-transparent p-0 text-left text-sm text-cream underline decoration-cream/50 underline-offset-4 hover:text-white" />
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-sage pt-5 text-[13px] text-mint sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} NumeroSemanas. Todos los derechos reservados.
          </span>
          <nav aria-label="Enlaces destacados" className="flex flex-wrap gap-x-4">
            {highlightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-10 items-center font-semibold text-cream hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span>Según la norma internacional ISO 8601</span>
        </div>
      </div>
    </footer>
  );
}
