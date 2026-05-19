import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { YOUTUBE_CHANNEL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Church — Charis Prayer",
  description: "Weekly services, live broadcasts, and prayer sessions — Monday to Sunday, starting at 5:00 AM.",
};

export default function ChurchPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0d1e3a] pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.09) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #C9A227 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />

          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-red flex-shrink-0" />
              <span className="text-red-400 text-[11px] font-black tracking-[3px] uppercase">Broadcasting Live Daily</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Online Church
            </h1>
            <div className="section-divider" />
            <p className="text-white/50 max-w-md mx-auto font-light leading-relaxed mt-5 text-base sm:text-lg">
              Weekly services, live broadcasts, and prayer sessions — Monday to Sunday, starting at 5:00&nbsp;AM.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold px-7 py-3.5 rounded-2xl text-sm hover:brightness-105 transition-all shadow-lg shadow-amber-400/20"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Live on YouTube
              </a>
              <a
                href="#schedule"
                className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/15 text-white font-semibold px-7 py-3.5 rounded-2xl text-sm hover:bg-white/14 transition-all"
              >
                View Service Schedule
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12">
              {[
                ["7", "Services / Week"],
                ["5:00 AM", "Prayer Start"],
                ["50K+", "Live Viewers"],
              ].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">{v}</div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="schedule">
          <ScheduleSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
