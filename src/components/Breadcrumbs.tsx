
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/structured-data";
import { colors } from "@/lib/theme";
import { FlagFinland, FlagNetherlands } from "@/components/Icons";
import type { ReactNode } from "react";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  showInternational?: boolean;
};

const internationalSites: { icon: ReactNode; code: string; href: string; label: string }[] = [
  {
    icon: <FlagFinland className="size-4 rounded-sm" />,
    code: "FI",
    href: "https://viikkonro.fi/",
    label: "Finés",
  },
  {
    icon: <FlagNetherlands className="size-4 rounded-sm" />,
    code: "NL",
    href: "https://weeknr.date/",
    label: "Neerlandés",
  },
];

export default function Breadcrumbs({
  items,
  showInternational = true,
}: BreadcrumbsProps) {
  return (
    <>
      <nav
        aria-label="Migas de pan"
        className="mx-auto max-w-7xl px-4 pt-5 text-sm sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb trail */}
          <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm text-stone-500">
            {items.map((item, index) => (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <span aria-hidden="true" className="text-stone-400">
                    /
                  </span>
                )}
                {item.href && index < items.length - 1 ? (
                  <Link
                    href={item.href}
                    className={`text-stone-500 transition hover:text-[${colors.forest[800]}]`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className={`text-[${colors.forest[900]}]`}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>

          {/* International sites */}
          {showInternational && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-400">También en:</span>
              <div className="flex items-center gap-1.5">
                {internationalSites.map((site) => (
                  <a
                    key={site.code}
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Ver en ${site.label}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-[${colors.sand.border}] bg-[${colors.sand[50]}] px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:border-[${colors.forest[800]}] hover:bg-[${colors.forest[800]}] hover:text-white`}
                  >
                    {site.icon}
                    <span>{site.code}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* The only BreadcrumbList on the page; it mirrors the visible trail. */}
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
