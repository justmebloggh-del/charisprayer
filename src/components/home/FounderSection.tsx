"use client";
import Image from "next/image";
import { FOUNDER_NAME, WHATSAPP_CHANNEL } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function FounderSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#070f1e] via-[#0A1628] to-[#0e1d38] relative overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute right-[-80px] top-[-80px] w-[500px] h-[500px] rounded-full border border-amber-400/6 pointer-events-none" />
      <div className="absolute right-[-20px] top-[-20px] w-[350px] h-[350px] rounded-full border border-amber-400/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Portrait */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-[-8px] rounded-3xl bg-gradient-to-br from-amber-400/20 to-purple-600/10 blur-xl" />
              {/* Photo frame */}
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-amber-400/25 shadow-2xl">
                <Image
                  src="/rev-emmanuel.jpg"
                  alt={FOUNDER_NAME}
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/60" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/60" />
              </div>
            </div>

            {/* Name card */}
            <div className="mt-6 bg-amber-400/8 border border-amber-400/25 rounded-2xl px-8 py-4 text-center">
              <div className="font-serif text-white text-xl font-bold">{FOUNDER_NAME}</div>
              <div className="text-amber-400 text-xs tracking-[2px] uppercase mt-1.5">Founder & Lead Pastor</div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-5">
              {[["20+", "Years"], ["5", "Continents"], ["100K+", "Lives"]].map(([v, l]) => (
                <div key={l} className="bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-center">
                  <div className="text-amber-400 text-sm font-bold">{v}</div>
                  <div className="text-white/40 text-xs mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">About The Ministry</div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">A Ministry Born<br />from Grace</h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mb-7 rounded-full" />

            <p className="text-white/65 text-base leading-relaxed mb-5 font-light">
              Rev Emmanuel Oduro Cosby is a seasoned minister of the Gospel with over 20 years of dedicated service. Called by God to ignite a global prayer movement, his ministry has touched thousands of lives across five continents through anointed prayer, teaching, and worship.
            </p>
            <p className="text-white/65 text-base leading-relaxed mb-8 font-light">
              Charis Prayer was birthed from a divine mandate — to build a global community of believers who experience daily encounters with God's presence. Through the platform, lives are transformed, healings manifest, and destinies are restored. Morning prayer begins every day at <strong className="text-amber-400">5:00 AM</strong>, Monday through Sunday.
            </p>

            {/* Mission / Vision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                ["🎯", "Our Mission", "To build a global community of prayer warriors who transform nations through fervent intercession."],
                ["👁", "Our Vision",  "A world awakened by prayer, where every believer walks in the fullness of divine grace and power."],
              ].map(([icon, title, desc]) => (
                <div key={title as string} className="bg-white/4 border border-amber-400/15 rounded-2xl p-5">
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-2">{title as string}</div>
                  <div className="text-white/55 text-sm leading-relaxed font-light">{desc as string}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/about"><Button variant="gold" size="lg">Read Full Biography</Button></Link>
              <a href={WHATSAPP_CHANNEL} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">Join Weekly Sessions</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
