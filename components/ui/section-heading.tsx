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
    <div className={cn("flex max-w-4xl flex-col gap-4", alignmentStyles[align], className)} {...props}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="display-serif text-3xl leading-[1.04] text-[#183327] sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="max-w-2xl text-sm leading-7 text-[#716b61] sm:text-base">{description}</p>}
    </div>
  );
}
