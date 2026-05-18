"use client";
import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "green" | "red" | "blue" | "purple" | "gray" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold:    "bg-amber-100 text-amber-700 border border-amber-200",
  green:   "bg-emerald-100 text-emerald-700 border border-emerald-200",
  red:     "bg-red-100 text-red-600 border border-red-200",
  blue:    "bg-blue-100 text-blue-700 border border-blue-200",
  purple:  "bg-purple-100 text-purple-700 border border-purple-200",
  gray:    "bg-gray-100 text-gray-600 border border-gray-200",
  outline: "bg-transparent text-amber-600 border border-amber-400",
};

export function Badge({ children, variant = "gold", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide", variants[variant], className)}>
      {children}
    </span>
  );
}
