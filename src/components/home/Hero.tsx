"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_CHANNEL, PRAYER_TIME, YOUTUBE_CHANNEL, YOUTUBE_CHANNEL_ID, YOUTUBE_FALLBACK_VIDEO_ID } from "@/lib/constants";
import { getNextPrayerTime, getCountdown } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const PARTICLES = [
  { x: "8%",  y: "22%", s: 3, d: 0   },
  { x: "87%", y: "15%", s: 4, d: 0.8 },
  { x: "72%", y: "78%", s: 3, d: 1.4 },
  { x: "18%", y: "72%", s: 3, d: 0.5 },
  { x: "55%", y: "10%", s: 2, d: 1.9 },
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function Hero() {
  const [tab, setTab]                 = useState<"live" | "recent">("live");
  const [countdown, setCountdown]     = useState({ h: "00", m: "00", s: "00" });
  const [liveVideo, setLiveVideo]     = useState<any>(null);
  const [recentVideo, setRecentVideo] = useState<any>(null);
  const [playerStarted, setPlayerStarted]   = useState(false);
  const [playerLoading, setPlayerLoading]   = useState(false);
  const [playerError, setPlayerError]       = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data: live } = await supabase.from("videos").select("*").eq("is_live", true)
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (live) setLiveVideo(live);
        const { data: recent } = await supabase.from("videos").select("*").eq("is_live", false)
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (recent) setRecentVideo(recent);
      } catch { /* use fallback */ }
    }
    fetchVideos();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase.channel("public:videos")
        .on("postgres_changes", { event: "*", schema: "public", table: "videos" }, () => fetchVideos())
        .subscribe();
    } catch { /* not configured */ }
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(getNextPrayerTime()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const activeVideo  = tab === "live" ? liveVideo : recentVideo;
  const supabaseYtId = activeVideo ? extractYouTubeId(activeVideo.youtube_url ?? activeVideo.youtubeUrl ?? "") : null;

  const embedSrc = supabaseYtId
    ? `https://www.youtube.com/embed/${supabaseYtId}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&iv_load_policy=3&color=white`
    : YOUTUBE_CHANNEL_ID
    ? `https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}&autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1`
    : `https://www.youtube.com/embed/${YOUTUBE_FALLBACK_VIDEO_ID}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1`;

  const handlePlay = () => { setPlayerLoading(true); setPlayerError(false); setPlayerStarted(true); };

  useEffect(() => {
    setPlayerStarted(false);
    setPlayerLoading(false);
    setPlayerError(false);
  }, [tab]);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#04090f]"
      style={{ marginTop: "-64px", paddingTop: "64px" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0e1d38]" />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 15% 60%, rgba(201,162,39,0.09) 0%, transparent 50%), radial-gradient(ellipse at 85% 20%, rgba(123,47,190,0.07) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.05) 0%, transparent 38%)"
      }} />

      {/* Subtle particles — fewer, much more faint */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-400/20 pointer-events-none animate-float"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, animationDelay: `${p.d}s` }}
        />
      ))}

      {/* Horizontal separator at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 xl:px-8 w-full py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 xl:gap-20 items-center">

          {/* ── LEFT: Copy ── */}
          <div className="animate-slide-up order-2 lg:order-1">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-7 sm:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red flex-shrink-0" />
              <span className="text-white/60 text-[10px] sm:text-[11px] font-semibold tracking-[2px] uppercase">Live Now — Morning Prayer {PRAYER_TIME}</span>
            </div>

            {/* Headline — reduced from text-7xl */}
            <h1 className="font-serif text-[2.4rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold text-white leading-[1.1] mb-5 sm:mb-6">
              Enter the<br />
              <span className="gold-shimmer">Presence</span> of<br />
              God Daily
            </h1>

            <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-md font-light">
              Stream live prayers every morning at{" "}
              <strong className="text-amber-400 font-semibold">5:00 AM</strong>, download anointed messages, and experience the transforming power of God&apos;s grace — Monday to Sunday.
            </p>

            {/* CTA buttons — two primary + text link */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
              <Link href="/prayers">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  🎧 Stream Daily Prayers
                </Button>
              </Link>
              <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  📺 Watch Live
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-4 mb-10 sm:mb-12">
              <Link href="/prayer-request" className="text-white/45 text-sm font-medium hover:text-amber-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-amber-400">
                🙏 Submit a Prayer Request
              </Link>
              <span className="text-white/15">·</span>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#25D366] text-sm font-semibold hover:opacity-80 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Channel
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 flex-wrap border-t border-white/8 pt-8">
              {[["12,400+", "Prayer Warriors"], ["1,200+", "Audio Messages"], ["85+", "Nations Reached"]].map(([v, l]) => (
                <div key={l}>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-gradient-gold">{v}</div>
                  <div className="text-white/35 text-[10px] tracking-[2px] uppercase mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Player card ── */}
          <div className="relative order-1 lg:order-2">
            {/* Soft glow behind card */}
            <div className="absolute -inset-6 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.12) 0%, transparent 70%)" }} />

            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">

              {/* Tabs */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                {(["live", "recent"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      tab === t
                        ? "bg-amber-400/15 border border-amber-400/30 text-amber-400"
                        : "text-white/35 hover:text-white/60"
                    }`}
                  >
                    {t === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red" />}
                    {t === "live" ? "Live Now" : "Recent"}
                  </button>
                ))}
                <div className="ml-auto bg-red-600 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md">LIVE</div>
              </div>

              {/* Video area */}
              <div className="relative bg-[#04090f]" style={{ paddingBottom: "56.25%" }}>
                {playerStarted ? (
                  <div className="absolute inset-0">
                    {playerLoading && (
                      <div className="absolute inset-0 bg-[#04090f] flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                          <p className="text-white/50 text-xs">Loading video…</p>
                        </div>
                      </div>
                    )}
                    {playerError && (
                      <div className="absolute inset-0 bg-[#04090f] flex items-center justify-center z-10">
                        <div className="text-center px-4">
                          <div className="text-2xl mb-3">⚠️</div>
                          <p className="text-white text-sm font-medium mb-1">Video unavailable</p>
                          <p className="text-white/40 text-xs mb-4">Please try again later</p>
                          <button onClick={() => { setPlayerError(false); setPlayerLoading(true); }} className="px-4 py-2 bg-amber-400/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-400/30 transition-colors">
                            Retry
                          </button>
                        </div>
                      </div>
                    )}
                    <iframe
                      className="absolute inset-0 w-full h-full border-0"
                      src={embedSrc}
                      title={activeVideo?.title ?? "Charis Prayer Live"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                      onLoad={() => setPlayerLoading(false)}
                      onError={() => { setPlayerError(true); setPlayerLoading(false); }}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#04090f] to-[#0d1a2e] px-6">
                    <button
                      onClick={handlePlay}
                      className="group relative mb-5 focus:outline-none"
                      aria-label="Watch live on YouTube"
                    >
                      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-2xl shadow-red-900/50 transition-all group-hover:scale-105">
                        <svg viewBox="0 0 24 24" className="w-7 sm:w-8 h-7 sm:h-8 fill-white ml-1">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </button>

                    <div className="font-serif text-white text-lg sm:text-xl font-semibold mb-1 text-center">
                      {tab === "live" ? "Morning Prayer Service" : (activeVideo?.title ?? "Latest Broadcast")}
                    </div>
                    <div className="text-amber-400/70 text-xs sm:text-sm mb-5 text-center">
                      {tab === "live" ? "Click to watch live on YouTube" : "Click to watch on YouTube"}
                    </div>

                    {tab === "live" && (
                      <>
                        <div className="flex gap-2 sm:gap-3 mb-3">
                          {[[countdown.h, "HRS"], [countdown.m, "MIN"], [countdown.s, "SEC"]].map(([v, l]) => (
                            <div key={l as string} className="text-center bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 min-w-[46px] sm:min-w-[54px]">
                              <div className="text-amber-400 text-xl sm:text-2xl font-bold font-mono">{v}</div>
                              <div className="text-white/25 text-[9px] tracking-[2px]">{l}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-white/30 text-xs text-center">Next session · 5:00 AM GMT · Daily</div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Stream info bar */}
              <div className="px-4 py-3 flex items-center justify-between gap-3 border-t border-white/8">
                <div className="min-w-0">
                  <div className="text-white text-xs sm:text-sm font-semibold truncate">
                    {activeVideo?.title ?? "Morning Breakthrough Prayer"}
                  </div>
                  <div className="text-white/35 text-[11px] mt-0.5">Rev Emmanuel Oduro Cosby</div>
                </div>
                <a
                  href={YOUTUBE_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </div>

              {/* Live wave bars */}
              {tab === "live" && (
                <div className="px-4 pb-3 flex items-end gap-1 justify-center">
                  {[16, 28, 22, 36, 28, 32, 20, 26, 18, 34].map((h, i) => (
                    <div key={i} className="wave-bar" style={{ height: h, animationDelay: `${i * 0.09}s` }} />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
