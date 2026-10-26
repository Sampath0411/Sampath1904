import { siteBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function robots() {
  const base = siteBase();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
