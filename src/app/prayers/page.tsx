import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AudioSection } from "@/components/home/AudioSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer Audio Library — Charis Prayer",
  description: "Stream or download anointed prayer messages. Morning prayer every day at 5:00 AM.",
};

export default function PrayersPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0d1e3a] pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.1) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #C9A227 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />

          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <p className="eyebrow mb-4">Daily Blessings</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Prayer Audio Library
            </h1>
            <div className="section-divider" />
            <p className="text-white/50 max-w-md mx-auto font-light leading-relaxed mt-5 text-base sm:text-lg">
              Stream or download anointed prayer messages. Morning prayer every day at 5:00&nbsp;AM.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-10">
              {[
                ["500+", "Audio Messages"],
                ["5:00 AM", "Daily Prayer"],
                ["85+", "Nations Reached"],
              ].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">{v}</div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AudioSection />
      </main>
      <Footer />
    </>
  );
}
