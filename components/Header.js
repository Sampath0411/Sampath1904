"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow, Crown } from "@/components/Icons";
import PillNav from "@/components/reactbits/PillNav";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  // PillNav uses uncontrolled selected state but we feed activeHref so it
  // always reflects the current route.
  const activeHref = LINKS.find(
    (l) => (pathname === "/" ? l.href === "/" : pathname.startsWith(l.href) && l.href !== "/")
  )?.href;

  return (
    <div className="hdr-wrap">
      <PillNav
        logo={<Crown size={18} />}
        logoAlt="Sampath home"
        logoHref="/"
        items={LINKS}
        activeHref={activeHref}
        linkComponent={Link}
        theme="dark"
        layout="joined"
        itemStyle="pill"
        hoverEffect="fill"
        indicator="dot"
        surface="glass"
        barColor="rgba(255,255,255,0.08)"
        size="md"
        highlightColor="#C8FF00"
        highlightTextColor="#0A0A0A"
        textColor="#F2F2EC"
        bounce={0.3}
        stretch={0.5}
        intro
        collapse="auto"
        ariaLabel="Main"
      />
      <Link href="/contact" className="btn btn-lime hdr-cta">
        Hire me <span aria-hidden="true"><Arrow /></span>
      </Link>
    </div>
  );
}
