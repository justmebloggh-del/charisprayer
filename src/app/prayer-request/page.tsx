import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PrayerRequestSection } from "@/components/home/PrayerRequestSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Prayer Request — Charis Prayer",
  description: "Our dedicated prayer team intercedes for every request. No need is too great or too small.",
};

export default function PrayerRequestPage() {
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
            <p className="eyebrow mb-4">We&apos;re Praying For You</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Submit a Prayer Request
            </h1>
            <div className="section-divider" />
            <p className="text-white/50 max-w-md mx-auto font-light leading-relaxed mt-5 text-base sm:text-lg">
              Our dedicated prayer team intercedes for every request. No need is too great or too small.
            </p>
          </div>
        </div>

        <PrayerRequestSection />
      </main>
      <Footer />
    </>
  );
}
