"use client";
import { cn } from "@/lib/utils";

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
      {/* Logo circle — SVG recreation of the Charis Praise Center Int. logo */}
      <div
        className={cn("relative flex-shrink-0", animated && "animate-logo-pulse")}
        style={{ width: size, height: size }}
      >
        {/* Outer silver ring */}
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={cn(animated && "animate-logo-glow")}
          style={{ display: "block" }}
        >
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9B3FD4" />
              <stop offset="100%" stopColor="#6B1FA0" />
            </radialGradient>
            <linearGradient id="silverRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8E8E8" />
              <stop offset="40%" stopColor="#C0C0C0" />
              <stop offset="70%" stopColor="#A8A8A8" />
              <stop offset="100%" stopColor="#D8D8D8" />
            </linearGradient>
            <linearGradient id="goldArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A227" />
              <stop offset="50%" stopColor="#F5D785" />
              <stop offset="100%" stopColor="#C9A227" />
            </linearGradient>
          </defs>

          {/* Silver border ring */}
          <circle cx="50" cy="50" r="49" fill="url(#silverRing)" />
          {/* Purple background */}
          <circle cx="50" cy="50" r="45" fill="url(#bgGrad)" />

          {/* Church / arches icon — white */}
          {/* Left small arch */}
          <path
            d="M18 68 L18 52 Q18 42 26 42 Q34 42 34 52 L34 68"
            fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"
          />
          {/* Left arch base horizontal */}
          <line x1="14" y1="68" x2="38" y2="68" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

          {/* Center tall arch */}
          <path
            d="M36 68 L36 46 Q36 28 50 28 Q64 28 64 46 L64 68"
            fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"
          />
          {/* Cross on top of center arch */}
          <line x1="50" y1="18" x2="50" y2="28" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="44" y1="22" x2="56" y2="22" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

          {/* Right small arch */}
          <path
            d="M66 68 L66 52 Q66 42 74 42 Q82 42 82 52 L82 68"
            fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"
          />
          {/* Right arch base horizontal */}
          <line x1="62" y1="68" x2="86" y2="68" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

          {/* Gold arc under arches */}
          <path
            d="M20 72 Q50 80 80 72"
            fill="none" stroke="url(#goldArc)" strokeWidth="3" strokeLinecap="round"
          />

          {/* CHARIS text */}
          <text x="50" y="84" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="1.5">CHARIS</text>
          {/* PRAISE CENTER INT. text */}
          <text x="50" y="93" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="600" fontFamily="Arial,sans-serif" letterSpacing="0.8">PRAISE CENTER INT.</text>
        </svg>
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
