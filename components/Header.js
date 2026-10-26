"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Arrow } from "@/components/Icons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
];

function Burger({ open }) {
  return (
    <svg className="ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  /* close the mobile menu whenever the route changes */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <Link href="/" className="logo" aria-label="Sampath home">
        S
      </Link>
      <nav aria-label="Main" className={menuOpen ? "open" : ""}>
        <ul>
          {LINKS.map((l) => {
            const on = isHome ? l.href === "/" : pathname.startsWith(l.href) && l.href !== "/";
            return (
              <li key={l.href}>
                <Link href={l.href} className={on ? "on" : ""}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="hdr-right">
        <Link href="/contact" className="btn btn-lime hdr-cta">
          Hire me <span aria-hidden="true"><Arrow /></span>
        </Link>
        <button
          type="button"
          className="burger"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Burger open={menuOpen} />
        </button>
      </div>
    </header>
  );
}
