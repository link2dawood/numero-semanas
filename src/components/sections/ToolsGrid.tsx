import Link from "next/link";
import { toolGroups } from "@/lib/content";

// Icon components for each category
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function PuzzleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  );
}

function getIcon(title: string, className?: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("calendario")) return <CalendarIcon className={className} />;
  if (lowerTitle.includes("festivo")) return <StarIcon className={className} />;
  if (lowerTitle.includes("calculadora")) return <CalculatorIcon className={className} />;
  if (lowerTitle.includes("trabajo") || lowerTitle.includes("laboral")) return <BriefcaseIcon className={className} />;
  if (lowerTitle.includes("sol") || lowerTitle.includes("estacion")) return <SunIcon className={className} />;
  if (lowerTitle.includes("integracion")) return <PuzzleIcon className={className} />;
  return <CalendarIcon className={className} />;
}

function getIconColor(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("festivo")) return "text-amber-600";
  if (lowerTitle.includes("sol") || lowerTitle.includes("estacion")) return "text-amber-600";
  if (lowerTitle.includes("integracion")) return "text-[#525B40]";
  return "text-[#2A3C2D]";
}

export default function ToolsGrid() {
  return (
    <section id="directorio" className="space-y-6 pt-4">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#141E16]">
          Todas las herramientas
        </h3>
        <p className="text-sm text-stone-500">
          Calendarios, calculadoras y herramientas de planificación en un solo lugar.
        </p>
      </div>

      {/* 6-column Grid Directory */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {toolGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-[#E9E4D8] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)]"
          >
            <div className="mb-3 flex items-center gap-2 border-b border-[#E9E4D8] pb-2 text-sm font-bold text-[#141E16]">
              {getIcon(group.title, `h-5 w-5 ${getIconColor(group.title)}`)}
              <span>{group.title}</span>
            </div>
            <ul className="space-y-2.5 text-sm text-stone-600">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between hover:text-[#1E2B20]"
                  >
                    {link.label}
                    <svg className="h-3.5 w-3.5 text-stone-300 group-hover:text-[#1E2B20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
