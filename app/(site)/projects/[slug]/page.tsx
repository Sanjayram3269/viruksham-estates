import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, MapPin, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectMedia } from "@/components/projects/project-media";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { createClient } from "@/lib/supabase/server";
import { getCatalogProject } from "@/components/projects/catalog";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

const statusLabels: Record<string, string> = {
  CATALOG: "Contact us for current details",
  LIVE: "Now welcoming enquiries",
  ONGOING: "In progress",
  COMPLETED: "Completed development",
  UPCOMING: "Coming soon",
  SOLD_OUT: "Fully allocated",
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  const project = data ?? getCatalogProject(slug);
  if (!project) notFound();
  const highlights = Array.isArray(project.highlights) ? project.highlights.filter((item: unknown): item is string => typeof item === "string") : [];
  const amenities = Array.isArray(project.amenities) ? project.amenities.filter((item: unknown): item is string => typeof item === "string") : [];
  const galleryItems = [project.title + " · Architecture", project.title + " · Site context", project.title + " · Masterplan"];

  return (
    <div className="min-h-screen bg-[#f8f9f2]">
      <section className="relative overflow-hidden bg-[#174f35] text-[#f8f9f2]">
        <div className="absolute inset-0 architecture-grid opacity-[0.07]" aria-hidden="true" />
        <Container className="relative py-8 sm:py-10">
          <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-semibold text-white/65 transition hover:text-white"><ArrowLeft size={14} /> Back to the portfolio</Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2"><Eyebrow className="text-[#d7f29b]">{project.category}</Eyebrow><span className="text-white/30">/</span><span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.13em] text-white/80">{project.catalogOnly ? "Contact us for current details" : statusLabels[project.status] ?? project.status.replaceAll("_", " ")}</span></div>
              <h1 className="display-serif max-w-4xl text-4xl leading-[.98] text-[#f8f9f2] sm:text-5xl lg:text-7xl">{project.title}</h1>
              {project.subtitle && <p className="mt-4 text-base text-white/65 sm:text-lg">{project.subtitle}</p>}
              <p className="mt-5 flex items-center gap-2 text-sm text-white/65"><MapPin size={15} className="text-[#d7f29b]" />{project.location}</p>
            </div>
            <div className="border-t border-white/20 pt-5 lg:ml-auto lg:w-full lg:max-w-sm"><p className="editorial-kicker text-white/50">Availability & pricing</p><p className="display-serif mt-3 text-2xl text-[#f8f9f2] sm:text-3xl">{project.pricing || "Pricing on request"}</p><p className="mt-2 text-xs leading-5 text-white/55">{project.availability || "Contact the team for the latest availability."}</p></div>
          </div>
        </Container>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-5 sm:px-8 lg:px-12 lg:py-8">
        <div className="relative overflow-hidden"><ProjectMedia type="cover" label={`${project.title} · MAIN PROJECT PHOTOGRAPH TO BE ADDED`} className="aspect-[16/9] max-h-[680px] w-full sm:aspect-[2/1]" /><div className="absolute bottom-4 left-4 border border-white/50 bg-[#f8f9f2]/85 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.15em] text-[#174f35] backdrop-blur-md sm:bottom-6 sm:left-6">Project imagery placeholder</div></div>
      </section>

      <Section className="bg-[#f8f9f2]">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:gap-16">
            <div className="space-y-12">
              <section><Eyebrow>Project overview</Eyebrow><h2 className="display-serif mt-4 text-3xl leading-tight text-[#174f35] sm:text-4xl">A closer look at {project.title}.</h2><p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#596b5d] sm:text-base">{project.description || "Project details are being prepared. Send an enquiry and our team can share the latest information."}</p>{project.overview && <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#596b5d] sm:text-base">{project.overview}</p>}</section>

              {highlights.length > 0 && <section className="border-t border-[#dce7d5] pt-8"><Eyebrow>What sets it apart</Eyebrow><h2 className="display-serif mt-3 text-3xl text-[#174f35]">Project highlights</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{highlights.map((highlight: string, index: number) => <div key={`${highlight}-${index}`} className="flex items-start gap-3 border border-[#dce7d5] bg-[#f5f0e7] p-4"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e5eade] text-[#24763d]"><Check size={13} /></span><p className="text-sm leading-5 text-[#514f46]">{highlight}</p></div>)}</div></section>}

              <section className="border-t border-[#dce7d5] pt-8"><Eyebrow>Gallery</Eyebrow><h2 className="display-serif mt-3 text-3xl text-[#174f35]">The details, in context.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#718171]">Original photographs, plans and renders can be added here when the project assets are available.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{galleryItems.map((label, index) => <div key={label} className={`overflow-hidden ${index === 0 ? "sm:col-span-2" : ""}`}><ProjectMedia type={index === 2 ? "masterplan" : "gallery"} label={label} className={index === 0 ? "aspect-[16/9]" : "aspect-[4/5]"} /></div>)}</div></section>

              {amenities.length > 0 && <section className="border-t border-[#dce7d5] pt-8"><Eyebrow>Considered details</Eyebrow><h2 className="display-serif mt-3 text-3xl text-[#174f35]">Amenities & features</h2><div className="mt-5 flex flex-wrap gap-2">{amenities.map((amenity: string, index: number) => <span key={`${amenity}-${index}`} className="border border-[#d5e1cf] bg-[#f4efe7] px-4 py-2.5 text-xs font-medium text-[#5f6257]">{amenity}</span>)}</div></section>}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div id="enquire" className="scroll-mt-28 border border-[#dce7d5] bg-[#edf3e5] p-5 sm:p-7">
                <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfe7dc] text-[#24763d]"><ShieldCheck size={17} /></span><div><p className="text-xs font-bold text-[#174f35]">Talk to our team</p><p className="mt-0.5 text-[10px] text-[#718171]">Ask us about this development</p></div></div>
                <div className="my-6 border-t border-[#d8cfc1]" /><h2 className="display-serif text-2xl text-[#174f35]">Make an enquiry.</h2><p className="mt-2 text-xs leading-5 text-[#596b5d]">Share your details and preferred contact method. The team can follow up with project-specific information.</p><div className="mt-6"><EnquiryForm defaultProjectSlug={project.slug} /></div>
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[#9a9184]">Availability and pricing may change. Please confirm the current details with the Viruksham Estates team.</p>
            </aside>
          </div>
        </Container>
      </Section>

      <section className="border-t border-[#dce7d5] bg-[#edf3e5]"><Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between"><div><p className="editorial-kicker text-[#2b8a45]">Keep exploring</p><p className="display-serif mt-2 text-2xl text-[#174f35]">Find another place that feels right.</p></div><Link href="/projects" className="inline-flex items-center gap-2 self-start rounded-full border border-[#c9c0b3] px-5 py-3.5 text-xs font-semibold text-[#174f35] transition hover:border-[#174f35] hover:bg-white sm:self-auto">Back to all projects <ArrowUpRight size={14} /></Link></Container></section>
    </div>
  );
}
