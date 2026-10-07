import React from "react";
import { cn } from "@/lib/utils";
import { SectionProps } from "@/types/ui";

export function Section({
  children,
  className,
  id,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24 lg:py-32", className)}
      {...props}
    >
      {children}
    </section>
  );
}
