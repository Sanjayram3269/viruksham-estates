import React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { SectionHeadingProps } from "@/types/ui";

const alignmentStyles = {
  left: "text-left items-start",
  center: "text-center items-center mx-auto",
  right: "text-right items-end ml-auto",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col space-y-3",
        alignmentStyles[align],
        className
      )}
      {...props}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-[#645d57] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
