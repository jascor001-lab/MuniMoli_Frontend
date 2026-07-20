import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "mint" | "outline" | "muted";
}

const variants = {
  default: "bg-molina-deep text-white",
  mint: "bg-emerald-100 text-molina-teal",
  outline: "border border-molina-teal text-molina-teal bg-transparent",
  muted: "bg-slate-100 text-molina-muted",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
