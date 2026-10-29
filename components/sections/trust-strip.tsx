import React from "react";
import { ArrowUpRight, BadgeCheck, DraftingCompass, MapPinned } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const principles = [
  { icon: DraftingCompass, label: "Design thinking", detail: "A thoughtful relationship between plan, place and daily life." },
  { icon: MapPinned, label: "Sense of place", detail: "Development decisions informed by the character of each location." },
  { icon: BadgeCheck, label: "Clear communication", detail: "A straightforward, considered experience from first enquiry onwards." },
];

export function TrustStrip() {
  return (
    <Section className="border-y border-[#e3dcd1] bg-[#f1ece3] py-0">
      <Container>
        <div className="grid divide-y divide-[#d8d0c3] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="group flex gap-4 py-6 sm:px-5 sm:py-8 lg:px-8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d4c8b8] bg-[#fbf8f2] text-[#b94c3a] transition group-hover:-translate-y-1 group-hover:border-[#b94c3a]"><Icon size={17} /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#9a4b39]">0{index + 1} / Principle</p><h3 className="mt-2 text-sm font-semibold text-[#183327]">{item.label}</h3><p className="mt-1.5 max-w-xs text-xs leading-5 text-[#81796d]">{item.detail}</p></div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
