"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { Arrow } from "@/components/Icons";
import Particles from "@/components/reactbits/Particles";

// Lanyard is a WebGL-heavy Three.js scene — SSR-off so it only runs in browser
const Lanyard = dynamic(() => import("@/components/reactbits/Lanyard"), { ssr: false });

export default function LanyardSection() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className="ln" aria-label="Creator badge">
      <div className="ln-particles" aria-hidden="true">
        <Particles
          particleCount={90}
          particleSpread={8}
          speed={0.045}
          particleColors={["#C8FF00", "#ffffff"]}
          shape="circle"
          glow={0.5}
          twinkle={0.4}
          drift="up"
          driftSpeed={0.32}
          hoverEffect="repel"
          particleHoverFactor={1.1}
          hoverRadius={190}
          opacity={0.42}
        />
      </div>
      <div className="ln-wrap">
        <div className="ln-copy">
          <div className="num">✦ CREATOR BADGE</div>
          <h2>
            Give it a <em>spin.</em>
          </h2>
          <p>
            This isn't a static card — grab it, stretch it, throw it and watch
            it swing back. Click to flip it over. That's how everything I build
            feels: tactile, physical, alive.
          </p>
          <div className="cta">
            <Link href="/work" className="btn btn-lime">
              See the work <Arrow />
            </Link>
            <Link href="/contact" className="btn btn-glass">
              Hire me
            </Link>
            <button
              type="button"
              className="btn btn-glass ln-flip"
              aria-pressed={isFlipped}
              onClick={() => setIsFlipped((flipped) => !flipped)}
            >
              Flip card
            </button>
          </div>
          <p className="ln-note hand">drag it ↓ flip it ↓</p>
        </div>
        <div className="ln-stage">
          <Lanyard
            frontImage="/assets/sampath-id-portrait.jpeg"
            backImage="/assets/sampath-id-back.svg"
            strapImage="/assets/sampath-lanyard-strap.svg"
            imageFit="cover"
            cardColor="#0A0A0A"
            orientation="portrait"
            finish="glossy"
            cornerRadius={0.3}
            size={0.62}
            anchor="center"
            strapLength={0.5}
            strapColor="#C8FF00"
            strapWidth={0.65}
            metal="silver"
            gravity={1}
            damping={0.5}
            elasticity={0.5}
            breeze={0.5}
            interactive
            intro
            flipSignal={isFlipped}
          />
        </div>
      </div>
    </section>
  );
}
