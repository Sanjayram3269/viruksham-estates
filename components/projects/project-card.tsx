import React from "react";
import { Project } from "@/types/project";
import { ProjectMedia } from "./project-media";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-sm border border-[#e7e2d9] bg-[#faf8f5] transition-all hover:border-[#1e3a2b]",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f2ece4]">
        <ProjectMedia type="cover" label={project.title} className="h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#2e523c]">
            <span>{project.category}</span>
            <span className="rounded-xs border border-[#e7e2d9] bg-[#f2ece4] px-2 py-0.5 text-[10px] text-[#645d57]">
              {project.status.replace("_", " ")}
            </span>
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-[#1c1917] group-hover:text-[#1e3a2b]">
            {project.title}
          </h3>

          <p className="text-xs font-medium text-[#645d57]">
            {project.location}
          </p>

          <p className="text-sm text-[#645d57] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#e7e2d9]">
          <Button href={`/projects/${project.slug}`} variant="outline" className="w-full">
            Explore Project
          </Button>
        </div>
      </div>
    </article>
  );
}
