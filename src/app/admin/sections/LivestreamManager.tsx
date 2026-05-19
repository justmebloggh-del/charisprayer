"use client";

import { useState, useEffect } from "react";
import { Radio, Tv, Plus, X, Edit3, Trash2, Eye, Clock, Calendar, AlertCircle, CheckCircle2, Signal, Copy, ExternalLink, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { VideoPlayer } from "@/components/admin/VideoPlayer";
import { useToast } from "@/components/admin/Toast";

interface Livestream {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  scheduled_at?: string | null;
  status: "upcoming" | "live" | "ended";
  viewers_peak?: number;
  thumbnail_url?: string | null;
  category: string;
  chat_enabled: boolean;
  created_at: string;
}

const SAMPLE_STREAMS: Livestream[] = [
  {
    id: "1",
    title: "Sunday Morning Worship Service",
    description: "Join us for our weekly Sunday worship service.",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    scheduled_at: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: "upcoming",
    category: "Worship",
    chat_enabled: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Midnight Prayer Watch — May 2025",
    description: "Monthly midnight prayer warfare session.",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "live",
    viewers_peak: 847,
    category: "Prayer",
    chat_enabled: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    title: "Annual Conference 2025 — Day 1",
    description: "Opening day of our annual ministry conference.",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    scheduled_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: "ended",
    viewers_peak: 2100,
    category: "Conferences",
    chat_enabled: false,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

const STATUS_CONFIG = {
  upcoming: { label: "Scheduled", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", dot: "bg-blue-400" },
  live: { label: "Live Now", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", dot: "bg-red-500 animate-pulse" },
  ended: { label: "Ended", color: "text-white/30", bg: "bg-white/4", border: "border-white/10", dot: "bg-white/20" },
};

function formatScheduled(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function LivestreamManager() {
  const [streams, setStreams] = useState<Livestream[]>(SAMPLE_STREAMS);
  const [showForm, setShowForm] = useState(false);
  const [previewStream, setPreviewStream] = useState<Livestream | null>(null);
  const [editStream, setEditStream] = useState<Livestream | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "ended">("all");
  const { toast } = useToast();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    youtube_url: "",
    scheduled_at: "",
    category: "Worship",
    chat_enabled: true,
    status: "upcoming" as Livestream["status"],
  });

  const resetForm = () => {
    setForm({ title: "", description: "", youtube_url: "", scheduled_at: "", category: "Worship", chat_enabled: true, status: "upcoming" });
    setEditStream(null);
  };

  const openEdit = (s: Livestream) => {
    setEditStream(s);
    setForm({
      title: s.title,
      description: s.description || "",
      youtube_url: s.youtube_url,
      scheduled_at: s.scheduled_at ? new Date(s.scheduled_at).toISOString().slice(0, 16) : "",
      category: s.category,
      chat_enabled: s.chat_enabled,
      status: s.status,
    });
    setShowForm(true);
  };

  const deleteStream = (id: string) => {
    if (!confirm("Delete this broadcast?")) return;
    setStreams(prev => prev.filter(s => s.id !== id));
    toast("Broadcast deleted", "error");
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast("Title is required", "error"); return; }
    if (!form.youtube_url.trim()) { toast("YouTube URL is required", "error"); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        youtube_url: form.youtube_url,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
        category: form.category,
        chat_enabled: form.chat_enabled,
        status: form.status,
      };

      if (editStream) {
        const { error } = await supabase.from("livestreams").update(payload).eq("id", editStream.id);
        if (!error) {
          setStreams(prev => prev.map(s => s.id === editStream.id ? { ...s, ...payload } : s));
        } else {
          setStreams(prev => prev.map(s => s.id === editStream.id ? { ...s, ...payload } : s));
        }
        toast("Broadcast updated");
      } else {
        const { data, error } = await supabase.from("livestreams").insert(payload).select().single();
        if (!error && data) {
          setStreams(prev => [data, ...prev]);
        } else {
          const newStream: Livestream = { id: Date.now().toString(), ...payload, viewers_peak: 0, created_at: new Date().toISOString() };
          setStreams(prev => [newStream, ...prev]);
        }
        toast("Broadcast scheduled");
      }
      setShowForm(false);
      resetForm();
    } catch {
      toast("Failed to save broadcast", "error");
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => toast("URL copied!"));
  };

  const liveStream = streams.find(s => s.status === "live");
  const upcomingCount = streams.filter(s => s.status === "upcoming").length;
  const endedCount = streams.filter(s => s.status === "ended").length;

  const filtered = filter === "all" ? streams : streams.filter(s => s.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif mb-1">Live Broadcasts</h2>
          <p className="text-white/40 text-sm">Manage your YouTube livestreams and scheduled broadcasts</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-600/25 rounded-xl font-semibold text-sm transition-all"
        >
          <Radio className="w-4 h-4" />
          Schedule Broadcast
        </button>
      </div>

      {/* Live Now Banner */}
      {liveStream && (
        <div className="relative overflow-hidden bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-600/30 rounded-2xl p-5">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-red-600/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center">
                  <Signal className="w-5 h-5 text-red-400" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-[#0d1117]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-red-400 text-xs font-bold uppercase tracking-wider">● Live Now</span>
                  {liveStream.viewers_peak && (
                    <span className="text-white/40 text-xs">{liveStream.viewers_peak.toLocaleString()} watching</span>
                  )}
                </div>
                <h3 className="text-white font-semibold">{liveStream.title}</h3>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewStream(liveStream)}
                className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 text-sm font-medium transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <a
                href={liveStream.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                <Tv className="w-4 h-4" />
                View on YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Live Now", value: liveStream ? "1" : "0", color: "text-red-400", bg: "bg-red-400/10", icon: <Signal className="w-4 h-4" /> },
          { label: "Upcoming", value: upcomingCount, color: "text-blue-400", bg: "bg-blue-400/10", icon: <Calendar className="w-4 h-4" /> },
          { label: "Past Broadcasts", value: endedCount, color: "text-white/40", bg: "bg-white/6", icon: <Clock className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex items-center gap-3">
            <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>{s.icon}</div>
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white/4 rounded-xl p-1 w-fit">
        {(["all", "live", "upcoming", "ended"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? "bg-white/10 text-white border border-white/10" : "text-white/30 hover:text-white/60"}`}
          >
            {f === "all" ? "All Broadcasts" : f === "live" ? "🔴 Live" : f === "upcoming" ? "Scheduled" : "Past"}
          </button>
        ))}
      </div>

      {/* Broadcast List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-12 text-center">
            <Radio className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No broadcasts found</p>
          </div>
        ) : (
          filtered.map(stream => {
            const cfg = STATUS_CONFIG[stream.status];
            return (
              <div key={stream.id} className="group bg-white/[0.02] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                      <div>
                        <h4 className="text-white/85 font-medium">{stream.title}</h4>
                        {stream.description && (
                          <p className="text-white/40 text-sm mt-0.5 line-clamp-1">{stream.description}</p>
                        )}
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        {stream.status === "live" && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-white/30 text-xs px-2 py-0.5 bg-white/4 rounded-full border border-white/6">{stream.category}</span>
                      {stream.scheduled_at && stream.status === "upcoming" && (
                        <span className="text-blue-400/70 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatScheduled(stream.scheduled_at)}
                        </span>
                      )}
                      {stream.viewers_peak && (
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {stream.viewers_peak.toLocaleString()} peak viewers
                        </span>
                      )}
                      {stream.chat_enabled && (
                        <span className="text-emerald-400/50 text-xs">Chat enabled</span>
                      )}
                    </div>

                    {/* URL row */}
                    <div className="flex items-center gap-2 mt-3 bg-white/3 border border-white/6 rounded-xl px-3 py-2">
                      <Tv className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-white/30 text-xs truncate flex-1">{stream.youtube_url}</span>
                      <button onClick={() => copyUrl(stream.youtube_url)} className="p-1 rounded-lg hover:bg-white/8 text-white/25 hover:text-white/60 transition-colors flex-shrink-0">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a href={stream.youtube_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded-lg hover:bg-white/8 text-white/25 hover:text-white/60 transition-colors flex-shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => setPreviewStream(stream)}
                      className="p-2 rounded-xl text-white/25 hover:text-white/70 hover:bg-white/8 border border-transparent transition-all"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(stream)}
                      className="p-2 rounded-xl text-white/25 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent transition-all"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteStream(stream.id)}
                      className="p-2 rounded-xl text-white/25 hover:text-red-400 hover:bg-red-400/10 border border-transparent transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Modal */}
      {previewStream && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewStream(null)}>
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-4 w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  {previewStream.status === "live" && <span className="flex items-center gap-1.5 text-red-400 text-xs font-bold"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />LIVE</span>}
                  <h3 className="text-white font-semibold">{previewStream.title}</h3>
                </div>
                <p className="text-white/40 text-xs">{previewStream.category}</p>
              </div>
              <button onClick={() => setPreviewStream(null)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <VideoPlayer youtubeUrl={previewStream.youtube_url} title={previewStream.title} className="w-full" />
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-xl mt-8 mb-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h3 className="text-white font-semibold">{editStream ? "Edit Broadcast" : "Schedule Broadcast"}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* YouTube URL */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">YouTube URL *</label>
                <div className="relative">
                  <Tv className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.youtube_url}
                    onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-red-400/40 transition-colors"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Broadcast title..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Description</label>
                <textarea
                  placeholder="What will be covered in this broadcast..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
                />
              </div>

              {/* Scheduled date */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>

              {/* Category + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full appearance-none bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors pr-10"
                    >
                      {["Worship", "Prayer", "Sermons", "Teachings", "Conferences", "Special Events"].map(c => (
                        <option key={c} value={c} className="bg-[#0d1117]">{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Status</label>
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value as Livestream["status"] }))}
                      className="w-full appearance-none bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors pr-10"
                    >
                      <option value="upcoming" className="bg-[#0d1117]">Scheduled</option>
                      <option value="live" className="bg-[#0d1117]">Live Now</option>
                      <option value="ended" className="bg-[#0d1117]">Ended</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Chat toggle */}
              <div className="flex items-center justify-between p-4 bg-white/3 border border-white/8 rounded-xl">
                <div>
                  <p className="text-white/70 text-sm font-medium">Enable Chat</p>
                  <p className="text-white/30 text-xs">Allow viewers to send chat messages during the stream</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, chat_enabled: !f.chat_enabled }))}
                  className={`relative w-11 h-6 rounded-full transition-all ${form.chat_enabled ? "bg-emerald-500" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.chat_enabled ? "left-6" : "left-1"}`} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-600/25 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editStream ? "Save Changes" : "Schedule Broadcast"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
