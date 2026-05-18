"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Play, Pause, Download, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SAMPLE_AUDIOS, PRAYER_CATEGORIES } from "@/lib/constants";
import { useAudio } from "@/context/AudioContext";

export function AudioSection() {
  const [cat, setCat] = useState("All");
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();
  const [audios, setAudios] = useState<any[]>(SAMPLE_AUDIOS);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAudios() {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (data && data.length > 0) {
        setAudios(data);
      }
    }
    fetchAudios();
  }, [supabase]);

  const cats = PRAYER_CATEGORIES.slice(0, 7);
  const list = cat === "All" ? audios : audios.filter(a => a.category === cat);

  return (
    <section className="py-24 bg-[#fafaf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-amber-600 text-xs font-bold tracking-[3.5px] uppercase mb-4">Daily Blessings</div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#0A1628] mb-5">Prayer Audio Library</h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mx-auto mb-5 rounded-full" />
          <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed font-light">Stream or download powerful prayer messages. Let the Holy Spirit minister to you daily — every morning at 5:00 AM.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${cat === c ? "bg-[#0A1628] text-amber-400 shadow-lg" : "bg-white text-gray-500 border border-gray-200 hover:border-amber-300 hover:text-amber-600"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {list.map(audio => {
            const isThisPlaying = isPlaying && currentTrack?.id === audio.id;
            return (
              <div key={audio.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm card-hover ${isThisPlaying ? "ring-2 ring-amber-400" : "border border-gray-100"}`}>
                {/* Cover */}
                <div className="h-36 bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center relative">
                  {audio.featured && <div className="absolute top-3 left-3 bg-amber-400 text-[#0A1628] text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md">FEATURED</div>}
                  <div className="text-center">
                    <div className="text-5xl mb-2">{audio.emoji || "🎵"}</div>
                    {isThisPlaying && (
                      <div className="flex gap-1 justify-center mt-2">
                        {[20, 35, 28, 42, 33].map((h, i) => (
                          <div key={i} className="wave-bar" style={{ height: h, animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-3 bg-black/55 text-white text-xs px-2 py-0.5 rounded font-medium">{audio.duration}</div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="gold">{audio.category || "General"}</Badge>
                    <span className="text-gray-400 text-xs">▶ {audio.plays?.toLocaleString() || 0}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#0A1628] mb-1.5 leading-snug truncate" title={audio.title}>{audio.title}</h3>
                  <div className="text-amber-600 text-xs italic mb-4 truncate">{audio.scripture ? `📖 ${audio.scripture}` : "\u00A0"}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (currentTrack?.id === audio.id) {
                          togglePlayPause();
                        } else {
                          playTrack({
                            id: audio.id,
                            title: audio.title,
                            url: audio.url,
                            category: audio.category,
                            author: "Charis Prayer"
                          });
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#0A1628] text-amber-400 rounded-xl py-2.5 text-sm font-semibold hover:bg-[#1a2e50] transition-colors"
                    >
                      {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isThisPlaying ? "Pause" : "Play"}
                    </button>
                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-300 transition-colors"><Download className="w-4 h-4" /></button>
                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"><Heart className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/prayers">
            <Button variant="dark" size="lg">View Full Audio Library →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
