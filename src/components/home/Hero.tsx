"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_CHANNEL, PRAYER_TIME, YOUTUBE_CHANNEL, YOUTUBE_CHANNEL_ID, YOUTUBE_FALLBACK_VIDEO_ID } from "@/lib/constants";
import { getNextPrayerTime, getCountdown } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const PARTICLES = [
  { x: "8%",  y: "20%", s: 5, d: 0   }, { x: "88%", y: "12%", s: 7, d: 0.6 },
  { x: "78%", y: "75%", s: 4, d: 1.2 }, { x: "15%", y: "78%", s: 6, d: 0.9 },
  { x: "55%", y: "8%",  s: 4, d: 0.3 }, { x: "92%", y: "55%", s: 3, d: 1.5 },
  { x: "35%", y: "92%", s: 5, d: 0.7 }, { x: "65%", y: "5%",  s: 3, d: 1.8 },
  { x: "25%", y: "45%", s: 4, d: 2.1 }, { x: "72%", y: "38%", s: 6, d: 0.4 },
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
  const [tab, setTab] = useState<"live" | "recent">("live");
  const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" });
  const [liveVideo, setLiveVideo] = useState<any>(null);
  const [recentVideo, setRecentVideo] = useState<any>(null);
  const [playerStarted, setPlayerStarted] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data: live } = await supabase
          .from("videos").select("*").eq("is_live", true)
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (live) setLiveVideo(live);

        const { data: recent } = await supabase
          .from("videos").select("*").eq("is_live", false)
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (recent) setRecentVideo(recent);
      } catch {
        // Supabase not configured — use fallback
      }
    }
    fetchVideos();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel("public:videos")
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

  const activeVideo = tab === "live" ? liveVideo : recentVideo;
  const supabaseYtId = activeVideo ? extractYouTubeId(activeVideo.youtube_url ?? activeVideo.youtubeUrl ?? "") : null;

  // Build embed src: prefer Supabase video → channel live stream → fallback video
  // Always produces a valid embed — never falls back to window.open
  // Enhanced parameters for better in-app playback
  const embedSrc = supabaseYtId
    ? `https://www.youtube.com/embed/${supabaseYtId}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&color=white&theme=dark`
    : YOUTUBE_CHANNEL_ID
    ? `https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}&autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&color=white&theme=dark`
    : `https://www.youtube.com/embed/${YOUTUBE_FALLBACK_VIDEO_ID}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&color=white&theme=dark`;

  const handlePlay = () => {
    // Always embed inline — never open a new window
    setPlayerLoading(true);
    setPlayerError(false);
    setPlayerStarted(true);
  };

  // Reset player when tab changes
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
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0e1d38]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 55%, rgba(201,162,39,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 25%, rgba(123,47,190,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.06) 0%, transparent 40%)" }} />

      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full border border-amber-400/7 pointer-events-none hidden sm:block" />
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full border border-amber-400/5 pointer-events-none hidden sm:block" />

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-400/70 pointer-events-none animate-float"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, animationDelay: `${p.d}s` }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">

          {/* LEFT — Copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 mb-5 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-red flex-shrink-0" />
              <span className="text-amber-400 text-[10px] sm:text-xs font-bold tracking-[2px] sm:tracking-[2.5px] uppercase">Live Now — Morning Prayer {PRAYER_TIME}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.08] mb-4 sm:mb-7">
              Enter the<br />
              <span className="gold-shimmer">Presence</span> of<br />
              God Daily
            </h1>

            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-7 sm:mb-10 max-w-lg font-light">
              Stream live prayers every morning at <strong className="text-amber-400 font-semibold">5:00 AM</strong>, download anointed messages, and experience the transforming power of God's grace. Join thousands worldwide — Monday to Sunday.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-7 sm:mb-12">
              <Link href="/prayers">
                <Button variant="gold" size="lg">🎧 Daily Prayers</Button>
              </Link>
              <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
                <Button variant="dark" size="lg" className="border border-white/10 text-white bg-white/10 hover:bg-white/15">📺 Join Live</Button>
              </a>
              <Link href="/prayer-request">
                <Button variant="outline" size="lg" className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10">🙏 Prayer Request</Button>
              </Link>
            </div>

            <a href={WHATSAPP_CHANNEL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl px-4 sm:px-5 py-3 hover:bg-[#25D366]/15 transition-all group mb-8 sm:mb-10 w-full sm:w-auto">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366] flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <div className="flex-1">
                <div className="text-[#25D366] text-sm font-bold">Join Weekly Sessions</div>
                <div className="text-white/40 text-xs">WhatsApp Channel · Mon–Sun</div>
              </div>
              <span className="text-[#25D366] group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <div className="flex gap-5 sm:gap-10 flex-wrap">
              {[["12,400+", "Prayer Warriors"], ["1,200+", "Audio Messages"], ["85+", "Nations Reached"]].map(([v, l]) => (
                <div key={l}>
                  <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-gradient-gold">{v}</div>
                  <div className="text-white/40 text-[10px] sm:text-xs tracking-[1.5px] uppercase mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Live player card */}
          <div className="relative">
            <div className="absolute inset-[-24px] bg-gradient-radial from-amber-400/15 to-transparent rounded-3xl" />
            <div className="relative glass rounded-2xl overflow-hidden animate-pulse-gold border border-amber-400/20">

              {/* Tabs */}
              <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-white/10">
                {(["live", "recent"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all ${tab === t ? "bg-amber-400/15 border border-amber-400/35 text-amber-400" : "text-white/40 hover:text-white/60"}`}
                  >
                    {t === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red" />}
                    {t === "live" ? "Live Now" : "Recent"}
                  </button>
                ))}
                <div className="ml-auto bg-red-500 text-white text-[10px] font-black tracking-widest px-2 sm:px-3 py-1 rounded-md">LIVE</div>
              </div>

              {/* Video area */}
              <div className="relative bg-[#04090f]" style={{ paddingBottom: "56.25%" }}>
                {playerStarted ? (
                  <div className="absolute inset-0">
                    {/* Loading indicator */}
                    {playerLoading && (
                      <div className="absolute inset-0 bg-[#04090f] flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                          <p className="text-white/60 text-sm">Loading video...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Error state */}
                    {playerError && (
                      <div className="absolute inset-0 bg-[#04090f] flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="text-red-400 text-xl">⚠</span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium mb-1">Video unavailable</p>
                            <p className="text-white/40 text-xs">Please try again later</p>
                          </div>
                          <button 
                            onClick={() => {
                              setPlayerError(false);
                              setPlayerLoading(true);
                            }}
                            className="px-4 py-2 bg-amber-400/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-400/30 transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Embedded YouTube player — always inline, never new window */}
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
                      onError={() => {
                        setPlayerError(true);
                        setPlayerLoading(false);
                      }}
                    />
                  </div>
                ) : (
                  /* Thumbnail / click-to-play */
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#04090f] to-[#0e1d38] px-4">
                    {/* Big play button */}
                    <button
                      onClick={handlePlay}
                      className="group relative mb-5 focus:outline-none"
                      aria-label="Watch live on YouTube"
                    >
                      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-2xl shadow-red-600/40 transition-all group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="w-7 sm:w-9 h-7 sm:h-9 fill-white ml-1">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="absolute -inset-2 rounded-full border-2 border-red-500/30 animate-ping" />
                    </button>

                    <div className="font-serif text-white text-base sm:text-xl font-semibold mb-1 text-center">
                      {tab === "live" ? "Morning Prayer Service" : activeVideo?.title ?? "Latest Broadcast"}
                    </div>
                    <div className="text-amber-400 text-xs sm:text-sm font-medium mb-4 text-center">
                      {tab === "live" ? "Click to watch live on YouTube" : "Click to watch on YouTube"}
                    </div>

                    {/* Countdown only on Live tab */}
                    {tab === "live" && (
                      <>
                        <div className="flex gap-2 sm:gap-3 mb-3">
                          {[[countdown.h, "HRS"], [countdown.m, "MIN"], [countdown.s, "SEC"]].map(([v, l]) => (
                            <div key={l as string} className="text-center bg-amber-400/8 border border-amber-400/20 rounded-xl px-3 sm:px-4 py-2 min-w-[46px] sm:min-w-[54px]">
                              <div className="text-amber-400 text-xl sm:text-2xl font-bold font-mono tracking-wider">{v}</div>
                              <div className="text-white/30 text-[9px] tracking-[2px]">{l}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-white/35 text-xs text-center">Next session · 5:00 AM GMT · Daily</div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Stream info bar */}
              <div className="p-3 sm:p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-white text-xs sm:text-sm font-semibold mb-0.5 truncate">
                    {activeVideo?.title ?? "Morning Breakthrough Prayer"}
                  </div>
                  <div className="text-white/40 text-xs">Rev Emmanuel Oduro Cosby</div>
                </div>
                <a
                  href={YOUTUBE_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              </div>

              {/* Wave bars */}
              {tab === "live" && (
                <div className="px-4 pb-4 flex items-end gap-1 justify-center">
                  {[20, 35, 28, 42, 33, 38, 26, 30, 22, 40, 18, 36].map((h, i) => (
                    <div key={i} className="wave-bar" style={{ height: h, animationDelay: `${i * 0.08}s` }} />
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
