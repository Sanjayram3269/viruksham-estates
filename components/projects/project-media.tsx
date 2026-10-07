import React from "react";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { cn } from "@/lib/utils";

interface ProjectMediaProps {
  type?: "cover" | "gallery" | "masterplan" | "walkthrough";
  label?: string;
  className?: string;
}

export function ProjectMedia({
  type = "cover",
  label,
  className,
}: ProjectMediaProps) {
  const defaultLabel = label || `PROJECT ${type.toUpperCase()} / COMING SOON`;

  return (
    <div className={cn("relative overflow-hidden rounded-sm", className)}>
      <MediaPlaceholder label={defaultLabel} className="min-h-[240px]" />
    </div>
  );
}
