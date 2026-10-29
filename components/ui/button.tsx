import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonProps, ButtonVariant } from "@/types/ui";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#174f35] text-white hover:bg-[#24763d] focus-visible:ring-2 focus-visible:ring-[#24763d] focus-visible:ring-offset-2",
  secondary:
    "bg-[#edf3e5] text-[#103a28] hover:bg-[#dce7d5] focus-visible:ring-2 focus-visible:ring-[#24763d] focus-visible:ring-offset-2",
  outline:
    "border border-[#cfe0c6] bg-transparent text-[#103a28] hover:border-[#24763d] hover:bg-[#edf3e5] focus-visible:ring-2 focus-visible:ring-[#24763d] focus-visible:ring-offset-2",
  ghost:
    "bg-transparent text-[#103a28] hover:bg-[#edf3e5] focus-visible:ring-2 focus-visible:ring-[#24763d] focus-visible:ring-offset-2",
  destructive:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
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
