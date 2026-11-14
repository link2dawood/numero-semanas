import type { MetadataRoute } from "next";
import { SITE_URL, isIndexingEnabled } from "@/lib/site";

// Evaluated per request so the launch switch (SITE_INDEXING) needs no rebuild.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingEnabled()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
