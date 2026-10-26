import { getSite } from "@/lib/data";

/**
 * Origin of the site, derived from the canonical URL in site.json.
 * Falls back to localhost so robots/sitemap never emit broken URLs.
 * Change meta.canonical in the admin panel when the real domain is live.
 */
export function siteBase() {
  try {
    return new URL(getSite()?.meta?.canonical || "").origin;
  } catch {
    return "http://localhost:3000";
  }
}
