"use client";
import Image from "next/image";
import { FOUNDER_NAME, WHATSAPP_CHANNEL } from "@/lib/constants";
import Link from "next/link";

const STATS = [["20+", "Years of Ministry"], ["5", "Continents"], ["100K+", "Lives Impacted"]];

export function FounderSection() {
  return (
    <section className="section-py bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 xl:gap-24 items-center">

          {/* ── Portrait ── */}
          <div className="flex flex-col items-center lg:items-start">

            {/* Photo */}
            <div className="relative mb-8 sm:mb-10">
              {/* Soft glow */}
              <div
                className="absolute -inset-6 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.1) 0%, transparent 68%)" }}
              />
              <div className="relative w-56 sm:w-64 lg:w-72 xl:w-80 rounded-[1.75rem] overflow-hidden border border-amber-200/50 shadow-2xl shadow-amber-100/30">
                <div style={{ paddingBottom: "125%" }} className="relative">
                  <Image
                    src="/rev-emmanuel.jpg"
                    alt={FOUNDER_NAME}
                    fill
                    sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 320px"
                    className="object-cover object-top"
                    priority
                  />
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/45 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/45 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Name card */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-4 text-center mb-5 w-full max-w-xs">
              <div className="font-serif text-[#0A1628] text-lg font-bold">{FOUNDER_NAME}</div>
              <div className="text-amber-600 text-[11px] tracking-[2px] uppercase mt-1">Founder &amp; Lead Pastor</div>
            </div>

            {/* Mini stats */}
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
              {STATS.map(([v, l]) => (
                <div key={l} className="bg-[#fafaf8] border border-gray-100 rounded-xl px-4 py-3 text-center">
                  <div className="text-amber-600 text-sm font-bold">{v}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bio ── */}
          <div className="text-center lg:text-left">
            <p className="eyebrow mb-4">About The Ministry</p>
            <h2 className="text-section font-serif font-bold text-[#0A1628] mb-5">
              A Ministry Born<br />from Grace
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mb-7 rounded-full mx-auto lg:mx-0" />

            <p className="text-gray-500 text-[1.0rem] leading-[1.8] mb-5 font-light max-w-[520px] mx-auto lg:mx-0">
              Rev Emmanuel Oduro Cosby is a seasoned minister of the Gospel with over 20&nbsp;years of dedicated service. Called by God to ignite a global prayer movement, his ministry has touched thousands of lives across five continents through anointed prayer, teaching, and worship.
            </p>
            <p className="text-gray-500 text-[1.0rem] leading-[1.8] mb-10 font-light max-w-[520px] mx-auto lg:mx-0">
              Charis Prayer was birthed from a divine mandate — to build a global community of believers who experience daily encounters with God&apos;s presence. Morning prayer begins every day at{" "}
              <strong className="text-amber-600 font-semibold">5:00 AM</strong>, Monday through Sunday.
            </p>

            {/* Mission / Vision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                ["🎯", "Our Mission", "To build a global community of prayer warriors who transform nations through fervent intercession."],
                ["👁", "Our Vision",  "A world awakened by prayer, where every believer walks in the fullness of divine grace and power."],
              ].map(([icon, title, desc]) => (
                <div key={title as string} className="bg-[#fafaf8] border border-gray-100 rounded-2xl p-6 text-left hover:border-amber-200 hover:shadow-sm transition-all duration-200">
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="text-amber-600 font-bold text-[10px] tracking-[2.5px] uppercase mb-2">{title as string}</div>
                  <div className="text-gray-500 text-sm leading-[1.7] font-light">{desc as string}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
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
                className="inline-flex items-center gap-2 bg-[#25D366]/8 border border-[#25D366]/25 text-[#25D366] font-semibold px-6 py-3.5 rounded-2xl text-sm hover:bg-[#25D366]/14 transition-all"
              >
                Join Weekly Sessions
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
    </section>
  );
}
