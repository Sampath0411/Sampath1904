"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="glass login-card" onSubmit={onSubmit}>
        <h1>Admin <em style={{ fontStyle: "normal", color: "var(--lime)" }}>Login</em></h1>
        <p>Enter the admin password to edit the site.</p>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
        </div>
        <button className="btn btn-lime" type="submit" disabled={busy}>
          {busy ? "Checking…" : "Sign in"}
        </button>
        {error ? <p className="login-err">{error}</p> : null}
      </form>
    </div>
  );
}
