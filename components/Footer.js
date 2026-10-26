import Link from "next/link";
import { getSite } from "@/lib/data";
import { ArrowUp } from "@/components/Icons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export default async function Footer() {
  const site = await getSite();
  return (
    <footer>
      <div className="wrap">
        <Link href="/" className="logo" style={{ width: 36, height: 36, fontSize: 22 }} aria-label="Back to top">
          S
        </Link>
        <span>{site.footer?.copyright}</span>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="top" aria-label="Scroll to top">
          <ArrowUp />
        </Link>
      </div>
    </footer>
  );
}
