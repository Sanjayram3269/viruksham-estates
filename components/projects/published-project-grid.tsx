"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Project, ProjectCategory, ProjectStatus } from "@/types/project";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilters } from "@/components/projects/project-filters";

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

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex w-full max-w-md items-center gap-3 border border-[#cfe0c6] bg-white px-3.5 py-3">
          <Search size={15} className="shrink-0 text-[#2b8a45]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search projects" placeholder="Search by project or location…" className="w-full bg-transparent text-sm text-[#174f35] outline-none placeholder:text-[#899889]" />
        </label>
        <p className="text-xs text-[#596b5d]">{filtered.length} {filtered.length === 1 ? "project" : "projects"} shown</p>
      </div>
      <ProjectFilters className="mt-4" onFilterChange={setFilters} />
      {filtered.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
      ) : (
        <div className="mt-8 border border-[#dce7d5] bg-[#edf3e5] px-6 py-14 text-center">
          <h3 className="display-serif text-2xl text-[#174f35]">Nothing in this selection yet.</h3>
          <p className="mt-2 text-sm text-[#596b5d]">Try another category, status or search.</p>
          <button type="button" onClick={() => { setFilters({ category: "ALL", status: "ALL" }); setQuery(""); }} className="mt-5 rounded-full border border-[#cfe0c6] px-5 py-3 text-xs font-semibold text-[#174f35] hover:bg-white">Clear all filters</button>
        </div>
      )}
    </>
  );
}
