import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import type { SiteLink } from "@/lib/content";

type RelatedLinksProps = { links: SiteLink[] };

export default function RelatedLinks({ links }: RelatedLinksProps) {
  return (
    <nav
      aria-label="Contenido relacionado"
      className="rounded-2xl bg-panel p-5"
    >
      <h2 className="m-0 font-heading text-xl font-bold">También te puede interesar</h2>
      <ul className="mb-0 mt-3 grid list-none gap-2 p-0 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="flex min-h-11 items-center font-medium">
              <span>{link.label}</span>
              <ArrowRightIcon className="ml-1 size-4 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
