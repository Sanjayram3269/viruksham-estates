"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Project, ProjectCategory, ProjectStatus } from "@/types/project";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilters } from "@/components/projects/project-filters";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import Link from "next/link";

type PublishedProject = Project & { is_published?: boolean };

export function PublishedProjectGrid({ projects }: { projects: PublishedProject[] }) {
  const [filters, setFilters] = useState<{ category: ProjectCategory | "ALL"; status: ProjectStatus | "ALL" }>({ category: "ALL", status: "ALL" });
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => projects.filter((project) => {
    const categoryMatch = filters.category === "ALL" || project.category === filters.category;
    const statusMatch = filters.status === "ALL" || project.status === filters.status;
    const q = query.trim().toLowerCase();
    const searchMatch = !q || [project.title, project.location, project.description, project.slug].some((value) => value?.toLowerCase().includes(q));
    return categoryMatch && statusMatch && searchMatch;
  }), [projects, filters, query]);

  if (projects.length === 0) {
    return (
      <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="flex flex-col justify-between border border-[#e3dcd1] bg-[#f1ece2] p-7 sm:p-9">
          <div><p className="editorial-kicker text-[#b94c3a]">The next chapter</p><h3 className="display-serif mt-4 text-3xl leading-tight text-[#183327] sm:text-4xl">Good places are worth waiting for.</h3><p className="mt-4 max-w-md text-sm leading-7 text-[#716b61]">Our public catalogue is being prepared. Speak with the team to hear about upcoming developments and availability.</p></div>
          <Link href="/contact" className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#183327] px-5 py-3.5 text-xs font-semibold text-white transition hover:bg-[#284c3a]">Enquire about upcoming projects <ArrowUpRight size={15} /></Link>
        </div>
        <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px]"><MediaPlaceholder variant="hero" label="PROJECT IMAGERY WILL BE ADDED HERE" className="absolute inset-0 h-full" /><div className="absolute right-4 top-4 border border-white/50 bg-[#fbf8f2]/85 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.15em] text-[#183327] backdrop-blur-md">Portfolio preview</div></div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><label className="flex w-full max-w-md items-center gap-3 border border-[#ded7cb] bg-[#fffdf9] px-3.5 py-3"><Search size={15} className="shrink-0 text-[#948b7e]" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search published projects" placeholder="Search by project or location…" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a49b8e]" /></label><p className="text-xs text-[#81796d]">{filtered.length} {filtered.length === 1 ? "project" : "projects"} shown</p></div>
      <ProjectFilters className="mt-4" onFilterChange={setFilters} />
      {filtered.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">{filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} featured={index === 0 && filtered.length > 2} />)}</div> : <div className="mt-8 border border-[#e3dcd1] bg-[#f4efe7] px-6 py-14 text-center"><h3 className="display-serif text-2xl text-[#183327]">Nothing in this selection yet.</h3><p className="mt-2 text-sm text-[#716b61]">Try another category, status or search.</p><button type="button" onClick={() => { setFilters({ category: "ALL", status: "ALL" }); setQuery(""); }} className="mt-5 rounded-full border border-[#d2c8b9] px-5 py-3 text-xs font-semibold text-[#183327] hover:bg-white">Clear all filters</button></div>}
    </>
  );
}
