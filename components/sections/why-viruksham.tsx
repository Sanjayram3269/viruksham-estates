import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  {
    title: "Architectural Integrity",
    description:
      "Every layout and development is designed with spatial harmony, enduring materials, and structural precision.",
  },
  {
    title: "Transparent Trust",
    description:
      "Clear documentation, honest timelines, and dedicated guidance through every step of property acquisition.",
  },
  {
    title: "Enduring Value",
    description:
      "Strategic location choices and sustainable master planning designed to generate long-term value.",
  },
];

export function WhyViruksham() {
  return (
    <Section className="border-t border-[#e7e2d9] bg-[#f2ece4]/40">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="OUR PRINCIPLES"
          title="Why Viruksham Estates"
          description="Built on principles that ensure confidence and satisfaction in real estate."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-sm border border-[#e7e2d9] bg-[#faf8f5] p-8 space-y-4 shadow-xs"
            >
              <h3 className="text-xl font-semibold tracking-tight text-[#1c1917]">
                {pillar.title}
              </h3>
              <p className="text-sm text-[#645d57] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
