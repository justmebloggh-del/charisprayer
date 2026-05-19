import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
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
        <PageHero
          eyebrow="We're Praying For You"
          title="Submit a Prayer Request"
          description="Our dedicated prayer team intercedes for every request. No need is too great or too small."
        />
        <PrayerRequestSection />
      </main>
      <Footer />
    </>
  );
}
