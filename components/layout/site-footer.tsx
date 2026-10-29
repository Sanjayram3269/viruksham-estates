import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";

const footerLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Our story", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];
const officeAddress = "10, Gandhi St, State Bank Of India Colony, Chitlapakkam, Tambaram, Tamil Nadu 600064";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=10%2C%20Gandhi%20St%2C%20State%20Bank%20Of%20India%20Colony%2C%20Chitlapakkam%2C%20Tambaram%2C%20Tamil%20Nadu%20600064";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#103a28] text-[#f8f9f2]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.09]" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice">
          <path d="M650 420V30H890V130H1040V420M750 420V180H980V420M1020 420V80H1180V420M0 380H1200" fill="none" stroke="white" strokeWidth="1" />
          <path d="M0 320L420 60L650 200L900 20L1200 220" fill="none" stroke="#a8cf24" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-[1440px] px-5 pb-7 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.4fr_0.7fr_0.8fr] lg:gap-20">
          <div className="max-w-lg">
            <BrandMark inverse />
            <p className="mt-6 max-w-sm text-base font-medium leading-8 text-white/85">Thoughtfully considered spaces, grounded in place, made for the lives that unfold within them.</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 border-b border-[#a8cf24] pb-2 text-sm font-medium text-white transition hover:text-[#d7f29b]">Begin a conversation <ArrowUpRight size={15} /></Link>
          </div>
          <div>
            <p className="eyebrow-footer">Explore</p>
            <nav className="mt-5 flex flex-col items-start gap-3.5">
              {footerLinks.map((link) => <Link key={link.href} href={link.href} className="text-base font-medium text-white/80 transition hover:translate-x-1 hover:text-white">{link.label}</Link>)}
            </nav>
          </div>
          <div>
            <p className="eyebrow-footer">Visit or contact us</p>
            <div className="mt-5 flex flex-col gap-4 text-sm text-white/70">
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-[#b7d96a]" /><span>{officeAddress}<br /><a href={mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[#d7f29b] underline underline-offset-4 hover:text-white">Get directions</a></span></p>
              <p className="flex items-start gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-[#b7d96a]" />Reach us through our enquiry form</p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-white transition hover:text-[#d7f29b]">Send an enquiry <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-6 text-xs uppercase tracking-[0.16em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Viruksham Estates. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/admin/login" className="inline-flex items-center gap-1.5 transition hover:text-white"><ShieldCheck size={13} /> Admin portal</Link>
            <span>Designed with intention</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
