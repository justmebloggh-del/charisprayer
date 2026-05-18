import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { AudioSection } from "@/components/home/AudioSection";
import { FounderSection } from "@/components/home/FounderSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { TestimoniesSection } from "@/components/home/TestimoniesSection";
import { PrayerRequestSection } from "@/components/home/PrayerRequestSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AudioSection />
        <FounderSection />
        <ScheduleSection />
        <TestimoniesSection />
        <PrayerRequestSection />
      </main>
      <Footer />
    </>
  );
}
