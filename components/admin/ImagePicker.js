"use client";

import { useState } from "react";

/**
 * Image field with direct URL entry + one-click upload to /public/uploads.
 */
export default function ImagePicker({ label, value, onChange, hint }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="upload-box">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/assets/… or /uploads/…"
          style={{ flex: 1, minWidth: 180 }}
        />
        <label className="file-label">
          {busy ? "Uploading…" : "Upload photo"}
          <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
        </label>
      </div>
      {error ? <div className="save-err">{error}</div> : null}
      {hint ? <div className="sub">{hint}</div> : null}
      {value ? <img className="preview-img" src={value} alt="" /> : null}
    </div>
  );
}
