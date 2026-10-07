import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { JournalCard } from "@/components/journal/journal-card";
import { journalPosts } from "@/lib/content";

export function JournalGrid() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="JOURNAL"
          title="Articles & Insights"
          description="Reflections on architecture, market perspectives, and real-estate solutions."
        />

        {journalPosts.length === 0 ? (
          <EmptyState
            title="The Viruksham Journal is coming soon."
            description="We are currently crafting our first series of editorial publications and industry insights."
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {journalPosts.map((post) => (
              <JournalCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
