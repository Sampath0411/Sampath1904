import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import Marquee from "@/components/Marquee";
import { getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return buildPageMetadata({
    title: "About Sampath | Developer & Video Editor",
    description: "About Sampath, an independent developer and video editor from Visakhapatnam, India.",
    path: "/about",
  }, siteBase());
}

export default async function AboutPage() {
  const site = await getSite();
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="num">{site.about.num}</div>
          <h1 style={{ fontSize: "clamp(42px,6vw,72px)", fontWeight: 800, letterSpacing: "-.03em" }}>
            {site.about.title} <em style={{ fontStyle: "normal", color: "var(--lime)" }}>{site.about.titleEm}</em>
          </h1>
          <p>{site.about.text}</p>
        </div>
      </section>

      <AboutSection about={site.about} />
      <Marquee words={site.marquee?.words} />
      <ServicesSection services={site.services} />
    </main>
  );
}
