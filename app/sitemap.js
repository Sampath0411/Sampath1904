import { getProjects } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import { buildSitemapEntries } from "@/lib/seo-config";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  return buildSitemapEntries(siteBase(), await getProjects({ publishedOnly: true }));
}
