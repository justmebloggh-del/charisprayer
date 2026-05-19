import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { TestimoniesSection } from "@/components/home/TestimoniesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonies of Grace — Charis Prayer",
  description: "Real stories of healing, breakthrough, and restoration from our global prayer community.",
};

export default function TestimoniesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="God is Moving"
          title="Testimonies of Grace"
          description="Real stories of healing, breakthrough, and restoration from our global prayer community."
          stats={[["12,400+", "Prayer Warriors"], ["1,000+", "Testimonies"], ["85+", "Nations"]]}
        />
        <TestimoniesSection />
      </main>
      <Footer />
    </>
  );
}
