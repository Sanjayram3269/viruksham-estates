"use client";

import React, { useState, useEffect } from "react";
import { ProjectCategory, ProjectStatus } from "@/types/project";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  description: string;
  overview?: string;
  highlights?: string[];
  amenities?: string[];
  pricing?: string;
  availability?: string;
  is_published: boolean;
  display_order: number;
  coordinates?: { lat: number; lng: number };
}

interface ProjectsPageState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export default function ProjectsPage() {
  const [state, setState] = useState<ProjectsPageState>({
    projects: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchProjects() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/projects`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch projects");

        const { projects: fetchedProjects } = await res.json();
        setState({
          projects: fetchedProjects || [],
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState({
          projects: [],
          isLoading: false,
          error:
            err instanceof Error ? err.message : "Failed to fetch projects",
        });
        console.error("Error fetching projects:", err);
      }
    }

    fetchProjects();
  }, []);

  const { projects, isLoading, error } = state;

  if (isLoading) {
    return (
      <Section className="bg-[#faf8f5]">
        <Container className="py-12 text-center">
          <svg
            className="h-8 w-8 mx-auto text-stone-400 animate-spin mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="3"
              stroke="currentColor"
            />
          </svg>
          <p>Loading projects...</p>
        </Container>
      </Section>
    );
  }

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
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center">
            <svg
              className="h-8 w-8 mx-auto text-stone-400 animate-spin mb-4"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="3"
                stroke="currentColor"
              />
            </svg>
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
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