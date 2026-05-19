import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
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
        <PageHero
          eyebrow="Daily Blessings"
          title="Prayer Audio Library"
          description="Stream or download anointed prayer messages. Morning prayer every day at 5:00 AM."
          stats={[["500+", "Audio Messages"], ["5:00 AM", "Daily Prayer"], ["85+", "Nations Reached"]]}
        />
        <AudioSection />
      </main>
      <Footer />
    </>
  );
}
