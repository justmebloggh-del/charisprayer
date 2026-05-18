"use client";

import { AudioProvider } from "@/context/AudioContext";
import { GlobalAudioPlayer } from "@/components/ui/GlobalAudioPlayer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      {children}
      <GlobalAudioPlayer />
    </AudioProvider>
  );
}
