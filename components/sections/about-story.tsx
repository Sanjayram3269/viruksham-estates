import React from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, Leaf } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";

export function AboutStory() {
  return (
    <div className="bg-[#fbf8f2]">
      <Section className="relative overflow-hidden bg-[#183327] text-[#fbf8f2]">
        <div className="absolute inset-0 architecture-grid opacity-[0.07]" aria-hidden="true" />
        <Container className="relative grid gap-10 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><Eyebrow className="text-[#e2b39f]">Our philosophy</Eyebrow><h1 className="display-serif mt-6 max-w-4xl text-4xl leading-[1.02] text-[#fbf8f2] sm:text-5xl lg:text-7xl">Building spaces rooted in <span className="italic text-[#e2b39f]">trust, permanence</span> and clarity.</h1><p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base">We believe the right space does more than meet a need. It creates room for belonging, possibility and a stronger connection to place.</p></div>
          <div className="relative mx-auto w-full max-w-lg lg:ml-auto"><div className="absolute -right-3 -top-3 h-full w-full border border-[#d97862]/60" /><div className="relative aspect-[4/4.2] overflow-hidden"><MediaPlaceholder variant="hero" label="COMPANY / ARCHITECTURE PHOTOGRAPH TO BE ADDED" className="h-full" /></div></div>
        </Container>
      </Section>
      <Section className="bg-[#fbf8f2]">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.55fr_1fr] lg:gap-20">
            <div><p className="editorial-kicker text-[#b94c3a]">A point of view</p><p className="display-serif mt-4 text-3xl leading-tight text-[#183327]">Real estate is ultimately about people, not just property.</p></div>
            <div className="space-y-5 text-sm leading-7 text-[#716b61] sm:text-base">
              <p>Viruksham Estates approaches development with a long-term view of how spaces are planned, experienced and cared for. We value clarity in the process and thoughtful decisions in the details.</p>
              <p>From residential possibilities to carefully considered land and commercial spaces, our focus is on helping people make informed choices with confidence. As our portfolio grows, we will share project-specific details and the people behind the work here.</p>
              <div className="grid gap-4 border-t border-[#e3dcd1] pt-6 sm:grid-cols-2">
                <div className="flex gap-3"><Compass size={18} className="mt-1 shrink-0 text-[#b94c3a]" /><div><h2 className="text-sm font-semibold text-[#183327]">Place-led thinking</h2><p className="mt-1 text-xs leading-5">Understand the context before shaping the response.</p></div></div>
                <div className="flex gap-3"><Leaf size={18} className="mt-1 shrink-0 text-[#b94c3a]" /><div><h2 className="text-sm font-semibold text-[#183327]">Long-view decisions</h2><p className="mt-1 text-xs leading-5">Consider how a space will serve people over time.</p></div></div>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 pt-2 text-xs font-bold text-[#183327] hover:text-[#b94c3a]">Explore the portfolio <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
