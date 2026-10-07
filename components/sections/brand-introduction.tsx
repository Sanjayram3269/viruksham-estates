import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

export function BrandIntroduction() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container>
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Eyebrow>VIRUKSHAM ESTATES</Eyebrow>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl leading-tight">
            Spaces should do more than occupy land. They should create a sense of belonging, possibility and permanence.
          </h2>
          <p className="text-base text-[#645d57] sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Your Trust, Our Commitment. We approach real estate with architectural care, thoughtful planning, and enduring values.
          </p>
          <div className="pt-4">
            <Button href="/about" variant="outline">
              Learn About Our Vision
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
