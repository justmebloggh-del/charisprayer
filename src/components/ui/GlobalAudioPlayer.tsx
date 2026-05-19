"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause, X, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function GlobalAudioPlayer() {
  const { currentTrack, isPlaying, progress, duration, togglePlayPause, seek, closePlayer } = useAudio();
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  const getPos = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    seek(getPos(e) * duration);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    seek(getPos(e) * duration);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => seek(getPos(e) * duration);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, duration, getPos, seek]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Progress scrubber — above main bar */}
      <div
        ref={progressRef}
        className="h-1 bg-white/10 cursor-pointer group relative"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 relative transition-none"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
        </div>
      </div>

      {/* Main player bar */}
      <div className="bg-[#0A1628]/95 backdrop-blur-xl border-t border-white/8 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6">

          {/* Left: track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{currentTrack.cover ? undefined : "🎵"}</span>
              {currentTrack.cover && (
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover rounded-xl" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs sm:text-sm font-semibold truncate leading-tight">{currentTrack.title}</p>
              <p className="text-white/40 text-[11px] truncate mt-0.5">{currentTrack.author || "Charis Prayer"}</p>
            </div>
          </div>

          {/* Center: controls */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <button className="text-white/30 hover:text-white/70 transition-colors hidden sm:block p-1">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-[#0A1628] flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-lg shadow-amber-400/25 flex-shrink-0"
            >
              {isPlaying
                ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />}
            </button>
            <button className="text-white/30 hover:text-white/70 transition-colors hidden sm:block p-1">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right: time + volume + close */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
            <span className="text-white/35 text-xs font-mono hidden sm:block tabular-nums">
              {formatTime(progress)} / {formatTime(duration)}
            </span>

            {/* Volume */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setMuted(m => !m)}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="relative w-16 h-1 bg-white/15 rounded-full cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setVolume(v);
                  setMuted(false);
                }}>
                <div className="h-full bg-white/60 rounded-full" style={{ width: `${muted ? 0 : volume * 100}%` }} />
              </div>
            </div>

            {/* Wave bars (when playing) */}
            {isPlaying && (
              <div className="hidden sm:flex items-end gap-0.5 h-4">
                {[12, 18, 14, 20, 16].map((h, i) => (
                  <div key={i} className="wave-bar" style={{ height: h, animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            )}

            <button
              onClick={closePlayer}
              className="text-white/30 hover:text-white/70 hover:bg-white/8 p-1.5 rounded-lg transition-all"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
