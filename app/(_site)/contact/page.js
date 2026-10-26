import ContactSection from "@/components/sections/ContactSection";
import { getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return buildPageMetadata({
    title: "Contact Sampath | Web & Video Projects",
    description: "Get in touch with Sampath about web development, video editing, photography or a creative project.",
    path: "/contact",
  }, siteBase());
}

export default async function ContactPage() {
  const site = await getSite();
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="num">{site.contact.num}</div>
          <h1 style={{ fontSize: "clamp(42px,6vw,72px)", fontWeight: 800, letterSpacing: "-.03em" }}>
            {site.contact.title}{" "}
            <span
              className="circ"
              style={{
                display: "inline-block",
                border: "3px solid var(--lime)",
                borderRadius: 50,
                padding: "4px 18px 8px",
                transform: "rotate(-3deg)",
                color: "var(--lime)",
                fontSize: "0.8em",
              }}
            >
              {site.contact.titleEm}
            </span>
          </h1>
          <p>
            Project in mind? Reach me at{" "}
            <a href={`mailto:${site.contact.email}`} style={{ color: "var(--lime)", borderBottom: "1px solid var(--lime)" }}>
              {site.contact.email}
            </a>{" "}
            or drop a message below.
          </p>
        </div>
      </section>

      <ContactSection contact={site.contact} />
    </main>
  );
}
