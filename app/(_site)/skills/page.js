import SkillsSection from "@/components/sections/SkillsSection";
import Marquee from "@/components/Marquee";
import { getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Skills | Sampath" };

export default function SkillsPage() {
  const site = getSite();
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
