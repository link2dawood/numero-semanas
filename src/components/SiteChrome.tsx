"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Hides the site header/footer on the bare /widget iframe embed. Only this
 * gate is a Client Component: the chrome it wraps is passed in as children,
 * so a Server Component (the footer) stays server-rendered with no client JS.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return usePathname() === "/widget" ? null : children;
}
