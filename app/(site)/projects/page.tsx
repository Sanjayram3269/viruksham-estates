import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";


export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const projects = data || [];

  return (
    <Section className="bg-[#faf8f5]">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="PROJECT CATALOGUE"
          title="Our Developments"
          description="Explore residential communities, premium plots, and commercial spaces by Viruksham Estates."
        />

        <ProjectFilters />

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
            <svg
              className="h-4 w-4 text-red-600 flex-shrink-0 mr-2"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c-1.1 0-2-.9-2-2v-4c0-1.1-.9-2-2-2zm-8 2c0-1.1-.89-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.89 2 2 2h4c1.1 0-2-.9-2-2v-4zm-2 8c0 1.1.89 2 2 2h4c-1.1 0-2-.9-2-2v-4c0 1.1.89 2-2 2H6zM6 10c0-1.1.89-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.89 2-2-2H6v-4zm14-4h-4c0-1.1.9-2 2-2v4c0-1.1.9-2 2-2h4c1.1 0 2-.9 2-2v-4c0-1.1.9-2 2-2zm-4 6h-2v-2h2v2zM6 18h2v-2H6v2zm0-4h2v-2H6v2z"
                clipRule="evenodd"
              />
            </svg>
            <span>Something went wrong while loading the project catalogue. Please try again later.</span>
          </div>
        )}

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
            {projects
              .filter((p) => p.is_published)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        )}
      </Container>
    </Section>
  );
}