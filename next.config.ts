import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "production" ? ".next-production" : ".next",
  // URL normalisation lives in src/middleware.ts: consolidated pages (301, see
  // src/lib/redirects.ts), trailing slashes (308) and the www host (301), combined
  // so that e.g. www…/semana-par-o-impar/ reaches its final URL in one hop.
  skipTrailingSlashRedirect: true,
  // Next 15 streams metadata of dynamic pages (the home page) into <body> for
  // user agents outside its "HTML-limited bots" list, Googlebot included.
  // Matching every agent keeps <title>, description and canonical in <head>
  // for all crawlers; generateMetadata is synchronous here, so nothing waits.
  htmlLimitedBots: /.*/,
  images: {
    // AVIF first for browsers that accept it, WebP otherwise. Raster images are
    // statically imported (content-hashed URLs), so optimised variants inherit
    // the immutable one-year cache of /_next/static.
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
