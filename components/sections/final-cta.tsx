import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export function FinalCta() {
  return (
    <Section className="bg-[#14261c] text-[#f8f9f2]">
      <Container>
        <div className="mx-auto max-w-3xl space-y-6 text-center py-8">
          <Eyebrow className="text-[#f8f9f2]/80">START A CONVERSATION</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-[#f8f9f2] sm:text-5xl">
            Ready to discover your next space?
          </h2>
          <p className="text-base text-[#f8f9f2]/80 sm:text-lg leading-relaxed max-w-xl mx-auto">
            Connect with the Viruksham Estates team to discuss upcoming projects, site visits, or tailored solutions.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button href="/contact" variant="primary" className="border border-[#d7f29b] bg-[#a8cf24] px-8 py-4 text-base font-extrabold text-[#103a28] hover:bg-[#d7f29b]">
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
