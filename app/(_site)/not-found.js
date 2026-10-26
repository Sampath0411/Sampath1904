import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div>
        <div className="num" style={{ justifyContent: "center" }}>404</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12 }}>Lost the plot</h1>
        <p style={{ color: "var(--mute)", marginBottom: 22 }}>
          This page doesn&apos;t exist — but the work does.
        </p>
        <Link href="/" className="btn btn-lime">Back home</Link>
      </div>
    </main>
  );
}
