"use client";

import CountUp from "@/components/reactbits/CountUp";
import BorderGlow from "@/components/reactbits/BorderGlow";

const NUM = /^([\d.]+)(.*)$/;

/**
 * Stat tile: animated CountUp number inside a Border Glow card.
 * Accepts values like "2+", "10+", "100%" — the numeric prefix counts
 * up, the suffix (+/%) stays put.
 */
export default function StatCounter({ value, label }) {
  const m = NUM.exec(String(value ?? ""));
  const num = m && m[1] !== "" ? parseFloat(m[1]) : 0;
  const suffix = m ? m[2] : "";

  return (
    <BorderGlow
      className="stat-glow"
      backgroundColor="#0d0d0d"
      borderRadius={20}
      edgeSensitivity={40}
      glowColor="200 255 0"
      glowRadius={16}
      glowIntensity={0.9}
      coneSpread={22}
      fillOpacity={0.16}
      colors={["#C8FF00", "#ffffff", "#FF3D00"]}
    >
      <b className="stat-num">
        <CountUp to={num} initialValue={num} suffix={suffix} duration={1.6} easing="easeOut" separator="" trigger="load" />
      </b>
      <span>{label}</span>
    </BorderGlow>
  );
}
