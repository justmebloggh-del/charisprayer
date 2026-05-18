import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PrayerRequestSection } from "@/components/home/PrayerRequestSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Submit a Prayer Request" };

export default function PrayerRequestPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2e50] py-20 text-center">
          <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">We're Praying For You</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Submit a Prayer Request</h1>
          <p className="text-white/50 max-w-md mx-auto font-light">Our dedicated prayer team intercedes for every request. No need is too great or too small.</p>
        </div>
        <PrayerRequestSection />
      </main>
      <Footer />
    </>
  );
}
