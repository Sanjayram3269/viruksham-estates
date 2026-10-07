"use client";

import React, { useState } from "react";
import { ProjectCategory, ProjectStatus } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  onFilterChange?: (filters: {
    category: ProjectCategory | "ALL";
    status: ProjectStatus | "ALL";
  }) => void;
  className?: string;
}

const categories: Array<ProjectCategory | "ALL"> = [
  "ALL",
  "RESIDENTIAL",
  "PLOTS",
  "CONSTRUCTION",
  "COMMERCIAL",
];

export function ProjectFilters({ onFilterChange, className }: ProjectFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "ALL">("ALL");

  const handleCategoryClick = (category: ProjectCategory | "ALL") => {
    setSelectedCategory(category);
    if (onFilterChange) {
      onFilterChange({ category, status: "ALL" });
    }
  };

  return (
    <div className={cn("space-y-4 border-b border-[#e7e2d9] pb-6", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#645d57] mr-2">
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={cn(
              "rounded-sm px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors cursor-pointer",
              selectedCategory === cat
                ? "bg-[#1e3a2b] text-[#faf8f5]"
                : "bg-[#f2ece4] text-[#1c1917] hover:bg-[#e7e2d9]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
