import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectMedia } from "@/components/projects/project-media";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { projects } from "@/lib/content";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (projects.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#faf8f5]">
      {/* Project Hero */}
      <Section className="border-b border-[#e7e2d9] pb-12">
        <Container className="space-y-6">
          <div className="flex items-center space-x-3">
            <Eyebrow>{project.category}</Eyebrow>
            <span className="text-xs text-[#645d57]">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#645d57]">
              {project.status.replace("_", " ")}
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-[#1c1917] sm:text-6xl">
            {project.title}
          </h1>

          <p className="text-lg text-[#645d57]">{project.location}</p>

          <ProjectMedia type="cover" label={`${project.title} COVER MEDIA`} className="h-[400px] w-full" />
        </Container>
      </Section>

      {/* Overview & Highlights */}
      <Section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#1c1917]">Overview</h2>
                <p className="text-base text-[#645d57] leading-relaxed">
                  {project.description}
                </p>
                {project.overview && (
                  <p className="text-base text-[#645d57] leading-relaxed">
                    {project.overview}
                  </p>
                )}
              </div>

              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-[#1c1917]">Project Highlights</h2>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-[#645d57]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1e3a2b]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.amenities && project.amenities.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-[#1c1917]">Amenities</h2>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {project.amenities.map((a, i) => (
                      <li key={i} className="rounded-sm border border-[#e7e2d9] bg-[#f2ece4]/40 p-3 text-sm font-medium text-[#1c1917]">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Masterplan & Walkthrough Architectural Placeholders */}
              <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-semibold text-[#1c1917]">Masterplan & Visuals</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <ProjectMedia type="masterplan" label="MASTERPLAN ARCHITECTURE" className="h-[220px]" />
                  <ProjectMedia type="walkthrough" label="VIRTUAL WALKTHROUGH" className="h-[220px]" />
                </div>
              </div>
            </div>

            {/* Sticky Sidebar Enquiry & Pricing */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 rounded-sm border border-[#e7e2d9] bg-[#faf8f5] p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2e523c]">
                    Availability & Pricing
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-[#1c1917]">
                    {project.pricing || "Pricing upon request"}
                  </p>
                  <p className="text-xs text-[#645d57]">
                    {project.availability || "Contact sales office for current status"}
                  </p>
                </div>

                <div className="border-t border-[#e7e2d9] pt-6">
                  <h4 className="text-sm font-semibold text-[#1c1917] mb-4">
                    Inquire About This Project
                  </h4>
                  <EnquiryForm defaultProjectSlug={project.slug} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
