import React from "react";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { cn } from "@/lib/utils";

interface ProjectMediaProps {
  type?: "cover" | "gallery" | "masterplan" | "walkthrough";
  label?: string;
  className?: string;
}

export function ProjectMedia({ type = "cover", label, className }: ProjectMediaProps) {
  const defaultLabel = label || `PROJECT ${type.toUpperCase()} / PHOTO TO BE ADDED`;
  const variant = type === "masterplan" ? "land" : type === "cover" ? "project" : "detail";

  return (
    <div className={cn("relative h-full min-h-[240px] w-full overflow-hidden", className)}>
      <MediaPlaceholder variant={variant} label={defaultLabel} className="h-full min-h-[240px]" />
    </div>
  );
}
