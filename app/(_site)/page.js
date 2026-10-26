import Hero from "@/components/sections/Hero";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Marquee from "@/components/Marquee";
import SkillsSection from "@/components/sections/SkillsSection";
import AboutSection from "@/components/sections/AboutSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ContactSection from "@/components/sections/ContactSection";
import { getProjects, getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const site = getSite();
  const projects = getProjects();

  return (
    <main>
      <Hero hero={site.hero} />
      <ProjectsSection work={site.work} projects={projects} />
      <Marquee words={site.marquee?.words} />
      <SkillsSection skills={site.skills} />
      <AboutSection about={site.about} />
      <ProcessSection process={site.process} />
      <ServicesSection services={site.services} />
      <ContactSection contact={site.contact} />
    </main>
  );
}
