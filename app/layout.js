import "./globals.css";
import { getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import GlowCursor from "@/components/reactbits/GlowCursor";
import ClickSpark from "@/components/reactbits/ClickSpark";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = getSite();
  const m = site.meta;
  const base = m.canonical?.replace(/\/$/, "") || "";
  return {
    metadataBase: new URL(siteBase()),
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: m.author }],
    alternates: m.canonical ? { canonical: m.canonical } : undefined,
    openGraph: {
      title: m.title,
      description: site.hero?.lead,
      type: "website",
      images: m.ogImage ? [{ url: m.ogImage }] : undefined,
      url: m.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: site.hero?.lead,
      images: m.ogImage ? [m.ogImage] : undefined,
    },
  };
}

const jsonLd = (site) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.meta.author,
  jobTitle: "Developer, Creator & Video Editor",
  url: site.meta.canonical,
  sameAs: (site.contact?.socials || []).map((s) => s.url).filter((u) => u && u !== "#"),
});

export default async function RootLayout({ children }) {
  const site = getSite();
  return (
    // suppressHydrationWarning: browser extensions (e.g. recorders) inject
    // attributes onto <html> before React hydrates — harmless, but React
    // would otherwise report a mismatch it won't patch up.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning style={{ background: "#0A0A0A" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=DM+Sans:wght@400;500;700&family=Caveat:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(site)) }} />
      </head>
      <body style={{ background: "#0A0A0A", color: "#F2F2EC" }}>
        <GlowCursor color="#C8FF00" intensity={1.1} trailWidth={2.5} glow={0.9} clickBurst={false} grain={0.02}>
          <ClickSpark sparkColor="#C8FF00" sparkCount={10} sparkSize={13} sparkRadius={36} gravity={260} shape="star" glow={0.35}>
            {children}
          </ClickSpark>
        </GlowCursor>
      </body>
    </html>
  );
}
