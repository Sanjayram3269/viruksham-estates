import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonProps, ButtonVariant } from "@/types/ui";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#14261c] text-[#faf8f5] hover:bg-[#1e3a2b] focus-visible:ring-2 focus-visible:ring-[#14261c] focus-visible:ring-offset-2",
  secondary:
    "bg-[#f2ece4] text-[#1c1917] hover:bg-[#e7e2d9] focus-visible:ring-2 focus-visible:ring-[#1c1917] focus-visible:ring-offset-2",
  outline:
    "border border-[#e7e2d9] bg-transparent text-[#1c1917] hover:border-[#645d57] hover:bg-[#f2ece4]/50 focus-visible:ring-2 focus-visible:ring-[#1c1917] focus-visible:ring-offset-2",
  ghost:
    "bg-transparent text-[#1c1917] hover:bg-[#f2ece4]/60 focus-visible:ring-2 focus-visible:ring-[#1c1917] focus-visible:ring-offset-2",
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", disabled, href, children, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
      variantStyles[variant],
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        className={baseClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
