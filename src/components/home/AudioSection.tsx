"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Play, Pause, Download, Music } from "lucide-react";
import { SAMPLE_AUDIOS, PRAYER_CATEGORIES } from "@/lib/constants";
import { useAudio } from "@/context/AudioContext";

const CATS = ["All", ...PRAYER_CATEGORIES.filter(c => c !== "All").slice(0, 6)];

export function AudioSection() {
  const [cat, setCat] = useState("All");
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();
  const [audios, setAudios] = useState<any[]>(SAMPLE_AUDIOS);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await supabase.from("audios").select("*").order("created_at", { ascending: false }).limit(8);
        if (data && data.length > 0) setAudios(data);
      } catch { /* use sample data */ }
    }
    fetch();
  }, []); // eslint-disable-line

  const list = cat === "All" ? audios : audios.filter(a => a.category === cat);

  return (
    <section className="py-24 sm:py-32 bg-[#0A1628] relative overflow-hidden">
      {/* Top separator glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
      {/* Subtle line grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(rgba(201,162,39,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Section header */}
        <div className="text-center mb-14 sm:mb-18">
          <p className="eyebrow mb-3">Daily Blessings</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Prayer Audio Library
          </h2>
          <div className="section-divider" />
          <p className="text-white/45 max-w-md mx-auto text-sm sm:text-base leading-relaxed font-light mt-5">
            Stream anointed prayer messages. Let the Holy Spirit minister to you daily — every morning at 5:00&nbsp;AM.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 sm:mb-12">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                cat === c
                  ? "bg-amber-400 text-[#0A1628] shadow-lg shadow-amber-400/25"
                  : "bg-white/6 text-white/55 border border-white/10 hover:border-amber-400/35 hover:text-amber-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Audio grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
          {list.map(audio => {
            const active = isPlaying && currentTrack?.id === audio.id;
            return (
              <div
                key={audio.id}
                className={`group relative bg-white/[0.04] rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                  active
                    ? "border-amber-400/45 shadow-xl shadow-amber-400/10 bg-white/7"
                    : "border-white/8 hover:border-white/18 hover:bg-white/7"
                }`}
              >
                {/* Cover */}
                <div className="relative h-36 sm:h-40 bg-gradient-to-br from-[#1a2e50] to-[#0d1f3c] flex items-center justify-center overflow-hidden">
                  {audio.featured && (
                    <span className="absolute top-3 left-3 bg-amber-400 text-[#0A1628] text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg uppercase">
                      Featured
                    </span>
                  )}
                  <span className="text-5xl select-none group-hover:scale-110 transition-transform duration-500">
                    {audio.emoji || "🎵"}
                  </span>

                  {/* Active wave bars */}
                  {active && (
                    <div className="absolute bottom-3 left-0 right-0 flex gap-0.5 justify-center px-4">
                      {[16, 28, 20, 36, 26].map((h, i) => (
                        <div key={i} className="wave-bar" style={{ height: h, animationDelay: `${i * 0.11}s` }} />
                      ))}
                    </div>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/55 text-white/70 text-[10px] font-mono px-2 py-0.5 rounded-md">
                    {audio.duration}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                  <span className="inline-block text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-2">
                    {audio.category || "General"}
                  </span>
                  <h3 className="text-white text-sm font-semibold leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">
                    {audio.title}
                  </h3>
                  {audio.scripture && (
                    <p className="text-white/30 text-[11px] italic mb-4 truncate">📖 {audio.scripture}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        currentTrack?.id === audio.id
                          ? togglePlayPause()
                          : playTrack({ id: audio.id, title: audio.title, url: audio.url, category: audio.category, author: "Charis Prayer" })
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        active
                          ? "bg-amber-400 text-[#0A1628]"
                          : "bg-white/8 text-white hover:bg-amber-400 hover:text-[#0A1628]"
                      }`}
                    >
                      {active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {active ? "Pause" : "Play"}
                    </button>
                    <button
                      onClick={() => {
                        if (audio.url) {
                          const a = document.createElement("a");
                          a.href = audio.url;
                          a.download = `${audio.title}.mp3`;
                          a.target = "_blank";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }
                      }}
                      className="p-2.5 rounded-xl bg-white/5 text-white/35 hover:text-amber-400 hover:bg-white/10 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/prayers"
            className="inline-flex items-center gap-2.5 border border-amber-400/35 text-amber-400 hover:bg-amber-400 hover:text-[#0A1628] font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-sm"
          >
            <Music className="w-4 h-4" />
            Browse Full Audio Library
          </Link>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}
