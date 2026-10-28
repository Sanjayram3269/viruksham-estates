"use client";

import React, { useState } from "react";
import { ProjectCategory, ProjectStatus } from "@/types/project";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface ProjectFiltersProps {
  onFilterChange?: (filters: {
    category: ProjectCategory | "ALL";
    status: ProjectStatus | "ALL";
  }) => void;
  className?: string;
}

const categories: Array<ProjectCategory | "ALL"> = ["ALL", "RESIDENTIAL", "PLOTS", "CONSTRUCTION", "COMMERCIAL"];
const statuses: Array<ProjectStatus | "ALL"> = ["ALL", "LIVE", "ONGOING", "UPCOMING", "COMPLETED", "SOLD_OUT"];

function label(value: string) {
  return value === "ALL" ? "All projects" : value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ProjectFilters({ onFilterChange, className }: ProjectFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "ALL">("ALL");

  const publish = (category: ProjectCategory | "ALL", status: ProjectStatus | "ALL") => {
    onFilterChange?.({ category, status });
  };

  return (
    <div className={cn("space-y-4 border-y border-[#e3dcd1] py-4", className)}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#81796d]"><SlidersHorizontal size={13} /> Category</span>
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => { setSelectedCategory(category); publish(category, selectedStatus); }} aria-pressed={selectedCategory === category} className={cn("rounded-full border px-3.5 py-2 text-[10px] font-semibold transition-all duration-200", selectedCategory === category ? "border-[#183327] bg-[#183327] text-[#fbf8f2]" : "border-[#ded7cb] bg-transparent text-[#716b61] hover:border-[#b94c3a] hover:text-[#183327]")}>
              {label(category)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#81796d]"><span>Status</span><select aria-label="Filter projects by status" value={selectedStatus} onChange={(event) => { const status = event.target.value as ProjectStatus | "ALL"; setSelectedStatus(status); publish(selectedCategory, status); }} className="min-h-10 min-w-36 border border-[#ded7cb] bg-[#fbf8f2] px-3 text-xs font-medium normal-case tracking-normal text-[#183327] outline-none focus:border-[#b94c3a]">{statuses.map((status) => <option value={status} key={status}>{label(status)}</option>)}</select></label>
      </div>
    </div>
  );
}
