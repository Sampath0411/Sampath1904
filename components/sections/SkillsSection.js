import { NoteArrow, SkillMark } from "@/components/Icons";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

export default function SkillsSection({ skills }) {
  return (
    <section id="skills" aria-labelledby="skills-h">
      <div className="wrap skills">
        <div>
          <div className="num">{skills.num}</div>
          <ScrollReveal id="skills-h" effect="fade" mode="enter" duration={0.9} enableBlur={false} baseOpacity={0} containerClassName="head-title">
            {skills.title}
          </ScrollReveal>
          <p className="hand sk-note">
            {skills.note} <NoteArrow />
          </p>
        </div>
        {skills.groups?.map((group) => (
          <div className="glass" key={group.chip}>
            <span className={`chip${group.chipColor === "white" ? " white" : ""}`}>{group.chip}</span>
            <br />
            {group.tags?.map((tag) => (
              <span className="tag" key={tag}>
                <SkillMark name={tag} />
                {tag}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
