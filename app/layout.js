import "./globals.css";
import { getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import { buildSiteMetadata, buildStructuredData, serializeStructuredData } from "@/lib/seo-metadata";
import GlowCursor from "@/components/reactbits/GlowCursor";
import ClickSpark from "@/components/reactbits/ClickSpark";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getSite();
  return buildSiteMetadata(site, siteBase(), process.env.GOOGLE_SITE_VERIFICATION);
}

export default async function RootLayout({ children }) {
  const site = await getSite();
  const structuredData = buildStructuredData(site, siteBase()).map((item) => ({
    "@context": "https://schema.org",
    ...item,
  }));
  return (
    // suppressHydrationWarning: browser extensions (e.g. recorders) inject
    // attributes onto <html> before React hydrates — harmless, but React
    // would otherwise report a mismatch it won't patch up.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=DM+Sans:wght@400;500;700&family=Caveat:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />
      </head>
      <body>
        <GlowCursor color="#C8FF00" intensity={1.1} trailWidth={2.5} glow={0.9} clickBurst={false} grain={0.02}>
          <ClickSpark sparkColor="#C8FF00" sparkCount={10} sparkSize={13} sparkRadius={36} gravity={260} shape="star" glow={0.35}>
            {children}
          </ClickSpark>
        </GlowCursor>
      </body>
    </html>
  );
}
