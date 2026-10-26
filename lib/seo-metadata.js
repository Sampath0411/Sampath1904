function absoluteUrl(path, base) {
  try {
    const url = new URL(path, `${base.replace(/\/$/, "")}/`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function compactDescription(value, fallback = "Portfolio and selected work by Sampath.") {
  const description = String(value || fallback).replace(/\s+/g, " ").trim();
  return description.slice(0, 160);
}

export function buildSiteMetadata(site, base, googleVerification = "") {
  const meta = site?.meta || {};
  const title = meta.title || "Sampath | Developer & Video Editor";
  const description = compactDescription(meta.description);
  const canonical = absoluteUrl("/", base);
  const image = meta.ogImage ? absoluteUrl(meta.ogImage, base) : undefined;
  const verification = String(googleVerification || "").trim();

  return {
    metadataBase: new URL(base),
    title,
    description,
    keywords: meta.keywords,
    authors: meta.author ? [{ name: meta.author }] : undefined,
    alternates: canonical ? { canonical } : undefined,
    verification: verification ? { google: verification } : undefined,
    openGraph: {
      title,
      description: compactDescription(site?.hero?.lead, description),
      type: "website",
      images: image ? [{ url: image, alt: title }] : undefined,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: compactDescription(site?.hero?.lead, description),
      images: image ? [image] : undefined,
    },
  };
}

export function buildPageMetadata({ title, description, path }, base) {
  const canonical = absoluteUrl(path, base);
  const image = absoluteUrl("/assets/og.jpg", base);
  const summary = compactDescription(description);
  return {
    title,
    description: summary,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description: summary,
      type: "website",
      url: canonical,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: image ? [image] : undefined,
    },
  };
}

export function buildProjectMetadata(project, base) {
  const title = `${project.title} | Sampath`;
  const description = compactDescription(project.subtitle || project.description, `${project.title} project by Sampath.`);
  const canonical = absoluteUrl(`/projects/${encodeURIComponent(project.slug)}`, base);
  const image = project.image ? absoluteUrl(project.image, base) : undefined;
  const alt = String(project.imageAlt || project.title).trim();

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: canonical,
      images: image ? [{ url: image, alt }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: project.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function buildStructuredData(site, base) {
  const author = site?.meta?.author || "Sampath";
  const canonical = absoluteUrl("/", base);
  const sameAs = (site?.contact?.socials || [])
    .map((social) => String(social?.url || "").trim())
    .filter((url) => /^https?:\/\//i.test(url));

  return [
    {
      "@type": "Person",
      "@id": `${canonical}#person`,
      name: author,
      jobTitle: "Developer, Creator & Video Editor",
      url: canonical,
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${canonical}#website`,
      name: site?.meta?.title || `${author} Portfolio`,
      description: compactDescription(site?.meta?.description),
      url: canonical,
      publisher: { "@id": `${canonical}#person` },
    },
  ];
}

export function serializeStructuredData(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
