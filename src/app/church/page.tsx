import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Online Church" };

export default function ChurchPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2e50] py-20 text-center">
          <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">Online Church</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Join Us Live</h1>
          <p className="text-white/50 max-w-md mx-auto font-light">Weekly services, live broadcasts, and prayer sessions — Monday to Sunday, starting at 5:00 AM.</p>
        </div>
        <ScheduleSection />
      </main>
      <Footer />
    </>
  );
}
