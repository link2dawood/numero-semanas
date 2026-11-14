import {
  footerCompanyLinks,
  footerServiceLinks,
  navigationLinks,
} from "../src/lib/content";
import { weeksYearHref } from "../src/lib/site";
import { isoWeek } from "../src/lib/weeks";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

// Links rendered outside the configurable lists: the footer logo → "/". The app
// pages are noindex placeholders and are not in the footer; the home page links
// them from its "Apps" section instead.
const FOOTER_EXTRA_LINKS: string[] = ["/"];
// "Sem. N" pill → week list of the current ISO year.
const HEADER_EXTRA_LINKS = ["/", weeksYearHref(isoWeek(new Date()).year)];

const expectedFooter = unique([
  ...footerServiceLinks.map((link) => link.href),
  ...footerCompanyLinks.map((link) => link.href),
  ...FOOTER_EXTRA_LINKS,
]);
const expectedNavbar = unique([
  ...navigationLinks.map((link) => link.href),
  ...HEADER_EXTRA_LINKS,
]);

type LinkCheck = { route: string; status: number | string; location?: string };

async function main() {
  const homepage = await fetch(baseUrl, { cache: "no-store" });
  if (!homepage.ok) {
    throw new Error(`Homepage failed: HTTP ${homepage.status} (${baseUrl})`);
  }
  const html = await homepage.text();
  if (/href\s*=\s*(["'])#\1/i.test(html)) {
    throw new Error('Found a placeholder href="#" in the rendered homepage.');
  }

  const footerLinks = unique(extractInternalHrefs(sectionMarkup(html, "footer")));
  const navbarLinks = unique(extractInternalHrefs(sectionMarkup(html, "header")));
  const failures: string[] = [
    ...compareSets("footer", expectedFooter, footerLinks),
    ...compareSets("navbar", expectedNavbar, navbarLinks),
  ];

  const footerChecks = await checkLinks(footerLinks);
  const navbarChecks = await checkLinks(navbarLinks);
  printTable("Footer routes", footerChecks);
  printTable("Navbar routes", navbarChecks);

  for (const check of [...footerChecks, ...navbarChecks]) {
    if (check.status === 200) continue;
    const detail = check.location ? ` → ${check.location} (link should point to the final URL)` : "";
    failures.push(`${check.route}: ${check.status}${detail}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} link check(s) failed:\n${failures.join("\n")}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `\nPassed: footer matches its ${expectedFooter.length} configured links, navbar matches its ${expectedNavbar.length}; every link returned HTTP 200 without redirects.`,
  );
}

function compareSets(area: string, expected: string[], actual: string[]): string[] {
  const failures: string[] = [];
  for (const href of expected) {
    if (!actual.includes(href)) failures.push(`${area}: configured link ${href} is not rendered`);
  }
  for (const href of actual) {
    if (!expected.includes(href)) failures.push(`${area}: unexpected link ${href} (add it to the config or remove it)`);
  }
  return failures;
}

function sectionMarkup(html: string, tag: "header" | "footer"): string {
  const match = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "i").exec(html);
  if (!match) throw new Error(`Could not find the rendered <${tag}> section.`);
  return match[0];
}

function extractInternalHrefs(markup: string): string[] {
  const hrefs: string[] = [];
  for (const match of markup.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)) {
    const href = (match[2] ?? "").replaceAll("&amp;", "&");
    if (href.startsWith("/") && !href.startsWith("//")) {
      const url = new URL(href, baseUrl);
      hrefs.push(url.pathname);
    }
  }
  return hrefs;
}

async function checkLinks(paths: string[]): Promise<LinkCheck[]> {
  return Promise.all(
    paths.map(async (route) => {
      try {
        const response = await fetch(new URL(route, baseUrl), {
          redirect: "manual",
          cache: "no-store",
        });
        const page = await response.text();
        if (/href\s*=\s*(["'])#\1/i.test(page)) {
          return { route, status: 'href="#" found' };
        }
        return {
          route,
          status: response.status,
          location: response.headers.get("location") ?? undefined,
        };
      } catch {
        return { route, status: "ERROR" };
      }
    }),
  );
}

function printTable(title: string, checks: LinkCheck[]) {
  console.log(`\n${title}`);
  console.log("Route".padEnd(48) + "Status");
  console.log("-".repeat(58));
  for (const check of checks) {
    console.log(`${check.route.padEnd(48)}${check.status}`);
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

void main();
