import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="PROJECT CATALOGUE"
          title="Our Developments"
          description="Explore residential communities, premium plots, and commercial spaces by Viruksham Estates."
        />

        <ProjectFilters />

        {projects.length === 0 ? (
          <EmptyState
            title="No projects are currently published."
            description="Our project portfolio is being prepared. Please check back soon or get in touch for upcoming developments."
            ctaText="Inquire About Upcoming Projects"
            ctaHref="/contact"
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
