"use client";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "gold" | "dark" | "outline" | "ghost" | "danger" | "whatsapp" | "glass" | "white";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  gold:      "bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold shadow-lg shadow-amber-200/40 hover:shadow-amber-300/50 hover:-translate-y-0.5 hover:brightness-105",
  dark:      "bg-[#0A1628] text-white hover:bg-[#1a2e50] hover:-translate-y-0.5 shadow-md",
  outline:   "bg-transparent border-2 border-amber-400 text-amber-600 hover:bg-amber-50 hover:-translate-y-0.5",
  ghost:     "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800",
  danger:    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  whatsapp:  "bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] hover:-translate-y-0.5 shadow-lg shadow-green-200/40",
  glass:     "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/18 hover:-translate-y-0.5",
  white:     "bg-white text-[#0A1628] font-bold hover:bg-gray-50 hover:-translate-y-0.5 shadow-md",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-sm rounded-2xl gap-2",
  xl: "px-9 py-4 text-base rounded-2xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "gold", size = "md", loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
