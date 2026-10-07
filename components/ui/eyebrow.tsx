import React from "react";
import { cn } from "@/lib/utils";
import { EyebrowProps } from "@/types/ui";

export function Eyebrow({ children, className, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[#2e523c]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
