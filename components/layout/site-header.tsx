"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-[#ded8cf]/80 bg-[#fbf8f2]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <BrandMark />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link, index) => (
            <Link key={link.href} href={link.href} className={`nav-link ${index === 1 ? "nav-link-featured" : ""}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/about" className="text-xs font-semibold tracking-wide text-[#6d685f] transition hover:text-[#b94c3a]">
            Our approach
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#183327] px-5 py-3 text-xs font-semibold text-[#fbf8f2] transition hover:-translate-y-0.5 hover:bg-[#284c3a]">
            Start an enquiry <ArrowUpRight size={14} />
          </Link>
        </div>
        <button type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ded8cf] text-[#183327] transition hover:bg-white lg:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-[#ded8cf] bg-[#fbf8f2] px-5 pb-6 pt-3 lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[1440px] flex-col">
            {links.map((link, index) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`flex items-center justify-between border-b border-[#ded8cf]/70 py-4 text-sm ${index === 1 ? "font-semibold text-[#b94c3a]" : "text-[#183327]"}`}>
                {link.label}<ArrowUpRight size={15} />
              </Link>
            ))}
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#183327] px-5 py-3.5 text-sm font-semibold text-white">
              Start an enquiry <ArrowUpRight size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
