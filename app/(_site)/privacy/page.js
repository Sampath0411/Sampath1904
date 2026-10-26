import { getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    ...buildPageMetadata({
      title: "Privacy Policy | Sampath",
      description: "What data the portfolio contact form collects, how it is used, and how to request deletion.",
      path: "/privacy",
    }, siteBase()),
    robots: { index: true, follow: true },
  };
}

const SECTIONS = [
  {
    h: "The short version",
    p: [
      "This site does not use analytics, advertising pixels, or session recorders.",
      "If you use the contact form, your name, email address, and message are stored so Sampath can reply. If email notifications are configured, the form contents are also sent through Resend.",
    ],
  },
  {
    h: "What gets collected",
    p: [
      "The contact form sends your name, email and message to the site's server. The details are stored with Supabase and can be viewed or deleted by the site owner in the admin inbox; the inbox retains the 500 most recent messages. Resend processes the same details to send an email notification when configured.",
      "For abuse prevention, the server uses a one-way hash of the request IP with a secret to enforce a contact-form rate limit; it does not store the raw IP in the rate-limit table. Vercel may separately process standard request logs under its own retention and privacy terms.",
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
      "The site is hosted by Vercel. Portfolio data and uploaded images are stored with Supabase; contact notifications are processed by Resend when configured. These providers process information under their own terms and privacy policies. The site does not embed social feeds or use analytics vendors.",
    ],
  },
  {
    h: "How long it's kept",
    p: [
      "Contact messages remain in the admin inbox until deleted, up to a maximum of the 500 most recent messages. Provider and server logs follow the respective providers' retention policies. No contact information is used to build an advertising profile.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You can ask what I hold about you, have it corrected or deleted, or object to it being kept. Email me and I'll take care of it — no forms, no runaround.",
      "Requests are handled by the site owner, subject to applicable law.",
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
  const site = await getSite();
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
