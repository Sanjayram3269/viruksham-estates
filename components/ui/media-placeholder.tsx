import React from "react";
import { cn } from "@/lib/utils";

interface MediaPlaceholderProps {
  label?: string;
  className?: string;
}

export function MediaPlaceholder({
  label = "PROJECT MEDIA / COMING SOON",
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-[#f2ece4] text-[#645d57]",
        className
      )}
      aria-label={label}
    >
      {/* Subtle Architectural Grid Treatment */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20 stroke-[#1e3a2b]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="architectural-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#architectural-grid)" />
      </svg>

      {/* Subtle Architectural Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#14261c]/5 via-transparent to-[#faf8f5]/40" />

      {/* Label Badge */}
      <div className="relative z-10 rounded-sm border border-[#e7e2d9] bg-[#faf8f5]/85 px-4 py-2 backdrop-blur-xs shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#2e523c]">
          {label}
        </span>
      </div>
    </div>
  );
}
