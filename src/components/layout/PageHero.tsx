import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  stats?: [string, string][];
  badge?: ReactNode;
  actions?: ReactNode;
}

export function PageHero({ eyebrow, title, description, stats, badge, actions }: PageHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0d1e3a] pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.09) 0%, transparent 55%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(circle, #C9A227 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-5 sm:px-6">
        {badge && <div className="mb-6 flex justify-center">{badge}</div>}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-hero font-serif font-bold text-white mb-5">{title}</h1>
        <div className="section-divider" />
        {description && (
          <div className="text-white/50 max-w-md mx-auto font-light leading-[1.75] mt-5 text-sm sm:text-base">
            {description}
          </div>
        )}
        {actions && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {actions}
          </div>
        )}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-10">
            {stats.map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">{v}</div>
                <div className="text-white/40 text-xs uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
