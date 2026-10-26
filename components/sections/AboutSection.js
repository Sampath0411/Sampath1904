import Link from "next/link";
import { Arrow } from "@/components/Icons";
import StatCounter from "@/components/StatCounter";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

export default function AboutSection({ about }) {
  return (
    <section id="about" aria-labelledby="about-h">
      <div className="wrap about-wide">
        <figure className="polaroid">
          <img src={about.photo} alt={about.photoAlt} loading="lazy" />
          <figcaption className="hand">{about.caption}</figcaption>
        </figure>
        <div className="right">
          <div>
            <div className="num">{about.num}</div>
            <ScrollReveal id="about-h" effect="fade" mode="enter" duration={0.9} enableBlur={false} baseOpacity={0} containerClassName="head-title">
              {about.title} <em>{about.titleEm}</em>
            </ScrollReveal>
            <p>{about.text}</p>
            <Link href={about.buttonHref || "/about"} className="btn btn-glass btn-sm">
              {about.buttonLabel} <Arrow size={13} />
            </Link>
          </div>
          <div className="stats">
            {about.stats?.map((s) => (
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
