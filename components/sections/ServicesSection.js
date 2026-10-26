"use client";

import { Arrow, ServiceIcon } from "@/components/Icons";
import TiltedCard from "@/components/reactbits/TiltedCard";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

const FACE_STYLE = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 10,
  height: "100%",
  padding: "24px 22px",
  background:
    "linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.02))",
  border: "1px solid var(--line)",
  borderRadius: 28,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)",
};

export default function ServicesSection({ services }) {
  return (
    <section id="services" aria-labelledby="svc-h">
      <div className="wrap services">
        <div>
          <div className="num">{services.num}</div>
          <ScrollReveal id="svc-h" effect="fade" mode="enter" duration={0.9} enableBlur={false} baseOpacity={0} containerClassName="head-title">
            {services.title} <em>{services.titleEm}</em>
          </ScrollReveal>
          <p className="d">{services.desc}</p>
        </div>
        {services.items?.map((svc) => (
          <TiltedCard
            key={svc.title}
            containerWidth="100%"
            containerHeight="210px"
            imageWidth="100%"
            imageHeight="210px"
            radius={28}
            perspective={900}
            scaleOnHover={1.04}
            rotateAmplitude={9}
            glare={0.35}
            glareColor="#C8FF00"
            shadow={0.35}
            showTooltip={false}
            intro={false}
          >
            <div style={FACE_STYLE}>
              <div className="ic">
                <ServiceIcon name={svc.icon} />
              </div>
              <h3>{svc.title}</h3>
              <small>{svc.subtitle}</small>
              <span className="arr">
                <Arrow size={14} />
              </span>
            </div>
          </TiltedCard>
        ))}
      </div>
    </section>
  );
}
