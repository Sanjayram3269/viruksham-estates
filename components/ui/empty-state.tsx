import React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { Button } from "./button";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  ctaText,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-sm border border-[#e7e2d9] bg-[#faf8f5] px-6 py-16 text-center shadow-xs",
        className
      )}
    >
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h3 className="text-xl font-semibold tracking-tight text-[#1c1917] sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-[#645d57] sm:text-base leading-relaxed">
        {description}
      </p>
      {ctaText && ctaHref && (
        <div className="mt-6">
          <Button href={ctaHref} variant="outline">
            {ctaText}
          </Button>
        </div>
      )}
    </div>
  );
}
