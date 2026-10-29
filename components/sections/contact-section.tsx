import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EnquiryForm } from "@/components/forms/enquiry-form";

const officeAddress = "10, Gandhi St, State Bank Of India Colony, Chitlapakkam, Tambaram, Tamil Nadu 600064";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=10%2C%20Gandhi%20St%2C%20State%20Bank%20Of%20India%20Colony%2C%20Chitlapakkam%2C%20Tambaram%2C%20Tamil%20Nadu%20600064";

export function ContactSection() {
  return (
    <div className="bg-[#f8f9f2]">
      <section className="relative overflow-hidden border-b border-[#dce7d5] bg-[#edf3e5]">
        <Container className="relative grid gap-10 py-14 sm:py-18 lg:grid-cols-[.85fr_1.15fr] lg:items-end lg:py-20">
          <div><Eyebrow>Get in touch</Eyebrow><h1 className="display-serif mt-5 max-w-2xl text-4xl leading-[1.03] text-[#143e2a] sm:text-5xl lg:text-6xl">The first step is a <span className="italic text-[#2b8a45]">conversation.</span></h1><p className="mt-6 max-w-lg text-sm leading-7 text-[#596b5d] sm:text-base">Tell us what you are looking for. Whether it is a future home, a site visit or a conversation about our work, we will help you find the right next step.</p></div>
          <div className="relative mx-auto h-[230px] w-full max-w-xl overflow-hidden lg:ml-auto"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" alt="Contemporary residential architecture and landscaped outdoor space" className="h-full w-full object-cover" loading="lazy" /></div>
        </Container>
      </section>
      <Section className="bg-[#f8f9f2]">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-8 lg:col-span-4">
              <div><p className="editorial-kicker text-[#2b8a45]">We’re here to help</p><h2 className="display-serif mt-3 text-3xl text-[#143e2a]">Make it a good beginning.</h2><p className="mt-3 text-sm leading-6 text-[#596b5d]">Send a note with the details that matter to you. Our team can follow up using your preferred contact method.</p></div>
              <div className="space-y-0 border-y border-[#dce7d5]">
                <div className="flex gap-4 border-b border-[#dce7d5] py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2efcf] text-[#24763d]"><MapPin size={17} /></span><div className="min-w-0"><h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#143e2a]">Office</h3><p className="mt-1 text-sm leading-6 text-[#596b5d]">{officeAddress}</p><a href={mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#24763d] underline decoration-[#a8cf24] underline-offset-4 hover:text-[#143e2a]">Get directions <ArrowUpRight size={13} /></a></div></div>
                <div className="flex gap-4 border-b border-[#dce7d5] py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2efcf] text-[#24763d]"><Clock3 size={17} /></span><div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#143e2a]">Hours</h3><p className="mt-1 text-sm text-[#596b5d]">Monday – Saturday</p><p className="mt-1 text-xs text-[#718171]">9:00 AM – 6:00 PM IST</p></div></div>
                <div className="flex gap-4 py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2efcf] text-[#24763d]"><MessageCircle size={17} /></span><div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#143e2a]">Prefer a message?</h3><p className="mt-1 text-sm leading-5 text-[#596b5d]">Select WhatsApp or phone as your preferred contact method in the enquiry form.</p></div></div>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-[#143e2a] transition hover:text-[#2b8a45]">Explore projects first <ArrowUpRight size={14} /></Link>
            </div>
            <div className="border border-[#d5e1cf] bg-white p-5 shadow-[0_20px_60px_rgba(20,62,42,.08)] sm:p-8 lg:col-span-8 lg:p-10">
              <div className="mb-7 flex items-start justify-between gap-4"><div><p className="editorial-kicker text-[#2b8a45]">Your enquiry</p><h2 className="display-serif mt-2 text-3xl text-[#143e2a]">Tell us a little more.</h2><p className="mt-2 text-sm text-[#718171]">Fields marked required help us respond to your request.</p></div><span className="hidden h-11 w-11 shrink-0 items-center justify-center border border-[#dce7d5] bg-[#f0f6e9] text-[#174f35] sm:flex"><Mail size={18} /></span></div>
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
