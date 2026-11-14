import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { toolGroups } from "@/lib/content";

export default function ToolsGrid() {
  return (
    <section aria-labelledby="s-tools" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 id="s-tools" className="m-0 font-heading text-[32px] font-bold">
          Todas las herramientas
        </h2>
        <p className="m-0 text-base text-muted">
          Calendarios, calculadoras y herramientas de planificación en un solo
          lugar.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {toolGroups.map((group) => (
          <div
            key={group.title}
            className="flex flex-col gap-2.5 rounded-[20px] border border-border bg-card p-[22px]"
          >
            <div className="flex items-center gap-2.5">
              <span className={`size-2.5 rounded-[3px] ${group.dot}`} aria-hidden="true" />
              <h3 className="m-0 text-base font-bold">{group.title}</h3>
            </div>
            <ul className="m-0 flex list-none flex-col p-0">
              {group.links.map((link) => (
                <li key={link.href} className="border-t border-cream">
                  <Link
                    href={link.href}
                    className="flex min-h-11 items-center justify-between gap-2 text-[15px] text-ink no-underline hover:text-olive-dark"
                  >
                    {link.label}
                    <ArrowRightIcon className="size-4 shrink-0 text-olive" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
