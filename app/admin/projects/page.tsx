"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDownWideNarrow, ArrowUpRight, Building2, CirclePlus, Eye, LoaderCircle, MapPin, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { Project } from "@/types/project";
import { ProjectMedia } from "@/components/projects/project-media";

const statusStyles: Record<string, string> = {
  LIVE: "border-[#c5d8c7] bg-[#e8f0e7] text-[#28543a]",
  ONGOING: "border-[#e4d3ad] bg-[#f6edda] text-[#866638]",
  COMPLETED: "border-[#d5d9df] bg-[#edf0f2] text-[#56616d]",
  UPCOMING: "border-[#e8c9bf] bg-[#f8e9e3] text-[#9a4837]",
  SOLD_OUT: "border-[#d9d0c3] bg-[#eee8df] text-[#746b5d]",
};

type ProjectsResponse = {
  error?: unknown;
  projects?: unknown;
};

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/admin/projects", { credentials: "include", cache: "no-store" });
  const body = (await response.json().catch(() => ({}))) as ProjectsResponse;
  if (!response.ok) {
    throw new Error(typeof body.error === "string" ? body.error : "Projects could not be loaded.");
  }
  return Array.isArray(body.projects) ? (body.projects as Project[]) : [];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Projects could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialProjects() {
      try {
        const data = await fetchProjects();
        if (cancelled) return;
        setProjects(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Projects could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInitialProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [project.title, project.location, project.slug].some((value) => value?.toLowerCase().includes(query));
    const matchesFilter = filter === "ALL" || (filter === "PUBLISHED" ? Boolean((project as Project & { is_published?: boolean }).is_published) : !Boolean((project as Project & { is_published?: boolean }).is_published));
    return matchesSearch && matchesFilter;
  });

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(`Delete “${project.title}”? This action cannot be undone.`);
    if (!confirmed) return;
    setBusyId(project.id);
    setError(null);
    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectId: project.id }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Project could not be deleted.");
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Project could not be deleted.");
    } finally {
      setBusyId(null);
    }
  }

  const unpublishedCount = projects.filter((p) => !Boolean((p as Project & { is_published?: boolean }).is_published)).length;

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <section className="relative overflow-hidden border border-[#d8d0c3] bg-[#183327] px-6 py-7 text-[#fbf8f2] sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-10 -top-28 h-80 w-80 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><div className="mb-4 flex items-center gap-3"><span className="h-px w-8 bg-[#d97862]" /><span className="editorial-kicker text-white/60">Portfolio management</span></div><h1 className="display-serif text-4xl leading-tight text-[#fbf8f2] sm:text-5xl">Projects, with purpose.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/65">Create and curate the developments visitors see on your public portfolio.</p></div>
          <Link href="/admin/projects/new" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d8b18a] px-5 py-3.5 text-xs font-bold text-[#183327] transition hover:-translate-y-0.5 hover:bg-[#e5c5a5]"><CirclePlus size={16} /> Create project</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border border-[#e3dcd1] bg-[#fffdf9] p-5"><p className="editorial-kicker text-[#81796d]">All projects</p><p className="mt-3 text-3xl text-[#183327]">{loading ? "—" : projects.length}</p><p className="mt-1 text-xs text-[#81796d]">Records in the catalogue</p></div>
        <div className="border border-[#e3dcd1] bg-[#fffdf9] p-5"><p className="editorial-kicker text-[#81796d]">Published</p><p className="mt-3 text-3xl text-[#28543a]">{loading ? "—" : projects.length - unpublishedCount}</p><p className="mt-1 text-xs text-[#81796d]">Visible to public visitors</p></div>
        <div className="border border-[#e3dcd1] bg-[#fffdf9] p-5"><p className="editorial-kicker text-[#81796d]">Drafts</p><p className="mt-3 text-3xl text-[#9a4837]">{loading ? "—" : unpublishedCount}</p><p className="mt-1 text-xs text-[#81796d]">Kept private until published</p></div>
      </section>

      <section className="border border-[#e3dcd1] bg-[#fffdf9]">
        <div className="flex flex-col gap-4 border-b border-[#e3dcd1] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div><h2 className="display-serif text-2xl text-[#183327]">Development catalogue</h2><p className="mt-1 text-xs text-[#81796d]">Manage content and publication state.</p></div>
          <button type="button" onClick={() => void loadProjects()} className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-[#d8d0c3] px-4 py-2.5 text-xs font-semibold text-[#183327] transition hover:bg-[#f3eee6]"><RefreshCw size={14} /> Refresh</button>
        </div>
        <div className="grid gap-3 border-b border-[#e3dcd1] p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <label className="flex items-center gap-3 border border-[#ded7cb] bg-[#fbf8f2] px-3.5 py-3"><Search size={15} className="shrink-0 text-[#948b7e]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, location or slug…" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a49b8e]" /></label>
          <div className="flex items-center gap-2"><ArrowDownWideNarrow size={15} className="text-[#81796d]" /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Publication filter" className="min-h-11 border border-[#ded7cb] bg-[#fbf8f2] px-3 text-xs font-semibold text-[#183327] outline-none"><option value="ALL">All projects</option><option value="PUBLISHED">Published</option><option value="DRAFT">Drafts</option></select></div>
        </div>

        {error && <div role="alert" className="m-5 border border-[#d8aaa0] bg-[#fff4f1] p-4 text-sm text-[#8b3427]">{error}</div>}
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-16 text-sm text-[#81796d]"><LoaderCircle size={18} className="animate-spin" />Loading project catalogue…</div>
        ) : filteredProjects.length === 0 ? (
          <div className="px-6 py-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1ece2] text-[#183327]"><Building2 size={20} /></span><h3 className="display-serif mt-4 text-2xl text-[#183327]">{projects.length ? "No matching projects." : "Your portfolio starts here."}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81796d]">{projects.length ? "Try a different search or publication filter." : "Add your first real development. You can save it as a draft and add original photos later."}</p>{!projects.length && <Link href="/admin/projects/new" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#183327] px-5 py-3 text-xs font-semibold text-white hover:bg-[#284c3a]">Create first project <ArrowUpRight size={14} /></Link>}</div>
        ) : (
          <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const isPublished = Boolean((project as Project & { is_published?: boolean }).is_published);
              return (
                <article key={project.id} className="lift-card overflow-hidden border border-[#e3dcd1] bg-[#fbf8f2]">
                  <div className="relative aspect-[16/9] overflow-hidden"><ProjectMedia label={`${project.title} · PHOTO TO BE ADDED`} className="h-full w-full" /><span className={`absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] ${statusStyles[project.status] ?? statusStyles.UPCOMING}`}>{project.status?.replaceAll("_", " ")}</span><span className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] ${isPublished ? "bg-[#e8f0e7] text-[#28543a]" : "bg-[#f8e9e3] text-[#9a4837]"}`}>{isPublished ? "Published" : "Draft"}</span></div>
                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#b94c3a]">{project.category?.toLowerCase()}</p><h3 className="display-serif mt-2 text-2xl text-[#183327]">{project.title}</h3><p className="mt-2 flex items-center gap-2 text-xs text-[#81796d]"><MapPin size={13} />{project.location || "Location not set"}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-[#716b61]">{project.description || "Add a clear project description to help visitors understand the development."}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#e3dcd1] pt-4">
                      <Link href={`/admin/projects/${project.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-[#183327] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#284c3a]"><Pencil size={13} /> Edit</Link>
                      {isPublished && <Link href={`/projects/${project.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-[#d8d0c3] px-4 py-2.5 text-xs font-semibold text-[#183327] hover:bg-white"><Eye size={13} /> Preview <ArrowUpRight size={12} /></Link>}
                      <button type="button" disabled={busyId === project.id} onClick={() => void deleteProject(project)} className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] px-3 py-2.5 text-xs font-semibold text-[#9a4837] transition hover:bg-[#fff0ec] disabled:opacity-50"><Trash2 size={13} />{busyId === project.id ? "Deleting…" : "Delete"}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
