import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import Marquee from "@/components/Marquee";
import { getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "About | Sampath" };

export default function AboutPage() {
  const site = getSite();
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
