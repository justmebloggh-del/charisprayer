"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  cover?: string;
  category?: string;
  author?: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  closePlayer: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      // Small delay avoids AbortError when src changes and play() races with pause()
      const t = setTimeout(() => {
        audio.play().catch(() => {/* interrupted by src change — safe to ignore */});
      }, 50);
      return () => clearTimeout(t);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const playTrack = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const closePlayer = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, progress, duration, playTrack, togglePlayPause, seek, closePlayer, audioRef }}>
      {children}
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.url || undefined}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
