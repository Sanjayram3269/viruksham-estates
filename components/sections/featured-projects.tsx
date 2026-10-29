import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, House, Leaf, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/projects/project-card";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_CATALOG } from "@/components/projects/catalog";

export async function FeaturedProjects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .limit(3);

  const projects = data?.length ? data : PROJECT_CATALOG.slice(0, 3);

  return (
    <Section className="relative overflow-hidden bg-[#f0ebe1]">
      <Container className="space-y-11 sm:space-y-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#2b8a45]" />
              <span className="editorial-kicker text-[#777267]">A considered collection</span>
            </div>
            <h2 className="display-serif text-4xl leading-[1.02] text-[#174f35] sm:text-5xl lg:text-6xl">Places with a <span className="italic text-[#2b8a45]">point of view.</span></h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#596b5d] sm:text-base">Discover spaces shaped with care — from thoughtfully planned homes to places that bring people together.</p>
          </div>
          <Link href="/projects" className="group inline-flex w-fit items-center gap-3 border-b border-[#2b8a45]/70 pb-2 text-xs font-bold uppercase tracking-[.14em] text-[#174f35]">
            Explore all projects <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} featured={index === 0} className={index === 0 ? "md:col-span-2 lg:col-span-1" : ""} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { number: "01", title: "Homes with intention", text: "Residential spaces designed around the rhythms of everyday life.", icon: House, tone: "from-[#d8d7c7] to-[#b2c0ae]", label: "RESIDENTIAL COLLECTION", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" },
              { number: "02", title: "Room to grow", text: "Land and plotted development concepts with a long view.", icon: Compass, tone: "from-[#d8cdb6] to-[#a9b49a]", label: "LAND & PLOTS", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80" },
              { number: "03", title: "Places that connect", text: "Spaces that bring people, work and neighbourhoods together.", icon: Leaf, tone: "from-[#d4d5ca] to-[#9ba99d]", label: "COMMERCIAL & COMMUNITY", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.number} className="lift-card group overflow-hidden border border-[#d9d1c4] bg-[#f8f9f2]">
                  <div className={`architecture-grid relative flex aspect-[5/4] items-end overflow-hidden bg-gradient-to-br ${item.tone} bg-cover bg-center p-5 sm:p-6`} style={{ backgroundImage: `linear-gradient(180deg, rgba(15,42,28,.08), rgba(15,42,28,.46)), url(${item.image})` }}>
                    <div className="absolute inset-0 opacity-50 transition-transform duration-700 group-hover:scale-105" aria-hidden="true">
                      <svg viewBox="0 0 460 330" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
                        <path d="M50 330V90L190 32L330 75V330Z" fill="#f6f0e5" fillOpacity=".72" stroke="#174f35" strokeOpacity=".25" />
                        <path d="M83 112L190 69L295 104V330H83Z" fill="#536e62" fillOpacity=".65" />
                        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${98 + (i%4)*49} 100V330M${80} ${145 + Math.floor(i/4)*90}H298`} stroke="#f8f3e9" strokeWidth="3" strokeOpacity=".72" />)}
                        <path d="M0 300L130 260L255 287L460 230V330H0Z" fill="#174f35" fillOpacity=".28" />
                      </svg>
                    </div>
                    <span className="relative z-10 rounded-full border border-white/70 bg-[#f8f9f2]/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.17em] text-[#174f35] backdrop-blur-md">{item.label}</span>
                    <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#174f35] backdrop-blur-sm transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"><Icon size={18} /></span>
                    <span className="absolute left-5 top-5 text-[10px] font-semibold tracking-[.2em] text-[#174f35]/60">{item.number}</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="display-serif text-2xl text-[#174f35]">{item.title}</h3>
                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#596b5d]">{item.text}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-[#dce7d5] pt-4">
                      <span className="text-[10px] uppercase tracking-[.15em] text-[#918879]">Portfolio preview</span>
                      <Link href="/projects" aria-label={`Explore ${item.title}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8d0c4] text-[#174f35] transition hover:border-[#2b8a45] hover:bg-[#2b8a45] hover:text-white"><ArrowUpRight size={15} /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div className="flex flex-col items-start gap-4 border-t border-[#d7cfc2] pt-6 text-xs text-[#596b5d] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2"><Sparkles size={14} className="text-[#2b8a45]" /> Original project photography will replace these portfolio previews as assets are supplied.</p>
          <Link href="/contact" className="font-semibold text-[#174f35] underline decoration-[#2b8a45]/60 underline-offset-4 transition hover:text-[#2b8a45]">Ask about upcoming projects</Link>
        </div>
      </Container>
    </Section>
  );
}
