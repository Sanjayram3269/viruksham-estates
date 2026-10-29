"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, ShieldCheck } from "lucide-react";
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
    <header className="site-header sticky top-0 z-50 border-b border-[#dce7d5]/90 bg-[#fbfcf7]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <BrandMark />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe0c6] px-3.5 py-2.5 text-sm font-bold text-[#174f35] transition hover:border-[#2b8a45] hover:bg-[#eef6e8]">
            <ShieldCheck size={14} /> Admin
          </Link>
          <Link href="/about" className="px-2 text-sm font-bold tracking-wide text-[#596b5d] transition hover:text-[#24763d]">
            Our approach
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#174f35] px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#24763d]">
            Start an enquiry <ArrowUpRight size={14} />
          </Link>
        </div>
        <button type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#cfe0c6] text-[#174f35] transition hover:bg-[#eef6e8] lg:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-[#dce7d5] bg-[#fbfcf7] px-5 pb-6 pt-3 lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[1440px] flex-col">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-[#dce7d5]/90 py-4 text-sm text-[#174f35]">
                {link.label}<ArrowUpRight size={15} />
              </Link>
            ))}
            <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#cfe0c6] px-5 py-3.5 text-sm font-semibold text-[#174f35]">
              <ShieldCheck size={15} /> Admin portal <ArrowUpRight size={15} />
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#174f35] px-5 py-3.5 text-sm font-semibold text-white">
              Start an enquiry <ArrowUpRight size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
