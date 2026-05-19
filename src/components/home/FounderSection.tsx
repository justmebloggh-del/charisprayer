"use client";
import Image from "next/image";
import { FOUNDER_NAME, WHATSAPP_CHANNEL } from "@/lib/constants";
import Link from "next/link";

export function FounderSection() {
  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Portrait column */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative mb-8">
              {/* Soft gold glow */}
              <div className="absolute -inset-4 rounded-3xl opacity-60" style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.12) 0%, transparent 70%)" }} />

              {/* Photo frame */}
              <div className="relative w-60 sm:w-72 lg:w-80 aspect-[3/4] rounded-3xl overflow-hidden border border-amber-200/60 shadow-2xl shadow-amber-100/40">
                <Image
                  src="/rev-emmanuel.jpg"
                  alt={FOUNDER_NAME}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 288px, 320px"
                  className="object-cover object-top"
                  priority
                />
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-amber-400/50" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-amber-400/50" />
              </div>
            </div>

            {/* Name card */}
            <div className="bg-[#fafaf7] border border-amber-200/60 rounded-2xl px-6 py-4 text-center lg:text-left">
              <div className="font-serif text-[#0A1628] text-xl font-bold">{FOUNDER_NAME}</div>
              <div className="text-amber-600 text-xs tracking-[2px] uppercase mt-1">Founder &amp; Lead Pastor</div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mt-5">
              {[["20+", "Years"], ["5", "Continents"], ["100K+", "Lives"]].map(([v, l]) => (
                <div key={l} className="bg-[#fafaf7] border border-gray-100 rounded-xl px-4 py-3 text-center">
                  <div className="text-amber-600 text-sm font-bold">{v}</div>
                  <div className="text-gray-400 text-[11px] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio column */}
          <div>
            <p className="eyebrow mb-4">About The Ministry</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-5 leading-tight">
              A Ministry Born<br />from Grace
            </h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mb-7 rounded-full" />

            <p className="text-gray-500 text-base leading-relaxed mb-5 font-light">
              Rev Emmanuel Oduro Cosby is a seasoned minister of the Gospel with over 20 years of dedicated service. Called by God to ignite a global prayer movement, his ministry has touched thousands of lives across five continents through anointed prayer, teaching, and worship.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-8 font-light">
              Charis Prayer was birthed from a divine mandate — to build a global community of believers who experience daily encounters with God&apos;s presence. Morning prayer begins every day at{" "}
              <strong className="text-amber-600 font-semibold">5:00 AM</strong>, Monday through Sunday.
            </p>

            {/* Mission / Vision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                ["🎯", "Our Mission", "To build a global community of prayer warriors who transform nations through fervent intercession."],
                ["👁", "Our Vision",  "A world awakened by prayer, where every believer walks in the fullness of divine grace and power."],
              ].map(([icon, title, desc]) => (
                <div key={title as string} className="bg-[#fafaf7] border border-gray-100 rounded-2xl p-5 hover:border-amber-200 hover:shadow-sm transition-all">
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="text-amber-600 font-bold text-xs tracking-wider uppercase mb-2">{title as string}</div>
                  <div className="text-gray-500 text-sm leading-relaxed font-light">{desc as string}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold px-6 py-3.5 rounded-2xl text-sm hover:brightness-105 transition-all shadow-md shadow-amber-200/50"
              >
                Read Full Biography
              </Link>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-semibold px-6 py-3.5 rounded-2xl text-sm hover:bg-[#25D366]/15 transition-all"
              >
                Join Weekly Sessions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
