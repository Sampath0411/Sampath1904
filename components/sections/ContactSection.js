"use client";

import { useState } from "react";
import { BrandIcon, Smile } from "@/components/Icons";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

export default function ContactSection({ contact }) {
  const form = contact.form || {};
  const [status, setStatus] = useState({ state: "idle", text: "" });

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
      website: fd.get("website"),
    };
    setStatus({ state: "busy", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      e.target.reset();
      setStatus({ state: "ok", text: form.successText || "Message sent!" });
    } catch (err) {
      setStatus({ state: "err", text: err.message });
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-h">
      <div className="wrap contact">
        <div>
          <div className="num">{contact.num}</div>
          <ScrollReveal id="contact-h" effect="fade" mode="enter" duration={0.9} enableBlur={false} baseOpacity={0} containerClassName="head-title">
            {contact.title}
            <br />
            <span className="circ">{contact.titleEm}</span>
          </ScrollReveal>
          <p className="hand" style={{ fontSize: 22, marginTop: 20, transform: "rotate(-5deg)", maxWidth: 200, lineHeight: 1.1 }}>
            {contact.note}
          </p>
        </div>

        <form className="glass" onSubmit={onSubmit}>
          <div>
            <label htmlFor="c-name">{form.nameLabel}</label>
            <input id="c-name" name="name" placeholder={form.namePlaceholder} required />
          </div>
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="c-website">Leave this field empty</label>
            <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="c-email">{form.emailLabel}</label>
            <input id="c-email" type="email" name="email" placeholder={form.emailPlaceholder} required />
          </div>
          <div className="full">
            <label htmlFor="c-msg">{form.messageLabel}</label>
            <textarea id="c-msg" name="message" rows="3" placeholder={form.messagePlaceholder} required />
          </div>
          <button className="btn btn-lime full" type="submit" disabled={status.state === "busy"}>
            {status.state === "busy" ? "Sending…" : form.submitLabel}
          </button>
          {status.state === "ok" || status.state === "err" ? (
            <p className={`form-msg${status.state === "err" ? " err" : ""}`}>{status.text}</p>
          ) : null}
        </form>

        <div>
          <p>{contact.followLabel}</p>
          <div className="social">
            {contact.socials?.map((s) => (
              <a key={s.label} href={s.url} aria-label={s.label} target="_blank" rel="noreferrer">
                <BrandIcon name={s.icon} />
              </a>
            ))}
          </div>
          <p className="hand" style={{ marginTop: 26, fontSize: 22, transform: "rotate(-6deg)", color: "var(--lime)", whiteSpace: "pre-line" }}>
            {contact.goodVibes} <Smile />
          </p>
        </div>
      </div>
    </section>
  );
}
