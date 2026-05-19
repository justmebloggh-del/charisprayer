"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard, Music, Video, Radio, Hand, MessageSquare, BookOpen,
  Bell, Settings, LogOut, Menu, X, Shield, Search, ChevronRight,
  TrendingUp, Clock
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ToastProvider, useToast } from "@/components/admin/Toast";

// Section imports
import { Analytics } from "./sections/Analytics";
import { AudioManager } from "./sections/AudioManager";
import { VideoManager } from "./sections/VideoManager";
import { LivestreamManager } from "./sections/LivestreamManager";
import { BlogManager } from "./sections/BlogManager";
import { PrayerRequests } from "./sections/PrayerRequests";
import { Testimonies } from "./sections/Testimonies";
import { Notifications } from "./sections/Notifications";
import { Settings as SettingsSection } from "./sections/Settings";

type Section =
  | "analytics"
  | "audio"
  | "video"
  | "livestream"
  | "blog"
  | "prayers"
  | "testimonies"
  | "notifications"
  | "settings";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  group?: string;
}

const NAV: NavItem[] = [
  { id: "analytics", label: "Analytics", icon: <LayoutDashboard className="w-4 h-4" />, group: "Overview" },
  { id: "audio", label: "Audio Library", icon: <Music className="w-4 h-4" />, group: "Media" },
  { id: "video", label: "Video Library", icon: <Video className="w-4 h-4" />, group: "Media" },
  { id: "livestream", label: "Live Broadcasts", icon: <Radio className="w-4 h-4" />, group: "Media" },
  { id: "blog", label: "Blog & Posts", icon: <BookOpen className="w-4 h-4" />, group: "Content" },
  { id: "prayers", label: "Prayer Requests", icon: <Hand className="w-4 h-4" />, badge: "new", group: "Community" },
  { id: "testimonies", label: "Testimonies", icon: <MessageSquare className="w-4 h-4" />, group: "Community" },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" />, group: "System" },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" />, group: "System" },
];

const SECTION_GROUPS = ["Overview", "Media", "Content", "Community", "System"];

function DashboardContent({ user }: { user: { email: string; role: string } }) {
  const [section, setSection] = useState<Section>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingPrayers, setPendingPrayers] = useState(0);
  const [pendingTestimonies, setPendingTestimonies] = useState(0);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchBadgeCounts();
  }, []);

  async function fetchBadgeCounts() {
    try {
      const [prayerRes, testimonyRes] = await Promise.all([
        supabase.from("prayer_requests").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("testimonies").select("id", { count: "exact" }).eq("status", "pending"),
      ]);
      if (prayerRes.count) setPendingPrayers(prayerRes.count);
      if (testimonyRes.count) setPendingTestimonies(testimonyRes.count);
    } catch {}
  }

  const navWithBadges = NAV.map(item => ({
    ...item,
    badge: item.id === "prayers" ? (pendingPrayers > 0 ? pendingPrayers : undefined) : item.id === "testimonies" ? (pendingTestimonies > 0 ? pendingTestimonies : undefined) : undefined,
  }));

  const renderSection = () => {
    switch (section) {
      case "analytics": return <Analytics />;
      case "audio": return <AudioManager />;
      case "video": return <VideoManager />;
      case "livestream": return <LivestreamManager />;
      case "blog": return <BlogManager />;
      case "prayers": return <PrayerRequests />;
      case "testimonies": return <Testimonies />;
      case "notifications": return <Notifications />;
      case "settings": return <SettingsSection />;
      default: return <Analytics />;
    }
  };

  const currentNav = NAV.find(n => n.id === section);

  return (
    <div className="min-h-screen bg-[#060C14] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#080E18] border-r border-white/6 flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
            <span className="text-[#0A1628] font-black text-sm">CP</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Charis Prayer</div>
            <div className="text-amber-400/60 text-[10px] font-semibold uppercase tracking-wider">Ministry Admin</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-1 rounded-lg text-white/30 hover:text-white/70 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {SECTION_GROUPS.map(group => {
            const items = navWithBadges.filter(n => n.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mb-4">
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">{group}</p>
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      section === item.id
                        ? "bg-amber-400/12 text-amber-400 border border-amber-400/20"
                        : "text-white/45 hover:text-white/80 hover:bg-white/4 border border-transparent"
                    }`}
                  >
                    <span className={section === item.id ? "text-amber-400" : "text-white/30 group-hover:text-white/60 transition-colors"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {typeof item.badge === "number" && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold min-w-[18px] text-center">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/6 p-4">
          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/3 border border-white/6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold text-sm">{user.email[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-xs font-medium truncate">{user.email}</p>
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-amber-400" />
                <p className="text-amber-400/70 text-[10px] capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/35 hover:text-red-400 hover:bg-red-400/8 border border-transparent hover:border-red-400/15 text-sm font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#060C14]/90 backdrop-blur-xl border-b border-white/6 px-4 lg:px-6 py-3.5 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/6 transition-all lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-white/25 text-sm">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/15 flex-shrink-0" />
            <span className="text-white/70 text-sm font-medium truncate">{currentNav?.label}</span>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Pending alerts */}
            {(pendingPrayers > 0 || pendingTestimonies > 0) && (
              <div className="hidden sm:flex items-center gap-2">
                {pendingPrayers > 0 && (
                  <button
                    onClick={() => setSection("prayers")}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-medium hover:bg-amber-400/20 transition-all"
                  >
                    <Clock className="w-3 h-3" />
                    {pendingPrayers} prayers
                  </button>
                )}
                {pendingTestimonies > 0 && (
                  <button
                    onClick={() => setSection("testimonies")}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-400/10 text-blue-400 border border-blue-400/20 text-xs font-medium hover:bg-blue-400/20 transition-all"
                  >
                    <Clock className="w-3 h-3" />
                    {pendingTestimonies} testimonies
                  </button>
                )}
              </div>
            )}

            {/* Notification bell */}
            <button
              onClick={() => setSection("notifications")}
              className="relative p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/6 transition-all border border-transparent hover:border-white/10"
            >
              <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              {(pendingPrayers + pendingTestimonies) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#060C14]" />
              )}
            </button>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

interface AdminDashboardProps {
  user: { email: string; role: string };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <ToastProvider>
      <DashboardContent user={user} />
    </ToastProvider>
  );
}
