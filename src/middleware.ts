import { NextResponse, type NextRequest } from "next/server";
import { consolidatedRedirects, yearAliasRedirects } from "@/lib/redirects";

const CONSOLIDATED = new Map(consolidatedRedirects.map(({ source, destination }) => [source, destination]));
const YEAR_ALIASES = new Map(yearAliasRedirects.map(({ source, destination }) => [source, destination]));

/**
 * - Path normalisation, always a single permanent hop with the query string kept:
 *   consolidated URLs → primary page (301), /path/ → /path (308).
 *   Combinations resolve in the same hop.
 * - STAGING_BASIC_AUTH="user:password" puts the whole site behind HTTP Basic
 *   Auth (recommended for any publicly reachable staging/preview host).
 * Authentication is read at request time.
 */
export function middleware(request: NextRequest) {
  const normalized = normalizedUrl(request);
  if (normalized) return normalized;

  const credentials = process.env.STAGING_BASIC_AUTH;
  if (credentials && !hasValidCredentials(request, credentials)) {
    return new NextResponse("Acceso restringido", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="NumeroSemanas (staging)", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.next();
}

function normalizedUrl(request: NextRequest): NextResponse | null {
  // Plain URL, not request.nextUrl: NextURL re-appends the trailing slash on serialisation.
  const url = new URL(request.url);
  let status: 301 | 308 = 308;
  let changed = false;

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    changed = true;
  }
  const destination = CONSOLIDATED.get(url.pathname);
  const alias = YEAR_ALIASES.get(url.pathname);
  if (destination) {
    url.pathname = destination;
    status = 301;
    changed = true;
  } else if (alias) {
    url.pathname = alias;
    changed = true;
  }
  return changed ? NextResponse.redirect(url, status) : null;
}

function hasValidCredentials(request: NextRequest, expected: string): boolean {
  const [scheme, encoded] = (request.headers.get("authorization") ?? "").split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  try {
    return atob(encoded) === expected;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
