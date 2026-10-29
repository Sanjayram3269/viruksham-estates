import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  {
    title: "Quality First",
    description: "Prioritizing structural standards and spatial efficiency in every project.",
  },
  {
    title: "Complete Transparency",
    description: "Ensuring all land documentation, approvals, and terms are fully open and clear.",
  },
  {
    title: "Customer Commitment",
    description: "Dedicated support throughout the journey from inquiry to property possession.",
  },
];

export function CompanyValues() {
  return (
    <Section className="border-t border-[#dce7d5] bg-[#edf3e5]/40">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="CORE VALUES"
          title="What Guides Us"
          description="The core tenets behind every Viruksham Estates project."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-sm border border-[#dce7d5] bg-[#f8f9f2] p-8 space-y-3 shadow-xs"
            >
              <h3 className="text-xl font-semibold tracking-tight text-[#1c1917]">
                {v.title}
              </h3>
              <p className="text-sm text-[#596b5d] leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
