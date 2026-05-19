"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CharisLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showText?: boolean;
  textColor?: "white" | "dark";
}

export function CharisLogo({
  size = 44,
  className,
  animated = true,
  showText = true,
  textColor = "dark",
}: CharisLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Logo image uploaded by the user */}
      <div
        className={cn(
          "relative flex-shrink-0 rounded-full overflow-hidden border-2 border-amber-400/30",
          animated && "animate-spin-slow hover:animate-logo-pulse"
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.jpg"
          alt="Charis Praise Center Int."
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Text beside logo */}
      {showText && (
        <div>
          <div
            className={cn(
              "font-serif font-bold leading-none",
              textColor === "white" ? "text-white" : "text-[#0A1628]"
            )}
            style={{ fontSize: size * 0.42 }}
          >
            Charis Prayer
          </div>
          <div
            className="text-[#C9A227] font-medium tracking-widest uppercase"
            style={{ fontSize: size * 0.18, marginTop: 2 }}
          >
            Where Grace Meets Prayer
          </div>
        </div>
      )}
    </div>
  );
}
