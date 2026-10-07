import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/lib/content";

export function FeaturedProjects() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="PORTFOLIO"
          title="Featured Projects"
          description="A selection of thoughtfully planned developments and premium spaces."
        />

        {projects.length === 0 ? (
          <EmptyState
            title="Projects are being prepared for publication."
            description="Our curated portfolio of residential and plot developments will be detailed here shortly."
            ctaText="Explore Projects"
            ctaHref="/projects"
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
