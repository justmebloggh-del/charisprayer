import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TestimoniesSection } from "@/components/home/TestimoniesSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Testimonies of Grace" };

export default function TestimoniesPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2e50] py-20 text-center">
          <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">God is Moving</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Testimonies of Grace</h1>
          <p className="text-white/50 max-w-md mx-auto font-light">Real stories of healing, breakthrough, and restoration from our global prayer community.</p>
        </div>
        <TestimoniesSection />
      </main>
      <Footer />
    </>
  );
}
