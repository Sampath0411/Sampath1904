"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP-style sticky "Animate Anything" section, ported to Sampath's palette:
 *  - left column stays pinned while you scroll
 *  - two overlapping sticker chips (lavender + orange like gsap.com)
 *  - floating gradient shapes on the right that drift/parallax with scroll
 * Text/shape copy is editable from site.json under `animate`.
 */
export default function AnimateAnythingSection({ animate }) {
  const rootRef = useRef(null);

  const sticker1 = animate?.sticker1 || "Create Anything";
  const sticker2 = animate?.sticker2 || "That's right, Anything";
  const body =
    animate?.body ||
    "Whether it's a web app, a reel edit or a bold visual identity, I craft interfaces that feel alive and experiences people actually remember.";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Sticker pop-in: stagger left -> overlap
      gsap.fromTo(
        ".aa-sticker-1",
        { y: -18, rotate: -4, scale: 0.85, opacity: 0 },
        {
          y: 0,
          rotate: -2,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        ".aa-sticker-2",
        { y: 14, rotate: 1.5, scale: 0.85, opacity: 0 },
        {
          y: 0,
          rotate: 1,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.12,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        ".aa-body",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        }
      );

      // Shapes enter with a little float
      gsap.fromTo(
        ".aa-shape",
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: root, start: "top 65%", once: true },
        }
      );

      // Pin the whole section while shapes parallax past, then release cleanly
      // (pin only .aa-pin with pinSpacing:false leaves the copy floating over
      // later sections without reserved space — the overlap seen in review.)
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=700",
        pin: true,
        anticipatePin: 1,
      });

      // Parallax drift while the section is pinned
      root.querySelectorAll(".aa-shape").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.to(el, {
          y: -120 * speed,
          rotate: 40 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=700",
            scrub: 1.2,
          },
        });
      });

      // Gentle idle float so they feel alive even at rest
      root.querySelectorAll(".aa-shape").forEach((el, i) => {
        gsap.to(el, {
          y: "+=10",
          duration: 1.8 + i * 0.3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="aa" aria-labelledby="aa-h">
      <div className="aa-grid">
        <div className="aa-pin">
          <h2 id="aa-h" className="aa-sr">Create Anything</h2>
          <div className="aa-stickers">
            <span className="aa-sticker aa-sticker-1">{sticker1}</span>
            <span className="aa-sticker aa-sticker-2">{sticker2}</span>
          </div>
          <p className="aa-body">{body}</p>
        </div>

        <div className="aa-stage" aria-hidden="true">
          {/* Torus / ring */}
          <svg className="aa-shape aa-ring" data-speed="0.6" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="52" stroke="url(#aaRingGrad)" strokeWidth="16" />
            <defs>
              <linearGradient id="aaRingGrad" x1="0" y1="0" x2="120" y2="120">
                <stop offset="0%" stopColor="#C8FF00" />
                <stop offset="55%" stopColor="#66E8FF" />
                <stop offset="100%" stopColor="#FF8AC2" />
              </linearGradient>
            </defs>
          </svg>

          {/* 4-petal flower */}
          <svg className="aa-shape aa-flower" data-speed="1.1" viewBox="0 0 120 120">
            <g fill="url(#aaFlowerGrad)">
              <circle cx="60" cy="28" r="26" />
              <circle cx="92" cy="60" r="26" />
              <circle cx="60" cy="92" r="26" />
              <circle cx="28" cy="60" r="26" />
            </g>
            <defs>
              <linearGradient id="aaFlowerGrad" x1="0" y1="0" x2="120" y2="120">
                <stop offset="0%" stopColor="#FF8AC2" />
                <stop offset="100%" stopColor="#FF3D00" />
              </linearGradient>
            </defs>
          </svg>

          {/* Hourglass */}
          <svg className="aa-shape aa-hourglass" data-speed="0.9" viewBox="0 0 60 80">
            <path d="M10 6h40l-18 34 18 34H10l18-34z" fill="url(#aaHgGrad)" />
            <defs>
              <linearGradient id="aaHgGrad" x1="0" y1="0" x2="0" y2="80">
                <stop offset="0%" stopColor="#B79CFF" />
                <stop offset="100%" stopColor="#7B5CFF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Diamond */}
          <svg className="aa-shape aa-diamond" data-speed="1.3" viewBox="0 0 40 40">
            <rect x="9" y="9" width="22" height="22" rx="4" transform="rotate(45 20 20)" fill="url(#aaDiamondGrad)" />
            <defs>
              <linearGradient id="aaDiamondGrad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#FFC24B" />
                <stop offset="100%" stopColor="#FF8A3D" />
              </linearGradient>
            </defs>
          </svg>

          {/* Green dome */}
          <div className="aa-shape aa-dome" data-speed="0.4" />
        </div>
      </div>
    </section>
  );
}
