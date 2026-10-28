import React from "react";
import { ArrowUpRight, Check, Layers3, MapPinned, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const pillars = [
  { number: "01", title: "Architectural integrity", description: "A clear relationship between proportion, material and everyday function.", icon: Layers3 },
  { number: "02", title: "Transparent trust", description: "Straightforward information and considered guidance through each step.", icon: ShieldCheck },
  { number: "03", title: "Enduring value", description: "A long-view perspective on location, community and the life of a place.", icon: MapPinned },
];

export function WhyViruksham() {
  return (
    <Section className="relative overflow-hidden bg-[#fbf8f2]">
      <Container className="space-y-12">
        <div className="grid gap-7 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div><div className="mb-5 flex items-center gap-3"><span className="h-px w-9 bg-[#b94c3a]" /><span className="editorial-kicker text-[#81796d]">What guides us</span></div><h2 className="display-serif max-w-xl text-4xl leading-[1.04] text-[#183327] sm:text-5xl lg:text-6xl">The details make the <span className="italic text-[#b94c3a]">difference.</span></h2></div>
          <p className="max-w-xl text-sm leading-7 text-[#716b61] lg:ml-auto lg:pb-1 sm:text-base">Our principles shape how we think about land, architecture and the experience of making a property decision. They are commitments to work towards — not substitute claims for proof.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.number} className="lift-card group relative overflow-hidden border border-[#e3dcd1] bg-[#f4efe7] p-6 sm:p-7">
                <div className="absolute -right-4 -top-6 select-none font-serif text-[120px] leading-none text-[#183327]/[0.045] transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-1">{pillar.number}</div>
                <div className="relative flex items-center justify-between"><span className="editorial-kicker text-[#b94c3a]">{pillar.number} / Principle</span><span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cfc1] bg-[#fbf8f2] text-[#183327] transition group-hover:border-[#b94c3a] group-hover:text-[#b94c3a]"><Icon size={17} /></span></div>
                <h3 className="display-serif relative mt-10 text-2xl text-[#183327] sm:text-3xl">{pillar.title}</h3>
                <p className="relative mt-3 min-h-[72px] text-sm leading-6 text-[#716b61]">{pillar.description}</p>
                <div className="relative mt-6 flex items-center gap-2 border-t border-[#ddd4c7] pt-4 text-[10px] font-bold uppercase tracking-[.14em] text-[#81796d]"><Check size={13} className="text-[#b94c3a]" /> A principle in practice</div>
              </article>
            );
          })}
        </div>
        <div className="flex flex-col gap-4 border-t border-[#e3dcd1] pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-lg text-xs leading-5 text-[#81796d]">Want to understand how these principles translate into our work?</p><Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold text-[#183327] transition hover:text-[#b94c3a]">Read our story <ArrowUpRight size={14} /></Link></div>
      </Container>
    </Section>
  );
}
