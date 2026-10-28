import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";

const footerLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Our story", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#13251c] text-[#f7f3ec]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice">
          <path d="M650 420V30H890V130H1040V420M750 420V180H980V420M1020 420V80H1180V420M0 380H1200" fill="none" stroke="white" strokeWidth="1" />
          <path d="M0 320L420 60L650 200L900 20L1200 220" fill="none" stroke="white" strokeWidth="1" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-[1440px] px-5 pb-7 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.4fr_0.7fr_0.8fr] lg:gap-20">
          <div className="max-w-lg">
            <BrandMark inverse />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Thoughtfully considered spaces, grounded in place, made for the lives that unfold within them.
            </p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 border-b border-[#d97862] pb-2 text-sm font-medium text-white transition hover:text-[#edb1a3]">
              Begin a conversation <ArrowUpRight size={15} />
            </Link>
          </div>
          <div>
            <p className="eyebrow-footer">Explore</p>
            <nav className="mt-5 flex flex-col items-start gap-3.5">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-white/65 transition hover:translate-x-1 hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="eyebrow-footer">Get in touch</p>
            <div className="mt-5 flex flex-col gap-4 text-sm text-white/65">
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-[#d97862]" />Chennai, Tamil Nadu, India</p>
              <p className="flex items-start gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-[#d97862]" />Reach us through our enquiry form</p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-white transition hover:text-[#edb1a3]">Send an enquiry <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-6 text-[11px] uppercase tracking-[0.16em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Viruksham Estates. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/admin/login" className="transition hover:text-white">Admin portal</Link>
            <span>Designed with intention</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
