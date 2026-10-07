import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";

export function AboutStory() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container>
        <div className="mx-auto max-w-3xl space-y-6">
          <Eyebrow>OUR PHILOSOPHY</Eyebrow>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-5xl leading-tight">
            Building spaces rooted in trust, permanence, and architectural clarity.
          </h1>
          <div className="space-y-4 text-base text-[#645d57] sm:text-lg leading-relaxed pt-4">
            <p>
              Viruksham Estates was founded on a simple principle: real estate development should reflect long-term responsibility to both people and landscape.
            </p>
            <p>
              From meticulously planned residential developments to thoughtfully selected land parcels, our focus remains on creating spaces that foster confidence and enduring value.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
