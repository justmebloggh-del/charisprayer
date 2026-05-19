"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink } from "lucide-react";

interface VideoPlayerProps {
  src?: string | null;
  youtubeUrl?: string | null;
  thumbnail?: string | null;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function formatTime(s: number) {
  if (isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ src, youtubeUrl, thumbnail, title, className = "", autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [started, setStarted] = useState(autoPlay);
  const controlTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const youtubeId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  useEffect(() => {
    if (autoPlay) setStarted(true);
  }, [autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); setStarted(true); }
  };

  const onTimeUpdate = () => {
    if (videoRef.current) setProgress(videoRef.current.currentTime);
  };
  const onLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };
  const onEnded = () => setPlaying(false);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * duration;
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const m = !muted;
    setMuted(m);
    videoRef.current.muted = m;
  };

  const fullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  const showCtrl = () => {
    setShowControls(true);
    clearTimeout(controlTimer.current);
    controlTimer.current = setTimeout(() => playing && setShowControls(false), 3000);
  };

  // YouTube embed
  if (youtubeId) {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-black ${className}`}>
        {!started ? (
          <div
            className="relative aspect-video cursor-pointer group"
            onClick={() => setStarted(true)}
          >
            {thumbnail ? (
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center aspect-video">
                <div className="text-6xl">▶️</div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
            {title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-semibold truncate">{title}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&color=white&theme=dark`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 text-white/60 hover:text-white hover:bg-black/80 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  // HTML5 video
  if (src) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-black group ${className}`}
        onMouseMove={showCtrl}
        onMouseLeave={() => playing && setShowControls(false)}
      >
        {!started && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
            onClick={() => { setStarted(true); togglePlay(); }}
          >
            {thumbnail && <img src={thumbnail} alt={title} className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-2xl transition-all hover:scale-110">
              <Play className="w-6 h-6 text-[#0A1628] ml-1" />
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          src={src}
          className="w-full aspect-video"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onClick={togglePlay}
        />

        {/* Controls overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls || !playing ? "opacity-100" : "opacity-0"}`}>
          {/* Progress */}
          <div
            className="h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/bar hover:h-2 transition-all"
            onClick={seek}
          >
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full relative"
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full opacity-0 group-hover/bar:opacity-100 shadow transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-white hover:text-amber-400 transition-colors">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
                onChange={onVolumeChange}
                className="w-16 h-1 accent-amber-400 cursor-pointer"
              />
              <span className="text-white/50 text-xs font-mono">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
            <button onClick={fullscreen} className="text-white/60 hover:text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center ${className}`}>
      <div className="text-center text-white/25">
        <div className="text-4xl mb-2">🎬</div>
        <p className="text-sm">No video source</p>
      </div>
    </div>
  );
}
