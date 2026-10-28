import React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Project } from "@/types/project";
import { ProjectMedia } from "./project-media";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
  index?: number;
  featured?: boolean;
}

const statusLabels: Record<string, string> = {
  LIVE: "Now welcoming",
  ONGOING: "In progress",
  COMPLETED: "Completed",
  UPCOMING: "Coming soon",
  SOLD_OUT: "Fully allocated",
};

export function ProjectCard({ project, className, index = 0, featured = false }: ProjectCardProps) {
  const category = project.category?.toLowerCase().replaceAll("_", " ") ?? "development";
  const status = statusLabels[project.status] ?? project.status?.replaceAll("_", " ") ?? "Portfolio";

  return (
    <article
      className={cn(
        "project-card-3d group relative flex h-full flex-col overflow-hidden border border-[#e3dcd1] bg-[#fffdf9]",
        featured ? "lg:col-span-2" : "",
        className
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link href={`/projects/${project.slug}`} aria-label={`Explore ${project.title}`} className="relative block overflow-hidden">
        <div className={cn("project-card-media relative overflow-hidden", featured ? "aspect-[16/9]" : "aspect-[5/4]")}>
          <ProjectMedia type="cover" label={`${project.title} · PROJECT IMAGE`} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102319]/45 via-transparent to-[#102319]/5 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-5 sm:top-5">
            <span className="rounded-full border border-white/40 bg-[#fbf8f2]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.15em] text-[#183327] backdrop-blur-md">{category}</span>
            <span className="rounded-full border border-white/30 bg-[#183327]/65 px-3 py-1.5 text-[9px] font-semibold tracking-wide text-white backdrop-blur-md">{status}</span>
          </div>
          <span className="project-card-arrow absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-[#fbf8f2] text-[#183327] shadow-lg sm:bottom-5 sm:right-5">
            <ArrowUpRight size={18} />
          </span>
          {featured && <span className="absolute bottom-5 left-5 hidden text-[10px] font-semibold uppercase tracking-[.22em] text-white/90 sm:block">Featured development</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.17em] text-[#777267]">
          <MapPin size={12} className="text-[#b94c3a]" />
          <span>{project.location || "Location details coming soon"}</span>
        </div>
        <h3 className="display-serif text-[1.8rem] leading-tight text-[#183327] transition-colors group-hover:text-[#b94c3a] sm:text-[2rem]">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        {project.subtitle && <p className="mt-2 text-sm font-medium text-[#867c6d]">{project.subtitle}</p>}
        <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-[#716b61]">{project.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-[#e7e0d6] pt-5 mt-6">
          <div>
            <p className="editorial-kicker text-[#928879]">Availability</p>
            <p className="mt-1 text-sm font-semibold text-[#183327]">{project.availability || (project.status === "UPCOMING" ? "Enquire for updates" : "Enquire for details")}</p>
          </div>
          <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-[#b94c3a] transition hover:gap-3">
            Discover project <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
