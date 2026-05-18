import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FounderSection } from "@/components/home/FounderSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — Rev Emmanuel Oduro Cosby" };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <FounderSection />
      </main>
      <Footer />
    </>
  );
}
