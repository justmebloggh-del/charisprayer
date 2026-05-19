"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Users, Music, Video, Hand, MessageSquare, Globe, Download, BarChart3, Activity } from "lucide-react";

const WEEKLY = [
  { day: "Mon", plays: 420, downloads: 85, viewers: 312, prayers: 12 },
  { day: "Tue", plays: 580, downloads: 110, viewers: 445, prayers: 18 },
  { day: "Wed", plays: 510, downloads: 95, viewers: 390, prayers: 15 },
  { day: "Thu", plays: 690, downloads: 130, viewers: 520, prayers: 22 },
  { day: "Fri", plays: 640, downloads: 120, viewers: 480, prayers: 19 },
  { day: "Sat", plays: 380, downloads: 70, viewers: 290, prayers: 9 },
  { day: "Sun", plays: 880, downloads: 175, viewers: 710, prayers: 31 },
];

const MAX_PLAYS = Math.max(...WEEKLY.map(d => d.plays));

const STATS = [
  { label: "Total Audio Plays", value: "9,970", sub: "This month", change: "+12%", up: true, icon: <Music className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Downloads", value: "2,840", sub: "This month", change: "+18%", up: true, icon: <Download className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Live Viewers", value: "1,247", sub: "Peak this week", change: "+5%", up: true, icon: <Video className="w-5 h-5" />, color: "text-red-400", bg: "bg-red-400/10" },
  { label: "Prayer Requests", value: "284", sub: "This month", change: "+23%", up: true, icon: <Hand className="w-5 h-5" />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Testimonies", value: "48", sub: "Pending: 3", change: "+15%", up: true, icon: <MessageSquare className="w-5 h-5" />, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Nations Reached", value: "85", sub: "Since launch", change: "+3", up: true, icon: <Globe className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Active Users", value: "12,400", sub: "Monthly active", change: "+8%", up: true, icon: <Users className="w-5 h-5" />, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { label: "Avg. Session", value: "18m 42s", sub: "Per user", change: "-2%", up: false, icon: <Activity className="w-5 h-5" />, color: "text-pink-400", bg: "bg-pink-400/10" },
];

const TOP_AUDIOS = [
  { title: "Sunday Morning Worship Prayer", plays: 3200, pct: 100 },
  { title: "Midnight Warfare Prayer Watch", plays: 2100, pct: 66 },
  { title: "Prayer for Financial Blessing", plays: 1560, pct: 49 },
  { title: "Morning Prayer of Breakthrough", plays: 1240, pct: 39 },
  { title: "Divine Healing Prayer", plays: 980, pct: 31 },
  { title: "Prayer of Deliverance", plays: 890, pct: 28 },
];

const RECENT_ACTIVITY = [
  { action: "New prayer request", sub: "Emmanuel Boateng · Urgent", time: "2m ago", icon: "🙏", color: "text-red-400" },
  { action: "Testimony submitted", sub: "Sarah M. · Miraculous Healing", time: "15m ago", icon: "✨", color: "text-amber-400" },
  { action: "Audio upload complete", sub: "Midnight Warfare Prayer · 45:00", time: "1h ago", icon: "🎵", color: "text-blue-400" },
  { action: "Live stream ended", sub: "1,247 peak viewers", time: "3h ago", icon: "📺", color: "text-emerald-400" },
  { action: "New prayer request", sub: "Anonymous · Private", time: "4h ago", icon: "🙏", color: "text-purple-400" },
  { action: "Blog post published", sub: "5 Powerful Prayers...", time: "6h ago", icon: "📖", color: "text-cyan-400" },
];

type Metric = "plays" | "downloads" | "viewers" | "prayers";

export function Analytics() {
  const [metric, setMetric] = useState<Metric>("plays");

  const maxVal = Math.max(...WEEKLY.map(d => d[metric]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-serif mb-1">Ministry Analytics</h2>
        <p className="text-white/40 text-sm">Real-time overview of your digital ministry performance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 hover:border-white/15 hover:bg-white/[0.04] transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`${s.bg} ${s.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>{s.icon}</div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700/30" : "bg-red-900/30 text-red-400 border border-red-700/30"}`}>
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.change}
              </div>
            </div>
            <div className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-white/60 text-xs font-medium">{s.label}</div>
            <div className="text-white/25 text-[11px] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Top content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Bar chart */}
        <div className="xl:col-span-3 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span className="text-white font-semibold text-sm">Weekly Activity</span>
            </div>
            <div className="flex gap-1 bg-white/4 rounded-xl p-1">
              {(["plays", "downloads", "viewers", "prayers"] as Metric[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${metric === m ? "bg-amber-400/20 text-amber-400 border border-amber-400/30" : "text-white/30 hover:text-white/60"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {WEEKLY.map((d, i) => {
              const h = Math.max(4, (d[metric] / maxVal) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group/bar">
                  <div className="relative w-full flex items-end justify-center" style={{ height: 128 }}>
                    <div
                      className="w-full bg-gradient-to-t from-amber-500/80 to-amber-400/20 rounded-t-lg transition-all duration-700 group-hover/bar:from-amber-400 cursor-pointer relative"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0d1117] border border-white/10 rounded-lg px-2 py-1 text-amber-400 text-[10px] font-bold whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none">
                        {d[metric].toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-white/30 text-[10px] font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top content */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-white font-semibold text-sm">Top Audio Content</span>
          </div>
          <div className="space-y-4">
            {TOP_AUDIOS.map((a, i) => (
              <div key={i} className="group/item">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white/20 text-[11px] font-bold w-4 flex-shrink-0">#{i + 1}</span>
                    <span className="text-white/70 text-xs truncate">{a.title}</span>
                  </div>
                  <span className="text-amber-400 text-[11px] font-bold ml-2 flex-shrink-0">{a.plays.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: `${a.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity + quick stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-white font-semibold text-sm">Recent Activity</span>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                <div className="text-xl w-8 text-center flex-shrink-0">{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${a.color}`}>{a.action}</div>
                  <div className="text-white/30 text-xs truncate">{a.sub}</div>
                </div>
                <div className="text-white/20 text-[11px] flex-shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick KPIs */}
        <div className="space-y-3">
          {[
            { label: "Avg. Prayer Duration", value: "18m 42s", icon: "⏱", pct: 78 },
            { label: "Request Completion Rate", value: "94%", icon: "✅", pct: 94 },
            { label: "Testimony Approval Rate", value: "87%", icon: "🌟", pct: 87 },
            { label: "Content Engagement", value: "73%", icon: "🔥", pct: 73 },
          ].map(k => (
            <div key={k.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-xs">{k.label}</span>
                <span className="text-xl">{k.icon}</span>
              </div>
              <div className="text-white font-bold text-xl mb-2">{k.value}</div>
              <div className="h-1.5 bg-white/6 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${k.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
