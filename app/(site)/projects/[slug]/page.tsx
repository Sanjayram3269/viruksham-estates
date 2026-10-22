import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectMedia } from "@/components/projects/project-media";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { cn } from "@/lib/utils";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  // Fetch all projects and find the matching published one
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/projects`, {
    credentials: "include",
  });

  if (!res.ok) {
    notFound();
  }

  const { projects } = await res.json();
  const project = projects.find((p: any) => p.slug === slug && p.is_published);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#faf8f5]">
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

          <ProjectMedia
            type="cover"
            label={`${project.title} COVER MEDIA`}
            className="h-[400px] w-full"
          />
        </Container>
      </Section>

      <Section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
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

            <div className="lg:col-span-4">
              <div
                className="sticky top-8 rounded-sm border border-[#e7e2d9] bg-[#faf8f5] p-6 shadow-xs space-y-6"
              >
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2e523c]">
                    Availability & Pricing
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-[#1c1917]">
                    {project.pricing || "Pricing upon request"}
                  </p>
                  <p className="text-xs text-[#645d57]">
                    {project.availability ||
                      "Contact sales office for current status"}
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