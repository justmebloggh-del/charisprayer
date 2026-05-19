"use client";

import { useState, useEffect, useRef } from "react";
import { Hand, Search, CheckCircle2, Clock, AlertCircle, Archive, Trash2, Reply, X, Filter, Wifi, WifiOff, Eye, Lock, Unlock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/admin/Toast";

interface PrayerRequest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  request: string;
  category: string;
  is_private: boolean;
  status: "pending" | "praying" | "answered" | "archived";
  admin_note?: string;
  created_at: string;
  priority?: "normal" | "urgent";
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: <Clock className="w-3.5 h-3.5" /> },
  praying: { label: "Praying", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: <Hand className="w-3.5 h-3.5" /> },
  answered: { label: "Answered", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  archived: { label: "Archived", color: "text-white/30", bg: "bg-white/4", border: "border-white/10", icon: <Archive className="w-3.5 h-3.5" /> },
};

const SAMPLE_REQUESTS: PrayerRequest[] = [
  { id: "1", name: "Emmanuel Boateng", email: "emmanuel@example.com", request: "I need urgent prayer for my health. The doctors have given me a difficult diagnosis and I am trusting God for a miraculous healing.", category: "Health", is_private: false, status: "pending", created_at: new Date(Date.now() - 120000).toISOString(), priority: "urgent" },
  { id: "2", name: "Sarah Mensah", email: "sarah@example.com", request: "Please pray for my marriage. My husband and I have been going through a very difficult time for the past few months.", category: "Family", is_private: true, status: "praying", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", name: "Anonymous", request: "I need breakthrough in my finances. I have been struggling to pay my rent and provide for my children.", category: "Finance", is_private: true, status: "pending", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "4", name: "Kwame Asante", email: "kwame@example.com", request: "Praying for my son who has been struggling with addiction. I believe God can set him free.", category: "Family", is_private: false, status: "answered", admin_note: "Prayed together on the phone. Son reported to be doing much better.", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "5", name: "Abena Osei", request: "I need prayer for my visa application. I have been waiting for over a year.", category: "Other", is_private: false, status: "praying", created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "6", name: "Michael Darko", email: "michael@example.com", request: "Please stand with me in prayer for a job. I have been unemployed for 8 months.", category: "Finance", is_private: false, status: "pending", created_at: new Date(Date.now() - 259200000).toISOString() },
];

const CATEGORIES = ["All", "Health", "Family", "Finance", "Career", "Spiritual", "Other"];
const STATUSES = ["all", "pending", "praying", "answered", "archived"] as const;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function PrayerCard({
  req,
  onStatusChange,
  onDelete,
  onOpenNote,
}: {
  req: PrayerRequest;
  onStatusChange: (id: string, status: PrayerRequest["status"]) => void;
  onDelete: (id: string) => void;
  onOpenNote: (req: PrayerRequest) => void;
}) {
  const cfg = STATUS_CONFIG[req.status];
  return (
    <div className={`bg-white/[0.02] border rounded-2xl p-5 hover:border-white/15 transition-all ${req.priority === "urgent" ? "border-red-400/30 bg-red-900/5" : "border-white/8"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-white/60 text-sm font-bold">{req.name[0]}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm font-medium">{req.name}</span>
              {req.is_private && <Lock className="w-3 h-3 text-white/25" />}
              {req.priority === "urgent" && (
                <span className="text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded-full">URGENT</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/25 text-xs">{timeAgo(req.created_at)}</span>
              {req.category && (
                <span className="text-white/25 text-xs px-1.5 py-0.5 bg-white/4 rounded-md border border-white/6">{req.category}</span>
              )}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          {cfg.icon}
          {cfg.label}
        </div>
      </div>

      {/* Request text */}
      <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">{req.request}</p>

      {/* Admin note (if any) */}
      {req.admin_note && (
        <div className="mb-4 p-3 bg-blue-900/15 border border-blue-700/20 rounded-xl">
          <p className="text-blue-300/70 text-xs leading-relaxed"><span className="font-semibold text-blue-400">Note: </span>{req.admin_note}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {req.status !== "praying" && (
          <button
            onClick={() => onStatusChange(req.id, "praying")}
            className="px-3 py-1.5 rounded-lg bg-blue-400/10 text-blue-400 border border-blue-400/20 text-xs font-medium hover:bg-blue-400/20 transition-all"
          >
            🙏 Start Praying
          </button>
        )}
        {req.status !== "answered" && (
          <button
            onClick={() => onStatusChange(req.id, "answered")}
            className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-xs font-medium hover:bg-emerald-400/20 transition-all"
          >
            ✅ Mark Answered
          </button>
        )}
        {req.status !== "archived" && (
          <button
            onClick={() => onStatusChange(req.id, "archived")}
            className="px-3 py-1.5 rounded-lg bg-white/4 text-white/30 border border-white/8 text-xs font-medium hover:text-white/60 hover:bg-white/8 transition-all"
          >
            Archive
          </button>
        )}
        <button
          onClick={() => onOpenNote(req)}
          className="px-3 py-1.5 rounded-lg bg-white/4 text-white/40 border border-white/8 text-xs font-medium hover:text-white/70 hover:bg-white/8 transition-all ml-auto"
        >
          <Reply className="w-3.5 h-3.5 inline mr-1" />
          Note
        </button>
        <button
          onClick={() => onDelete(req.id)}
          className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function PrayerRequests() {
  const [requests, setRequests] = useState<PrayerRequest[]>(SAMPLE_REQUESTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<typeof STATUSES[number]>("all");
  const [noteModal, setNoteModal] = useState<PrayerRequest | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const { toast } = useToast();
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    fetchRequests();
    setupRealtime();
    return () => {
      channelRef.current?.unsubscribe();
    };
  }, []);

  async function fetchRequests() {
    try {
      const { data } = await supabase
        .from("prayer_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setRequests(data);
    } catch {
      // use sample data
    }
  }

  function setupRealtime() {
    const channel = supabase.channel("prayer_requests_admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "prayer_requests" },
        (payload: { new: Record<string, unknown> }) => {
          const newReq = payload.new as unknown as PrayerRequest;
          setRequests(prev => [newReq, ...prev]);
          setNewCount(c => c + 1);
          toast(`New prayer request from ${newReq.name || "Anonymous"}`, "info");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "prayer_requests" },
        (payload: { new: Record<string, unknown> }) => {
          const updated = payload.new as unknown as PrayerRequest;
          setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });
    channelRef.current = channel;
  }

  const handleStatusChange = async (id: string, status: PrayerRequest["status"]) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await supabase.from("prayer_requests").update({ status }).eq("id", id);
    } catch {}
    toast(`Request marked as ${status}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prayer request?")) return;
    setRequests(prev => prev.filter(r => r.id !== id));
    try {
      await supabase.from("prayer_requests").delete().eq("id", id);
    } catch {}
    toast("Request deleted", "error");
  };

  const handleSaveNote = async () => {
    if (!noteModal) return;
    setRequests(prev => prev.map(r => r.id === noteModal.id ? { ...r, admin_note: noteText } : r));
    try {
      await supabase.from("prayer_requests").update({ admin_note: noteText }).eq("id", noteModal.id);
    } catch {}
    toast("Note saved");
    setNoteModal(null);
    setNoteText("");
  };

  const filtered = requests.filter(r => {
    const matchCat = category === "All" || r.category === category;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.request.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const prayingCount = requests.filter(r => r.status === "praying").length;
  const answeredCount = requests.filter(r => r.status === "answered").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif mb-1">Prayer Requests</h2>
          <p className="text-white/40 text-sm">Review, respond to, and pray over submitted requests</p>
        </div>
        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <button
              onClick={() => setNewCount(0)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-400/10 text-amber-400 border border-amber-400/25 rounded-xl text-xs font-semibold"
            >
              {newCount} new
            </button>
          )}
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium ${isConnected ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-white/30 bg-white/4 border-white/10"}`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isConnected ? "Realtime" : "Offline"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: requests.length, color: "text-purple-400", bg: "bg-purple-400/10", icon: <Hand className="w-4 h-4" /> },
          { label: "Pending", value: pendingCount, color: "text-amber-400", bg: "bg-amber-400/10", icon: <Clock className="w-4 h-4" /> },
          { label: "Praying", value: prayingCount, color: "text-blue-400", bg: "bg-blue-400/10", icon: <Hand className="w-4 h-4" /> },
          { label: "Answered", value: answeredCount, color: "text-emerald-400", bg: "bg-emerald-400/10", icon: <CheckCircle2 className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex items-center gap-3">
            <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>{s.icon}</div>
            <div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text"
            placeholder="Search by name or content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${statusFilter === s ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "text-white/40 border border-white/8 hover:border-white/20 hover:text-white/70"}`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${category === cat ? "bg-white/10 text-white border border-white/15" : "text-white/30 border border-white/6 hover:text-white/60 hover:border-white/15"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Requests grid */}
      {filtered.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-12 text-center">
          <Hand className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No prayer requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(req => (
            <PrayerCard
              key={req.id}
              req={req}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onOpenNote={r => { setNoteModal(r); setNoteText(r.admin_note || ""); }}
            />
          ))}
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h3 className="text-white font-semibold">Admin Note</h3>
              <button onClick={() => setNoteModal(null)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-white/3 border border-white/6 rounded-xl">
                <p className="text-white/50 text-xs font-medium mb-1">{noteModal.name}</p>
                <p className="text-white/40 text-sm line-clamp-2">{noteModal.request}</p>
              </div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a private note about this request..."
                rows={4}
                autoFocus
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setNoteModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white/80 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 text-sm font-semibold transition-all"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
