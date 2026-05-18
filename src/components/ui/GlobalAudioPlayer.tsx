"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause, X, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function GlobalAudioPlayer() {
  const { currentTrack, isPlaying, progress, duration, togglePlayPause, seek, closePlayer, audioRef } = useAudio();
  const [isHovering, setIsHovering] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) return null;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    seek(pos * duration);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      {/* Progress Bar Area */}
      <div 
        ref={progressBarRef}
        className="h-1.5 bg-gray-200 cursor-pointer relative group"
        onClick={handleProgressClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          className="h-full bg-amber-500 relative transition-all duration-100 ease-linear"
          style={{ width: `${(progress / (duration || 1)) * 100}%` }}
        >
          {isHovering && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-600 rounded-full shadow-md" />
          )}
        </div>
      </div>

      {/* Main Player Bar */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 px-4 py-3 sm:px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {currentTrack.cover ? (
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🎵</span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-[#0A1628] text-sm truncate">{currentTrack.title}</h4>
              <p className="text-gray-500 text-xs truncate">{currentTrack.author || "Charis Prayer"}</p>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-700 transition-colors hidden sm:block">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-[#0A1628] text-amber-400 flex items-center justify-center hover:bg-[#1a2e50] transition-colors shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <button className="text-gray-400 hover:text-gray-700 transition-colors hidden sm:block">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Time & Close */}
          <div className="flex items-center justify-end gap-6 flex-1 text-xs text-gray-500 font-medium">
            <div className="hidden sm:flex items-center gap-2">
              <span>{formatTime(progress)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-400">
              <Volume2 className="w-4 h-4" />
              <input type="range" className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <button 
              onClick={closePlayer}
              className="text-gray-400 hover:text-red-500 p-2 -mr-2 transition-colors"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
