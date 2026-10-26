import { readJSON } from "@/lib/data";
import { resolveSiteBase } from "@/lib/seo-config";

/**
 * Origin of the site, derived from the canonical URL in site.json.
 * Falls back to localhost so robots/sitemap never emit broken URLs.
 * Change meta.canonical in the admin panel when the real domain is live.
 */
export function siteBase() {
  return resolveSiteBase({
    siteUrl: process.env.SITE_URL,
    canonical: readJSON("site")?.meta?.canonical,
  });
}
