import TextLoop from "@/components/reactbits/TextLoop";

/**
 * Brand strip between sections — a continuous text marquee that flows
 * along a gentle wave path (React Bits TextLoop), clipped to a short
 * band so it reads as a full-width ribbon.
 */
export default function Marquee({ words = [] }) {
  const seq = words.length ? words : ["BUILD", "EDIT", "CREATE"];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-loop">
        <TextLoop
          text={seq.join(" / ")}
          shape="wave"
          curviness={18}
          speed={80}
          separator="✦"
          fontSize={40}
          fontWeight={800}
          letterSpacing={6}
          color="#C8FF00"
          ribbon={false}
          edgeFade={0.45}
          pauseOnHover
        />
      </div>
    </div>
  );
}
