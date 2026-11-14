import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/structured-data";

type BreadcrumbsProps = { items: BreadcrumbItem[] };

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <nav aria-label="Migas de pan" className="mx-auto max-w-[1440px] px-4 pt-5 text-sm text-muted sm:px-5">
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href && index < items.length - 1 ? (
                <Link href={item.href} className="text-muted">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {/* The only BreadcrumbList on the page; it mirrors the visible trail. */}
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
