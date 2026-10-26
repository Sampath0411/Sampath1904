"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow, Crown, Wave } from "@/components/Icons";
import Particles from "@/components/reactbits/Particles";
import SplitText from "@/components/reactbits/SplitText";
import RotatingText from "@/components/reactbits/RotatingText";
import Magnet from "@/components/reactbits/Magnet";

export default function Hero({ hero }) {
  const sectionRef = useRef(null);

  // Restore the lime radial spotlight that follows the pointer across the
  // name (the old inline handler was lost when the h1 became a SplitText).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e) => {
      const h1 = section.querySelector(".wrap h1");
      if (!h1) return;
      const rect = h1.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
      h1.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
      h1.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
    };
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section className="hero" id="home" ref={sectionRef} style={{ backgroundColor: "#0A0A0A" }}>
      <div className="hero-particles">
        <Particles
          particleCount={150}
          particleSpread={9}
          speed={0.06}
          particleColors={["#C8FF00", "#ffffff"]}
          shape="circle"
          glow={0.55}
          twinkle={0.35}
          drift="up"
          driftSpeed={0.5}
          hoverEffect="parallax"
          particleHoverFactor={0.6}
          hoverRadius={170}
          opacity={0.5}
        />
      </div>

      <div className="wrap">
        <div>
          <div className="hello hand">
            {hero.helloPrefix} <span><Wave /></span>
            <span className="crown"><Crown /></span>
          </div>

          <SplitText
            tag="h1"
            text={hero.name}
            effect="rise"
            trigger="load"
            splitType="chars"
            delay={35}
            duration={1.1}
            textAlign="left"
            className="hero-title-split"
          />

          <RotatingText
            texts={hero.roles || []}
            mainClassName="roles"
            splitBy="words"
            effect="flip"
            direction="up"
            rotationInterval={2400}
          />

          <p className="lead">{hero.lead}</p>
          <div className="cta">
            <Magnet magnetStrength={2.2} maxOffset={16} tilt={3} scale={1.04}>
              <Link href={hero.ctaPrimary?.href || "/work"} className="btn btn-lime">
                {hero.ctaPrimary?.label} <span aria-hidden="true"><Arrow /></span>
              </Link>
            </Magnet>
            <Magnet magnetStrength={2.2} maxOffset={16} tilt={3} scale={1.04}>
              <Link href={hero.ctaSecondary?.href || "/contact"} className="btn btn-glass">
                {hero.ctaSecondary?.label}
              </Link>
            </Magnet>
          </div>
        </div>
        <div className="portrait">
          <div className="slab" />
          <div className="dot" />
          <img className="me" src={hero.portrait} alt={hero.portraitAlt} width="520" height="620" />
          <p className="note hand">{hero.note}</p>
          <div className="sticker">{hero.sticker}</div>
        </div>
      </div>
      <svg className="scribble" viewBox="0 0 240 40" fill="none" stroke="#C8FF00" strokeWidth="5" strokeLinecap="round" aria-hidden="true">
        <path d="M5 32 L100 14 M30 36 L150 14 M70 38 L200 10" />
      </svg>
    </section>
  );
}
