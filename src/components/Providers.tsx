"use client";

import { AudioProvider } from "@/context/AudioContext";
import { GlobalAudioPlayer } from "@/components/ui/GlobalAudioPlayer";
import { SocialSidebar } from "@/components/ui/SocialSidebar";
import { usePathname } from "next/navigation";

function LayoutProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/login");

  return (
    <AudioProvider>
      {children}
      <GlobalAudioPlayer />
      {!isAdmin && <SocialSidebar />}
    </AudioProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <LayoutProviders>{children}</LayoutProviders>;
}
