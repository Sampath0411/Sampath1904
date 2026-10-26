"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/admin/ImagePicker";

/* ---------- tiny form primitives ---------- */

function Field({ label, value, onChange, textarea, full, hint, placeholder }) {
  return (
    <div className={`field${full ? " full" : ""}`}>
      <label>{label}</label>
      {textarea ? (
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
      {hint ? <div className="sub">{hint}</div> : null}
    </div>
  );
}

function SubHead({ title, hint }) {
  return (
    <div className="subhead">
      {title}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button type="button" className="btn btn-danger btn-sm mini" onClick={onClick} title="Remove">
      Remove
    </button>
  );
}

/* ---------- admin panel ---------- */

export default function AdminPanel({ initialSite, initialProjects, initialMessages }) {
  const router = useRouter();
  const [tab, setTab] = useState("content");
  const [site, setSite] = useState(() => ({
    ...(initialSite || {}),
    process: initialSite?.process || {
      num: "04.",
      title: "How I",
      titleEm: "Work",
      note: "",
      cards: [],
    },
  }));
  const [projects, setProjects] = useState(initialProjects);
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(null);
  const [draft, setDraft] = useState(null); // project being added/edited
  const [busy, setBusy] = useState(false);

  /* generic nested setter: upd("hero.lead", value) */
  function upd(path, value) {
    setSite((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    setStatus(null);
  }

  function flash(type, text) {
    setStatus({ type, text });
    if (type === "ok") setTimeout(() => setStatus(null), 3500);
  }

  async function saveContent() {
    setBusy(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash("ok", "Content saved — refresh to see it live.");
      router.refresh();
    } catch (err) {
      flash("err", err.message);
    } finally {
      setBusy(false);
    }
  }

  /* ---------- projects ---------- */

  function blankProject() {
    return {
      id: "",
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      badge: "",
      category: "",
      tags: [],
      image: "",
      imageAlt: "",
      link: "",
      featured: true,
      layout: "large",
      gradient: "",
    };
  }

  function updDraft(path, value) {
    setDraft((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function saveProject() {
    if (!draft.title.trim()) return flash("err", "Project title is required.");
    setBusy(true);
    try {
      const isNew = !draft.id;
      const res = await fetch(isNew ? "/api/projects" : `/api/projects/${draft.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setProjects((prev) => (isNew ? [...prev, data] : prev.map((p) => (p.id === data.id ? data : p))));
      setDraft(null);
      flash("ok", isNew ? "Project added." : "Project updated.");
      router.refresh();
    } catch (err) {
      flash("err", err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject(p) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
      flash("ok", "Project deleted.");
      router.refresh();
    } catch (err) {
      flash("err", err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteMessage(id) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== id));
    else flash("err", "Could not delete message.");
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  }

  const comma = (arr) => (arr || []).join(", ");
  const split = (str) =>
    String(str)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  /* ---------- render ---------- */

  return (
    <div className="wrap admin">
      <div className="admin-bar">
        <h1>
          Admin <em>Panel</em>
        </h1>
        <div className="row-btns">
          <Link href="/" className="btn btn-glass btn-sm">View site</Link>
          <Link href="/work" className="btn btn-glass btn-sm">View work</Link>
          <button className="btn btn-danger btn-sm" onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab${tab === "content" ? " on" : ""}`} onClick={() => setTab("content")}>
          Edit content
        </button>
        <button className={`tab${tab === "projects" ? " on" : ""}`} onClick={() => { setTab("projects"); setDraft(null); }}>
          Projects ({projects.length})
        </button>
        <button className={`tab${tab === "messages" ? " on" : ""}`} onClick={() => setTab("messages")}>
          Messages ({messages.length})
        </button>
      </div>

      {status ? <p className={status.type === "ok" ? "save-ok" : "save-err"}>{status.text}</p> : null}

      {/* ============ CONTENT ============ */}
      {tab === "content" ? (
        <div className="glass panel">
          <h2>Edit everything</h2>
          <p className="hint">
            Every text, photo and link on the site. Changes go live the moment you hit Save.
          </p>

          <div className="fields">
            <SubHead title="SEO & meta" hint="Shown in Google results, tabs and social shares." />
            <Field label="Page title" value={site.meta.title} onChange={(v) => upd("meta.title", v)} full />
            <Field label="Description" textarea value={site.meta.description} onChange={(v) => upd("meta.description", v)} full />
            <Field label="Keywords" value={site.meta.keywords} onChange={(v) => upd("meta.keywords", v)} />
            <Field label="Author" value={site.meta.author} onChange={(v) => upd("meta.author", v)} />
            <Field label="Canonical URL" value={site.meta.canonical} onChange={(v) => upd("meta.canonical", v)} />
            <Field label="Social share image" value={site.meta.ogImage} onChange={(v) => upd("meta.ogImage", v)} />

            <SubHead title="Hero (home top)" hint="Name, tagline and buttons." />
            <Field label="Hello line" value={site.hero.helloPrefix} onChange={(v) => upd("hero.helloPrefix", v)} />
            <Field label="Big name" value={site.hero.name} onChange={(v) => upd("hero.name", v)} />
            <Field label="Roles (comma separated)" value={comma(site.hero.roles)} onChange={(v) => upd("hero.roles", split(v))} full />
            <Field label="Lead paragraph" textarea value={site.hero.lead} onChange={(v) => upd("hero.lead", v)} full />
            <Field label="Sticky note (line breaks kept)" textarea value={site.hero.note} onChange={(v) => upd("hero.note", v)} />
            <Field label="Sticker badge (line breaks kept)" textarea value={site.hero.sticker} onChange={(v) => upd("hero.sticker", v)} />
            <Field label="Primary button" value={site.hero.ctaPrimary.label} onChange={(v) => upd("hero.ctaPrimary.label", v)} />
            <Field label="Primary button link" value={site.hero.ctaPrimary.href} onChange={(v) => upd("hero.ctaPrimary.href", v)} />
            <Field label="Secondary button" value={site.hero.ctaSecondary.label} onChange={(v) => upd("hero.ctaSecondary.label", v)} />
            <Field label="Secondary button link" value={site.hero.ctaSecondary.href} onChange={(v) => upd("hero.ctaSecondary.href", v)} />
            <ImagePicker label="Portrait photo" value={site.hero.portrait} onChange={(v) => upd("hero.portrait", v)} />
            <Field label="Portrait alt text" value={site.hero.portraitAlt} onChange={(v) => upd("hero.portraitAlt", v)} />

            <SubHead title="Work section" hint="Heading above the featured projects." />
            <Field label="Number" value={site.work.num} onChange={(v) => upd("work.num", v)} />
            <Field label="Title" value={site.work.title} onChange={(v) => upd("work.title", v)} />
            <Field label="Highlight word" value={site.work.titleEm} onChange={(v) => upd("work.titleEm", v)} />
            <Field label="View-all link" value={site.work.viewAllLabel} onChange={(v) => upd("work.viewAllLabel", v)} />
            <Field label="Empty state text" value={site.work.emptyText} onChange={(v) => upd("work.emptyText", v)} full />

            <SubHead title="Marquee strip" hint="Scrolling words." />
            <Field label="Words (comma separated)" value={comma(site.marquee.words)} onChange={(v) => upd("marquee.words", split(v))} full />

            <SubHead title="Skills" hint="Group cards with tool tags." />
            <Field label="Number" value={site.skills.num} onChange={(v) => upd("skills.num", v)} />
            <Field label="Title" value={site.skills.title} onChange={(v) => upd("skills.title", v)} />
            <Field label="Handwritten note" value={site.skills.note} onChange={(v) => upd("skills.note", v)} />
            <div className="field full">
              <label>Groups</label>
              {site.skills.groups.map((g, i) => (
                <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 140px auto", gap: 10, alignItems: "end" }}>
                    <Field label="Chip name" value={g.chip} onChange={(v) => upd(`skills.groups.${i}.chip`, v)} />
                    <div className="field">
                      <label>Color</label>
                      <select value={g.chipColor} onChange={(e) => upd(`skills.groups.${i}.chipColor`, e.target.value)}>
                        <option value="lime">Lime</option>
                        <option value="white">White</option>
                      </select>
                    </div>
                    <RemoveBtn
                      onClick={() => upd("skills.groups", site.skills.groups.filter((_, j) => j !== i))}
                    />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Field
                      label="Tags (comma separated)"
                      value={comma(g.tags)}
                      onChange={(v) => upd(`skills.groups.${i}.tags`, split(v))}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => upd("skills.groups", [...site.skills.groups, { chip: "New group", chipColor: "lime", tags: [] }])}
              >
                + Add group
              </button>
            </div>

            <SubHead title="About" hint="Photo, story and stat cards." />
            <Field label="Number" value={site.about.num} onChange={(v) => upd("about.num", v)} />
            <Field label="Title" value={site.about.title} onChange={(v) => upd("about.title", v)} />
            <Field label="Highlight word" value={site.about.titleEm} onChange={(v) => upd("about.titleEm", v)} />
            <Field label="Story" textarea value={site.about.text} onChange={(v) => upd("about.text", v)} full />
            <ImagePicker label="About photo" value={site.about.photo} onChange={(v) => upd("about.photo", v)} />
            <div className="field">
              <label>Photo alt text</label>
              <input value={site.about.photoAlt} onChange={(e) => upd("about.photoAlt", e.target.value)} />
              <div style={{ marginTop: 10 }}>
                <label>Polaroid caption</label>
                <textarea value={site.about.caption} onChange={(e) => upd("about.caption", e.target.value)} style={{ minHeight: 60 }} />
              </div>
            </div>
            <Field label="Button label" value={site.about.buttonLabel} onChange={(v) => upd("about.buttonLabel", v)} />
            <Field label="Button link" value={site.about.buttonHref} onChange={(v) => upd("about.buttonHref", v)} />
            <div className="field full">
              <label>Stats</label>
              {site.about.stats.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
                  <Field label={`Value ${i + 1}`} value={s.value} onChange={(v) => upd(`about.stats.${i}.value`, v)} />
                  <Field label="Label" value={s.label} onChange={(v) => upd(`about.stats.${i}.label`, v)} />
                  <RemoveBtn onClick={() => upd("about.stats", site.about.stats.filter((_, j) => j !== i))} />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => upd("about.stats", [...site.about.stats, { value: "0+", label: "New stat" }])}
              >
                + Add stat
              </button>
            </div>

            <SubHead title="How I work" hint="The fanned card carousel between About and Services." />
            <Field label="Number" value={site.process.num} onChange={(v) => upd("process.num", v)} />
            <Field label="Title" value={site.process.title} onChange={(v) => upd("process.title", v)} />
            <Field label="Highlight word" value={site.process.titleEm} onChange={(v) => upd("process.titleEm", v)} />
            <Field label="Handwritten note" textarea value={site.process.note} onChange={(v) => upd("process.note", v)} full />
            <div className="field full">
              <label>Cards</label>
              {site.process.cards.map((c, i) => (
                <div key={i} style={{ padding: "14px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
                    <Field label="Category" value={c.cat} onChange={(v) => upd(`process.cards.${i}.cat`, v)} />
                    <Field label="Card title" value={c.title} onChange={(v) => upd(`process.cards.${i}.title`, v)} />
                    <RemoveBtn onClick={() => upd("process.cards", site.process.cards.filter((_, j) => j !== i))} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <Field label="Description" value={c.desc} onChange={(v) => upd(`process.cards.${i}.desc`, v)} />
                    <Field label="Small label" value={c.cta} onChange={(v) => upd(`process.cards.${i}.cta`, v)} />
                    <Field label="Link" value={c.href} onChange={(v) => upd(`process.cards.${i}.href`, v)} />
                  </div>
                  <Field label="Arrow link aria-label" value={c.linkLabel} onChange={(v) => upd(`process.cards.${i}.linkLabel`, v)} />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() =>
                  upd("process.cards", [
                    ...site.process.cards,
                    { cat: "Category", title: "New", desc: "", cta: "Learn more", href: "#work", linkLabel: "Go to projects" },
                  ])
                }
              >
                + Add card
              </button>
            </div>

            <SubHead title="Services" hint="The three service cards." />
            <Field label="Number" value={site.services.num} onChange={(v) => upd("services.num", v)} />
            <Field label="Title" value={site.services.title} onChange={(v) => upd("services.title", v)} />
            <Field label="Highlight word" value={site.services.titleEm} onChange={(v) => upd("services.titleEm", v)} />
            <Field label="Description" textarea value={site.services.desc} onChange={(v) => upd("services.desc", v)} full />
            <div className="field full">
              <label>Items</label>
              {site.services.items.map((s, i) => (
                <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
                    <Field label="Title" value={s.title} onChange={(v) => upd(`services.items.${i}.title`, v)} />
                    <div className="field">
                      <label>Icon</label>
                      <select value={s.icon} onChange={(e) => upd(`services.items.${i}.icon`, e.target.value)}>
                        <option value="camera">Camera</option>
                        <option value="play">Play</option>
                        <option value="code">Code</option>
                      </select>
                    </div>
                    <RemoveBtn onClick={() => upd("services.items", site.services.items.filter((_, j) => j !== i))} />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Field label="Subtitle" value={s.subtitle} onChange={(v) => upd(`services.items.${i}.subtitle`, v)} />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => upd("services.items", [...site.services.items, { icon: "code", title: "New service", subtitle: "" }])}
              >
                + Add service
              </button>
            </div>

            <SubHead title="Contact" hint="Form copy, email and social links." />
            <Field label="Number" value={site.contact.num} onChange={(v) => upd("contact.num", v)} />
            <Field label="Title" value={site.contact.title} onChange={(v) => upd("contact.title", v)} />
            <Field label="Highlight word" value={site.contact.titleEm} onChange={(v) => upd("contact.titleEm", v)} />
            <Field label="Note" textarea value={site.contact.note} onChange={(v) => upd("contact.note", v)} />
            <Field label="Your email" value={site.contact.email} onChange={(v) => upd("contact.email", v)} hint="Where the contact form messages get logged." />
            <Field label="Follow label" value={site.contact.followLabel} onChange={(v) => upd("contact.followLabel", v)} />
            <Field label="Good vibes note" textarea value={site.contact.goodVibes} onChange={(v) => upd("contact.goodVibes", v)} />
            <Field label="Form success text" value={site.contact.form.successText} onChange={(v) => upd("contact.form.successText", v)} full />
            <div className="field full">
              <label>Social links</label>
              {site.contact.socials.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 150px 1.4fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
                  <Field label="Label" value={s.label} onChange={(v) => upd(`contact.socials.${i}.label`, v)} />
                  <div className="field">
                    <label>Icon</label>
                    <select value={s.icon} onChange={(e) => upd(`contact.socials.${i}.icon`, e.target.value)}>
                      {["github", "linkedin", "instagram", "youtube", "x"].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <Field label="URL" value={s.url} onChange={(v) => upd(`contact.socials.${i}.url`, v)} />
                  <RemoveBtn onClick={() => upd("contact.socials", site.contact.socials.filter((_, j) => j !== i))} />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => upd("contact.socials", [...site.contact.socials, { label: "New", icon: "github", url: "https://" }])}
              >
                + Add social
              </button>
            </div>

            <SubHead title="Footer" />
            <Field label="Copyright line" value={site.footer.copyright} onChange={(v) => upd("footer.copyright", v)} full />
          </div>

          <div className="actions">
            <button className="btn btn-lime" onClick={saveContent} disabled={busy}>
              {busy ? "Saving…" : "Save all changes"}
            </button>
            {status?.type === "ok" ? <span className="save-ok">{status.text}</span> : null}
          </div>
        </div>
      ) : null}

      {/* ============ PROJECTS ============ */}
      {tab === "projects" ? (
        <div className="glass panel">
          {!draft ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <h2>Projects</h2>
                  <p className="hint">Add, edit, reorder by featured, and upload cover photos.</p>
                </div>
                <button className="btn btn-lime btn-sm" onClick={() => setDraft(blankProject())}>
                  + Add project
                </button>
              </div>

              {projects.length === 0 ? (
                <p className="empty">No projects yet.</p>
              ) : (
                projects.map((p) => (
                  <div className="proj-row" key={p.id}>
                    {p.image ? (
                      <img src={p.image} alt="" />
                    ) : (
                      <div className="ph">no img</div>
                    )}
                    <div className="info">
                      <b>{p.title}</b>
                      <span>
                        {p.subtitle} · {p.featured ? "featured" : "hidden from home"} · /projects/{p.slug}
                      </span>
                    </div>
                    <div className="row-btns">
                      <button
                        className="btn btn-glass btn-sm mini"
                        onClick={() => {
                          setDraft({ ...p });
                          setStatus(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-glass btn-sm mini"
                        onClick={async () => {
                          const updated = { ...p, featured: !p.featured };
                          const res = await fetch(`/api/projects/${p.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updated),
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setProjects((prev) => prev.map((x) => (x.id === p.id ? data : x)));
                          }
                        }}
                      >
                        {p.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button className="btn btn-danger btn-sm mini" onClick={() => deleteProject(p)} disabled={busy}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              <h2>{draft.id ? `Edit: ${draft.title || "project"}` : "New project"}</h2>
              <p className="hint">The detail page template fills itself in from these fields.</p>

              <div className="fields">
                <Field label="Title *" value={draft.title} onChange={(v) => updDraft("title", v)} />
                <Field
                  label="Slug (URL)"
                  value={draft.slug}
                  onChange={(v) => updDraft("slug", v)}
                  placeholder="auto from title"
                  hint={`URL: /projects/${draft.slug || "…"}`}
                />
                <Field label="Subtitle" value={draft.subtitle} onChange={(v) => updDraft("subtitle", v)} />
                <Field label="Badge" value={draft.badge} onChange={(v) => updDraft("badge", v)} placeholder="Web App" />
                <Field label="Category" value={draft.category} onChange={(v) => updDraft("category", v)} placeholder="Development" />
                <Field label="Tags (comma separated)" value={comma(draft.tags)} onChange={(v) => updDraft("tags", split(v))} />
                <Field label="Description" textarea value={draft.description} onChange={(v) => updDraft("description", v)} full />
                <Field label="External link" value={draft.link} onChange={(v) => updDraft("link", v)} placeholder="https://…" />
                <Field label="Card gradient (CSS)" value={draft.gradient} onChange={(v) => updDraft("gradient", v)} placeholder="optional, used when no image" />
                <ImagePicker
                  label="Cover photo"
                  value={draft.image}
                  onChange={(v) => updDraft("image", v)}
                  hint="Upload a photo for this project — it shows on the card and the project page."
                />
                <Field label="Image alt text" value={draft.imageAlt} onChange={(v) => updDraft("imageAlt", v)} />
                <div className="field">
                  <label>Home layout</label>
                  <select value={draft.layout} onChange={(e) => updDraft("layout", e.target.value)}>
                    <option value="large">Large card</option>
                    <option value="small">Small card</option>
                  </select>
                </div>
                <div className="field">
                  <label>Show on home</label>
                  <select value={draft.featured ? "yes" : "no"} onChange={(e) => updDraft("featured", e.target.value === "yes")}>
                    <option value="yes">Featured</option>
                    <option value="no">Work page only</option>
                  </select>
                </div>
              </div>

              <div className="actions">
                <button className="btn btn-lime" onClick={saveProject} disabled={busy}>
                  {busy ? "Saving…" : draft.id ? "Save project" : "Add project"}
                </button>
                <button className="btn btn-glass" onClick={() => setDraft(null)}>Cancel</button>
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* ============ MESSAGES ============ */}
      {tab === "messages" ? (
        <div className="glass panel">
          <h2>Contact messages</h2>
          <p className="hint">Sent through the contact form. Stored in data/messages.json.</p>
          {messages.length === 0 ? (
            <p className="empty">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div className="msg-item" key={m.id}>
                <header>
                  <span>
                    <b>{m.name}</b> · {m.email}
                  </span>
                  <span>{new Date(m.receivedAt).toLocaleString()}</span>
                </header>
                <p>{m.message}</p>
                <div className="actions" style={{ marginTop: 10 }}>
                  <a className="btn btn-glass btn-sm mini" href={`mailto:${m.email}?subject=Re: your message`}>
                    Reply
                  </a>
                  <button className="btn btn-danger btn-sm mini" onClick={() => deleteMessage(m.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
