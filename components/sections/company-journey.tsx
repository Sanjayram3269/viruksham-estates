import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { timeline } from "@/lib/content";

export function CompanyJourney() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="MILESTONES"
          title="Our Journey"
          description="A timeline of growth and project developments."
        />

        {timeline.length === 0 ? (
          <EmptyState
            title="Timeline details are currently being updated."
            description="Historical milestones and key company achievements will be showcased here."
          />
        ) : (
          <div className="space-y-8">
            {timeline.map((item) => (
              <div key={item.id} className="border-l-2 border-[#1e3a2b] pl-6 space-y-1">
                <span className="text-xs font-semibold text-[#2e523c]">{item.year}</span>
                <h3 className="text-lg font-semibold text-[#1c1917]">{item.title}</h3>
                <p className="text-sm text-[#645d57]">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
