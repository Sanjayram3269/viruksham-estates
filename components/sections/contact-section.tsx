import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";

export function ContactSection() {
  return (
    <div className="bg-[#fbf8f2]">
      <section className="relative overflow-hidden border-b border-[#e3dcd1] bg-[#f0ebe1]">
        <Container className="relative grid gap-10 py-14 sm:py-18 lg:grid-cols-[.85fr_1.15fr] lg:items-end lg:py-20">
          <div><Eyebrow>Get in touch</Eyebrow><h1 className="display-serif mt-5 max-w-2xl text-4xl leading-[1.03] text-[#183327] sm:text-5xl lg:text-6xl">The first step is a <span className="italic text-[#b94c3a]">conversation.</span></h1><p className="mt-6 max-w-lg text-sm leading-7 text-[#716b61] sm:text-base">Tell us what you are looking for. Whether it is a future home, a site visit or a conversation about our work, we will help you find the right next step.</p></div>
          <div className="relative mx-auto h-[230px] w-full max-w-xl overflow-hidden lg:ml-auto"><MediaPlaceholder variant="detail" label="MEET THE VIRUKSHAM TEAM / PHOTO TO BE ADDED" className="h-full" /></div>
        </Container>
      </section>
      <Section className="bg-[#fbf8f2]">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-8 lg:col-span-4">
              <div><p className="editorial-kicker text-[#b94c3a]">We’re here to help</p><h2 className="display-serif mt-3 text-3xl text-[#183327]">Make it a good beginning.</h2><p className="mt-3 text-sm leading-6 text-[#716b61]">Send a note with the details that matter to you. Our team can follow up using your preferred contact method.</p></div>
              <div className="space-y-0 border-y border-[#e3dcd1]">
                <div className="flex gap-4 border-b border-[#e3dcd1] py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee7db] text-[#b94c3a]"><MapPin size={17} /></span><div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#183327]">Office</h3><p className="mt-1 text-sm text-[#716b61]">Chennai, Tamil Nadu, India</p><p className="mt-1 text-[10px] text-[#a09789]">Exact office details can be added when confirmed.</p></div></div>
                <div className="flex gap-4 border-b border-[#e3dcd1] py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee7db] text-[#b94c3a]"><Clock3 size={17} /></span><div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#183327]">Hours</h3><p className="mt-1 text-sm text-[#716b61]">Monday – Saturday</p><p className="mt-1 text-xs text-[#81796d]">9:00 AM – 6:00 PM IST</p></div></div>
                <div className="flex gap-4 py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee7db] text-[#b94c3a]"><MessageCircle size={17} /></span><div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#183327]">Prefer a message?</h3><p className="mt-1 text-sm leading-5 text-[#716b61]">Select WhatsApp or phone as your preferred contact method in the enquiry form.</p></div></div>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-[#183327] transition hover:text-[#b94c3a]">Explore projects first <ArrowUpRight size={14} /></Link>
            </div>
            <div className="border border-[#ded6ca] bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(24,51,39,.06)] sm:p-8 lg:col-span-8 lg:p-10">
              <div className="mb-7 flex items-start justify-between gap-4"><div><p className="editorial-kicker text-[#b94c3a]">Your enquiry</p><h2 className="display-serif mt-2 text-3xl text-[#183327]">Tell us a little more.</h2><p className="mt-2 text-sm text-[#81796d]">Fields marked required help us respond to your request.</p></div><span className="hidden h-11 w-11 shrink-0 items-center justify-center border border-[#e3dcd1] bg-[#f5f0e7] text-[#183327] sm:flex"><Mail size={18} /></span></div>
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
