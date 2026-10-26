"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

const POS = { "-2": "left2", "-1": "left1", 0: "center", 1: "right1", 2: "right2" };

/**
 * "How I Work" — fanned card carousel. Cards roll automatically,
 * and can be picked by click, dot, arrow keys or a swipe.
 */
export default function ProcessSection({ process }) {
  const cards = process?.cards || [];
  const total = cards.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const go = useCallback(
    (i) => setIdx(((i % total) + total) % total),
    [total]
  );

  /* auto-roll, unless reduced motion is on or the stage is hovered */
  useEffect(() => {
    if (total < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 4200);
    return () => clearInterval(t);
  }, [idx, paused, total]);

  /* arrow keys roll the cards */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (!total) return null;

  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    touchX.current = null;
  }

  return (
    <section id="process" aria-labelledby="process-h" style={{ paddingBottom: 0 }}>
      <div className="wrap head" style={{ marginBottom: 0 }}>
        <div>
          <div className="num">{process.num}</div>
          <ScrollReveal id="process-h" effect="fade" mode="enter" duration={0.9} enableBlur={false} baseOpacity={0} containerClassName="head-title">
            {process.title} <em>{process.titleEm}</em>
          </ScrollReveal>
        </div>
        <p
          className="hand"
          style={{ fontSize: 22, transform: "rotate(-3deg)", textAlign: "right", lineHeight: 1.05, whiteSpace: "pre-line" }}
        >
          {process.note}
        </p>
      </div>

      <div
        className="cv"
        role="region"
        aria-roledescription="carousel"
        aria-label="How I work"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {cards.map((card, i) => {
          let r = i - idx;
          if (r > total / 2) r -= total;
          if (r < -total / 2) r += total;
          const pos = POS[r] || (r < 0 ? "hidden-left" : "hidden-right");
          const active = r === 0;
          return (
            <article
              key={i}
              className={`cc ${pos}`}
              aria-hidden={!active}
              onClick={(e) => {
                if (!active) {
                  e.preventDefault();
                  go(i);
                }
              }}
            >
              <div className="cc-top">
                <span className="cc-n">
                  {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <span className="cc-cat">{card.cat}</span>
              </div>
              <div className="cc-mid">
                <h3 className="cc-t">{card.title}</h3>
                <p className="cc-d">{card.desc}</p>
              </div>
              <div className="cc-b">
                <span className="cc-bt">{card.cta}</span>
                <Link className="cc-ar" href={card.href || "#"} aria-label={card.linkLabel}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </article>
          );
        })}

        <div className="cd-wrap">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`cd${i === idx ? " active" : ""}`}
              aria-label={`Show card ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
