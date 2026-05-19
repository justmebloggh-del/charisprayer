"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { WHATSAPP_CHANNEL, PRAYER_TIME, YOUTUBE_CHANNEL, YOUTUBE_CHANNEL_ID, YOUTUBE_FALLBACK_VIDEO_ID } from "@/lib/constants";
import { getNextPrayerTime, getCountdown } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

/* Five faint ambient particles — barely visible, purely atmospheric */
const PARTICLES = [
  { x: "8%",  y: "20%", s: 3, d: 0   },
  { x: "88%", y: "14%", s: 3, d: 0.9 },
  { x: "72%", y: "80%", s: 2, d: 1.5 },
  { x: "15%", y: "75%", s: 3, d: 0.4 },
  { x: "52%", y: "8%",  s: 2, d: 2.0 },
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

export function Hero() {
  const [tab, setTab]                 = useState<"live" | "recent">("live");
  const [countdown, setCountdown]     = useState({ h: "00", m: "00", s: "00" });
  const [liveVideo, setLiveVideo]     = useState<any>(null);
  const [recentVideo, setRecentVideo] = useState<any>(null);
  const [playerStarted, setPlayerStarted] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError]     = useState(false);
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
      } catch { /* fallback */ }
    }
    fetchVideos();
    let ch: ReturnType<typeof supabase.channel> | null = null;
    try {
      ch = supabase.channel("public:videos")
        .on("postgres_changes", { event: "*", schema: "public", table: "videos" }, fetchVideos)
        .subscribe();
    } catch { /* not configured */ }
    return () => { if (ch) supabase.removeChannel(ch); };
  }, []); // eslint-disable-line

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(getNextPrayerTime()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const activeVideo  = tab === "live" ? liveVideo : recentVideo;
  const supabaseYtId = activeVideo ? extractYouTubeId(activeVideo.youtube_url ?? activeVideo.youtubeUrl ?? "") : null;
  const embedSrc     = supabaseYtId
    ? `https://www.youtube.com/embed/${supabaseYtId}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&fs=1`
    : YOUTUBE_CHANNEL_ID
    ? `https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}&autoplay=1&mute=1&rel=0&modestbranding=1&controls=1`
    : `https://www.youtube.com/embed/${YOUTUBE_FALLBACK_VIDEO_ID}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1`;

  const handlePlay = () => { setPlayerLoading(true); setPlayerError(false); setPlayerStarted(true); };
  useEffect(() => { setPlayerStarted(false); setPlayerLoading(false); setPlayerError(false); }, [tab]);

  return (
    <section
      className="relative min-h-screen flex items-center bg-[#04090f] overflow-hidden"
      style={{ marginTop: "-64px", paddingTop: "64px" }}
    >
      {/* Background gradients — subtle, not distracting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04090f] via-[#071022] to-[#0A1628]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 15% 60%, rgba(201,162,39,0.07) 0%, transparent 100%), radial-gradient(ellipse 60% 45% at 85% 20%, rgba(90,40,160,0.05) 0%, transparent 100%)" }}
      />
      {PARTICLES.map((p, i) => (
        <div key={i} className="absolute rounded-full bg-amber-400/15 pointer-events-none animate-float"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, animationDelay: `${p.d}s` }} />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full page-container py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">

          {/* ── LEFT: Copy (text-first on all viewports) ── */}
          <div className="text-center lg:text-left animate-slide-up">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/12 rounded-full px-4 py-2 mb-8 sm:mb-9">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red flex-shrink-0" />
              <span className="text-white/55 text-[10px] sm:text-[11px] font-semibold tracking-[2.5px] uppercase">
                Live Now — Morning Prayer {PRAYER_TIME}
              </span>
            </div>

            {/* Headline — fluid clamp typography */}
            <h1 className="text-hero font-serif font-bold text-white mb-6 sm:mb-7">
              Enter the<br />
              <span className="gold-shimmer">Presence</span> of<br />
              God Daily
            </h1>

            {/* Subtext */}
            <p className="text-white/50 text-base sm:text-[1.0625rem] leading-[1.75] mb-9 sm:mb-10 max-w-[440px] mx-auto lg:mx-0 font-light">
              Stream live prayers every morning at{" "}
              <strong className="text-amber-400 font-medium">5:00 AM</strong>, download anointed messages, and experience the transforming power of God&apos;s grace — Monday to Sunday.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
              <Link
                href="/prayers"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold px-7 py-4 rounded-2xl text-sm hover:brightness-105 transition-all shadow-lg shadow-amber-400/20 whitespace-nowrap"
              >
                🎧 Stream Daily Prayers
              </Link>
              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-white/8 border border-white/15 text-white font-semibold px-7 py-4 rounded-2xl text-sm hover:bg-white/14 transition-all whitespace-nowrap"
              >
                📺 Watch Live
              </a>
            </div>

            {/* Secondary links */}
            <div className="flex items-center gap-5 justify-center lg:justify-start mb-10 sm:mb-12">
              <Link
                href="/prayer-request"
                className="text-white/40 text-sm font-medium hover:text-amber-400 transition-colors underline underline-offset-4 decoration-white/15 hover:decoration-amber-400/50"
              >
                🙏 Submit a Prayer Request
              </Link>
              <span className="text-white/15 select-none">·</span>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#25D366]/80 text-sm font-semibold hover:text-[#25D366] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-10 flex-wrap border-t border-white/8 pt-8 sm:pt-9 justify-center lg:justify-start">
              {[["12,400+", "Prayer Warriors"], ["1,200+", "Audio Messages"], ["85+", "Nations Reached"]].map(([v, l]) => (
                <div key={l} className="text-center lg:text-left">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-gradient-gold">{v}</div>
                  <div className="text-white/30 text-[10px] tracking-[2px] uppercase mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Player card ── */}
          <div className="relative">
            {/* Ambient glow */}
            <div
              className="absolute -inset-8 pointer-events-none rounded-3xl"
              style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.1) 0%, transparent 70%)" }}
            />

            <div className="relative bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">

              {/* Tabs */}
              <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b border-white/8">
                {(["live", "recent"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      tab === t
                        ? "bg-amber-400/12 border border-amber-400/25 text-amber-400"
                        : "text-white/30 hover:text-white/55"
                    }`}
                  >
                    {t === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red" />}
                    {t === "live" ? "Live Now" : "Recent"}
                  </button>
                ))}
                <div className="ml-auto bg-red-600 text-white text-[9px] font-black tracking-[3px] px-2.5 py-1 rounded-md">LIVE</div>
              </div>

              {/* Video area — 16:9 */}
              <div className="relative bg-[#04090f]" style={{ paddingBottom: "56.25%" }}>
                {playerStarted ? (
                  <div className="absolute inset-0">
                    {playerLoading && (
                      <div className="absolute inset-0 bg-[#04090f] flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-2 border-amber-400/25 border-t-amber-400 rounded-full animate-spin" />
                      </div>
                    )}
                    {playerError && (
                      <div className="absolute inset-0 bg-[#04090f] flex flex-col items-center justify-center z-10 gap-3">
                        <div className="text-2xl">⚠️</div>
                        <p className="text-white/50 text-xs">Video unavailable</p>
                        <button onClick={() => { setPlayerError(false); setPlayerLoading(true); }}
                          className="text-amber-400 text-xs border border-amber-400/30 px-4 py-1.5 rounded-lg hover:bg-amber-400/10 transition-colors">
                          Retry
                        </button>
                      </div>
                    )}
                    <iframe
                      className="absolute inset-0 w-full h-full border-0"
                      src={embedSrc}
                      title={activeVideo?.title ?? "Charis Prayer Live"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
                      sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                      onLoad={() => setPlayerLoading(false)}
                      onError={() => { setPlayerError(true); setPlayerLoading(false); }}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#04090f] to-[#0d1a2e] px-6">
                    <button onClick={handlePlay} aria-label="Play" className="group relative mb-6">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-2xl shadow-red-900/50 transition-all duration-300 group-hover:scale-105">
                        <svg viewBox="0 0 24 24" className="w-7 sm:w-8 h-7 sm:h-8 fill-white ml-1"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </button>
                    <div className="font-serif text-white text-lg sm:text-xl font-semibold mb-1 text-center">
                      {tab === "live" ? "Morning Prayer Service" : (activeVideo?.title ?? "Latest Broadcast")}
                    </div>
                    <div className="text-amber-400/60 text-xs sm:text-sm mb-5 text-center">
                      {tab === "live" ? "Click to watch live" : "Click to watch"}
                    </div>
                    {tab === "live" && (
                      <>
                        <div className="flex gap-2 sm:gap-3 mb-3">
                          {[[countdown.h, "HRS"], [countdown.m, "MIN"], [countdown.s, "SEC"]].map(([v, l]) => (
                            <div key={l as string} className="text-center bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 min-w-[46px] sm:min-w-[52px]">
                              <div className="text-amber-400 text-xl sm:text-2xl font-bold font-mono tabular-nums">{v}</div>
                              <div className="text-white/25 text-[9px] tracking-[2px]">{l}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-white/25 text-xs text-center">Next session · 5:00 AM GMT · Daily</div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Stream info */}
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 border-t border-white/8">
                <div className="min-w-0">
                  <div className="text-white text-sm font-semibold truncate leading-tight">
                    {activeVideo?.title ?? "Morning Breakthrough Prayer"}
                  </div>
                  <div className="text-white/30 text-[11px] mt-0.5">Rev Emmanuel Oduro Cosby</div>
                </div>
                <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              </div>

              {/* Live wave visualizer */}
              {tab === "live" && (
                <div className="px-5 pb-4 flex items-end gap-1 justify-center">
                  {[14, 24, 18, 32, 24, 28, 16, 22, 14, 30].map((h, i) => (
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
