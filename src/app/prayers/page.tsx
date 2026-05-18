import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AudioSection } from "@/components/home/AudioSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Prayer Audio Library" };

export default function PrayersPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2e50] py-20 text-center">
          <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">Daily Blessings</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Prayer Audio Library</h1>
          <p className="text-white/50 max-w-md mx-auto font-light">Stream or download anointed prayer messages. Morning prayer every day at 5:00 AM.</p>
        </div>
        <AudioSection />
      </main>
      <Footer />
    </>
  );
}
