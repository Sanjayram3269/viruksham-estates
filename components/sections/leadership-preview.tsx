import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { leadership } from "@/lib/content";

export function LeadershipPreview() {
  return (
    <Section className="border-t border-[#dce7d5] bg-[#edf3e5]/30">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="LEADERSHIP"
          title="Guided by Experience"
          description="The team driving Viruksham Estates forward."
        />

        {leadership.length === 0 ? (
          <EmptyState
            title="Leadership profiles will be published here."
            description="Our executive team and strategic advisors will be introduced shortly."
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {leadership.map((member) => (
              <div key={member.id} className="rounded-sm border border-[#dce7d5] bg-[#f8f9f2] p-6 space-y-2">
                <h3 className="text-lg font-semibold text-[#1c1917]">{member.name}</h3>
                <p className="text-xs text-[#2e523c] font-medium">{member.role}</p>
                {member.bio && <p className="text-sm text-[#596b5d]">{member.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
