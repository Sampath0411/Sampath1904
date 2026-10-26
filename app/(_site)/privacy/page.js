import { getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Privacy Policy | Sampath",
    description:
      "No trackers, no ad pixels, no analytics. What this portfolio site collects, how long it's kept, and how to reach me about your data.",
    alternates: { canonical: `${siteBase()}/privacy` },
    robots: { index: true, follow: true },
  };
}

const SECTIONS = [
  {
    h: "The short version",
    p: [
      "This site doesn't track you. No analytics, no ad pixels, no session recorders, no cookie banner — because there's nothing to banner.",
      "The only data that reaches me is whatever you type into the contact form, and it's used for exactly one thing: letting me reply.",
    ],
  },
  {
    h: "What gets collected",
    p: [
      "The contact form sends three fields — your name, email and message — to this site's server. I keep them only so I can write back, and the inbox is capped at the 500 most recent messages (older ones fall off).",
      "Like virtually every website, the hosting provider also keeps standard server logs: IP address, requested pages, time, browser. Those exist for security and debugging, not for building a profile of you.",
    ],
  },
  {
    h: "Cookies",
    p: [
      "Visitors get no cookies at all. None.",
      "There is exactly one cookie on this site and you'll never receive it: after the owner signs in to the admin area, a session cookie keeps that login alive for seven days. It's httpOnly, so nothing else can read it.",
    ],
  },
  {
    h: "Third parties",
    p: [
      "Fonts load from Google Fonts. When your browser fetches them, Google sees your IP address and processes it under Google's own privacy policy — that's the one external request this page makes.",
      "Beyond fonts and the hosting provider: no ad networks, no social media embeds, no analytics vendors, no trackers of any kind. Everything else is served directly from this site.",
    ],
  },
  {
    h: "How long it's kept",
    p: [
      "Contact messages: until I've handled them, with the 500-message cap noted above. Server logs: per the hosting provider's retention policy. Nothing here is kept to profile you, because there's nothing being profiled.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You can ask what I hold about you, have it corrected or deleted, or object to it being kept. Email me and I'll take care of it — no forms, no runaround.",
      "These mirror GDPR-style rights, and I honor them for everyone regardless of where you live.",
    ],
  },
  {
    h: "Kids",
    p: [
      "This site isn't aimed at children under 13, and I don't knowingly collect their information. If you're a parent and think a child has sent me something through the contact form, email me and I'll delete it.",
    ],
  },
  {
    h: "Changes",
    p: [
      "If this policy ever changes, the updated version appears on this page with a new date at the bottom. No emails about it — you're reading the source of truth right here.",
    ],
  },
];

export default async function PrivacyPage() {
  const site = getSite();
  const email = site.contact?.email || "";

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="num">Legal</div>
          <h1 style={{ fontSize: "clamp(42px,6vw,72px)", fontWeight: 800, letterSpacing: "-.03em" }}>
            Privacy <span style={{ color: "var(--lime)" }}>Policy</span>
          </h1>
          <p style={{ maxWidth: "62ch" }}>
            Written in plain words, by the one person who runs this site. Last updated{" "}
            <strong style={{ color: "var(--txt)" }}>October 2026</strong>.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          {SECTIONS.map((s, i) => (
            <article
              key={s.h}
              style={{
                borderTop: "1px solid var(--line)",
                padding: "34px 0",
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: "0 18px",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  color: "var(--lime)",
                  fontWeight: 800,
                  fontSize: 14,
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  paddingTop: 6,
                }}
              >
                {String(i + 1).padStart(2, "0")}.
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: "-.02em",
                    marginBottom: 12,
                  }}
                >
                  {s.h}
                </h2>
                {s.p.map((text) => (
                  <p
                    key={text.slice(0, 40)}
                    style={{
                      color: "#cfcfc8",
                      fontSize: 15,
                      lineHeight: 1.75,
                      maxWidth: "62ch",
                      marginBottom: 10,
                    }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </article>
          ))}

          <article
            style={{
              borderTop: "1px solid var(--line)",
              padding: "34px 0 10px",
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: "0 18px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                color: "var(--lime)",
                fontWeight: 800,
                fontSize: 14,
                fontFamily: "'Bricolage Grotesque',sans-serif",
                paddingTop: 6,
              }}
            >
              09.
            </div>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 12 }}>
                Contact
              </h2>
              <p style={{ color: "#cfcfc8", fontSize: 15, lineHeight: 1.75, maxWidth: "62ch" }}>
                Questions about any of this — or a request about your data — go to{" "}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    style={{ color: "var(--lime)", borderBottom: "1px solid var(--lime)" }}
                  >
                    {email}
                  </a>
                ) : (
                  "the contact form"
                )}
                . A real person reads it.
              </p>
              <p
                className="hand"
                style={{
                  fontSize: 24,
                  color: "var(--lime)",
                  transform: "rotate(-2deg)",
                  marginTop: 22,
                  display: "inline-block",
                }}
              >
                TL;DR — nothing creepy happens here.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
