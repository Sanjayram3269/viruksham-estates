import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { JournalCard } from "@/components/journal/journal-card";
import { journalPosts } from "@/lib/content";

export function JournalPreview() {
  return (
    <Section className="border-t border-[#e7e2d9] bg-[#f2ece4]/30">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="PERSPECTIVES"
          title="The Viruksham Journal"
          description="Insights on real estate development, architectural trends, and spatial living."
        />

        {journalPosts.length === 0 ? (
          <EmptyState
            title="The Viruksham Journal is coming soon."
            description="Editorial insights, market analyses, and project announcements will be published here."
            ctaText="Explore Journal"
            ctaHref="/journal"
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {journalPosts.slice(0, 3).map((post) => (
              <JournalCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
