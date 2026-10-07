import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    number: "01",
    title: "Discovery & Consultation",
    description: "Understanding your vision, lifestyle requirements, or investment objectives.",
  },
  {
    number: "02",
    title: "Curated Selection",
    description: "Reviewing site plans, architectural layouts, and verified documentation.",
  },
  {
    number: "03",
    title: "Seamless Acquisition",
    description: "Transparent legal support, structured financing, and clear milestone updates.",
  },
];

export function Journey() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="THE EXPERIENCE"
          title="The Viruksham Journey"
          description="A structured and transparent path to acquiring your space."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative space-y-3 pt-6 border-t border-[#e7e2d9]">
              <span className="text-xs font-semibold tracking-widest text-[#2e523c]">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-[#1c1917]">
                {step.title}
              </h3>
              <p className="text-sm text-[#645d57] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
