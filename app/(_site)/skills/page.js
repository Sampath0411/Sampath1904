import SkillsSection from "@/components/sections/SkillsSection";
import Marquee from "@/components/Marquee";
import { getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return buildPageMetadata({
    title: "Skills & Tools | Sampath",
    description: "Development, design and video-editing tools Sampath uses to create digital projects and visual stories.",
    path: "/skills",
  }, siteBase());
}

export default async function SkillsPage() {
  const site = await getSite();
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="num">{site.skills.num}</div>
          <h1 style={{ fontSize: "clamp(42px,6vw,72px)", fontWeight: 800, letterSpacing: "-.03em" }}>
            {site.skills.title}
          </h1>
          <p>The stack behind the builds, the cuts behind the edits — everything I work with day to day.</p>
        </div>
      </section>

      <SkillsSection skills={site.skills} />
      <Marquee words={site.marquee?.words} />
    </main>
  );
}
