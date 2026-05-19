"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, CheckCircle2, XCircle, Clock, Search, Eye, Trash2, Star, X, Wifi, WifiOff, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/admin/Toast";

interface Testimony {
  id: string;
  name: string;
  email?: string;
  title: string;
  content: string;
  category: string;
  is_featured: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  admin_note?: string;
}

const SAMPLE_TESTIMONIES: Testimony[] = [
  { id: "1", name: "Grace Osei", email: "grace@example.com", title: "Miraculous Healing from Cancer", content: "After months of prayer and standing on God's word, my oncologist confirmed that there is no trace of cancer in my body. God has done what the doctors said was impossible. I am forever grateful to this prayer ministry.", category: "Health", is_featured: true, status: "approved", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "2", name: "Joseph Amoah", title: "Financial Breakthrough", content: "I had been unemployed for 18 months and was about to lose my home. After praying with this ministry, I received not one but three job offers in the same week. God is faithful!", category: "Finance", is_featured: false, status: "pending", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", name: "Patience Darko", title: "Marriage Restored", content: "My husband and I had filed for divorce. We prayed together with the prayer line and God touched his heart. Today we are more in love than ever.", category: "Marriage", is_featured: true, status: "approved", created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "4", name: "Anonymous", title: "Delivered from Addiction", content: "After 10 years of substance abuse, one prayer with this ministry changed my life. I have been clean for 8 months now.", category: "Deliverance", is_featured: false, status: "pending", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "5", name: "Rachel Asante", title: "Visa Approved After 2 Years", content: "I had been rejected multiple times. After persistent prayer, my visa was approved! I am now living in my dream country.", category: "Other", is_featured: false, status: "rejected", admin_note: "Could not verify contact details", created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
];

const CATEGORIES = ["All", "Health", "Finance", "Marriage", "Career", "Deliverance", "Education", "Other"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d}d ago`;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  approved: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
};

export function Testimonies() {
  const [testimonies, setTestimonies] = useState<Testimony[]>(SAMPLE_TESTIMONIES);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | Testimony["status"]>("all");
  const [selected, setSelected] = useState<Testimony | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const { toast } = useToast();
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    fetchTestimonies();
    setupRealtime();
    return () => { channelRef.current?.unsubscribe(); };
  }, []);

  async function fetchTestimonies() {
    try {
      const { data } = await supabase.from("testimonies").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) setTestimonies(data);
    } catch {}
  }

  function setupRealtime() {
    const channel = supabase.channel("testimonies_admin")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "testimonies" }, (payload: { new: Record<string, unknown> }) => {
        const t = payload.new as unknown as Testimony;
        setTestimonies(prev => [t, ...prev]);
        setNewCount(c => c + 1);
        toast(`New testimony from ${t.name}`, "info");
      })
      .subscribe(status => setIsConnected(status === "SUBSCRIBED"));
    channelRef.current = channel;
  }

  const handleStatusChange = async (id: string, status: Testimony["status"]) => {
    setTestimonies(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    try { await supabase.from("testimonies").update({ status }).eq("id", id); } catch {}
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    toast(`Testimony ${status}`);
  };

  const toggleFeature = async (id: string) => {
    setTestimonies(prev => prev.map(t => t.id === id ? { ...t, is_featured: !t.is_featured } : t));
    const t = testimonies.find(t => t.id === id);
    try { await supabase.from("testimonies").update({ is_featured: !t?.is_featured }).eq("id", id); } catch {}
    toast("Featured status updated");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimony?")) return;
    setTestimonies(prev => prev.filter(t => t.id !== id));
    if (selected?.id === id) setSelected(null);
    try { await supabase.from("testimonies").delete().eq("id", id); } catch {}
    toast("Testimony deleted", "error");
  };

  const filtered = testimonies.filter(t => {
    const matchCat = category === "All" || t.category === category;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const pendingCount = testimonies.filter(t => t.status === "pending").length;
  const approvedCount = testimonies.filter(t => t.status === "approved").length;
  const featuredCount = testimonies.filter(t => t.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif mb-1">Testimonies</h2>
          <p className="text-white/40 text-sm">Moderate and feature testimonies from the community</p>
        </div>
        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <button onClick={() => setNewCount(0)} className="flex items-center gap-1.5 px-3 py-2 bg-amber-400/10 text-amber-400 border border-amber-400/25 rounded-xl text-xs font-semibold">
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
          { label: "Total", value: testimonies.length, color: "text-purple-400", bg: "bg-purple-400/10", icon: <MessageSquare className="w-4 h-4" /> },
          { label: "Pending", value: pendingCount, color: "text-amber-400", bg: "bg-amber-400/10", icon: <Clock className="w-4 h-4" /> },
          { label: "Approved", value: approvedCount, color: "text-emerald-400", bg: "bg-emerald-400/10", icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: "Featured", value: featuredCount, color: "text-amber-400", bg: "bg-amber-400/10", icon: <Star className="w-4 h-4" /> },
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
            placeholder="Search testimonies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${statusFilter === s ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "text-white/40 border border-white/8 hover:border-white/20 hover:text-white/70"}`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main content — split: list + detail */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* List */}
        <div className="xl:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 text-center">
              <MessageSquare className="w-8 h-8 text-white/15 mx-auto mb-2" />
              <p className="text-white/30 text-sm">No testimonies found</p>
            </div>
          ) : (
            filtered.map(t => {
              const cfg = STATUS_CONFIG[t.status];
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${selected?.id === t.id ? "bg-amber-400/5 border-amber-400/25" : "bg-white/[0.02] border-white/8 hover:border-white/15 hover:bg-white/[0.03]"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-white/80 text-sm font-medium line-clamp-1">{t.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs">{t.name}</span>
                    <span className="text-white/15 text-xs">·</span>
                    <span className="text-white/25 text-xs">{timeAgo(t.created_at)}</span>
                    {t.is_featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-auto" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail pane */}
        <div className="xl:col-span-3">
          {selected ? (
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 h-full">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-white font-semibold text-lg font-serif mb-1">{selected.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm">{selected.name}</span>
                    {selected.email && <span className="text-white/25 text-xs">{selected.email}</span>}
                    <span className="text-white/25 text-xs">{timeAgo(selected.created_at)}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/8 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4 flex gap-2 flex-wrap">
                <span className="text-white/30 text-xs px-2.5 py-1 bg-white/4 rounded-full border border-white/8">{selected.category}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CONFIG[selected.status].color} ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].border}`}>
                  {STATUS_CONFIG[selected.status].label}
                </span>
                {selected.is_featured && <span className="text-amber-400 text-xs font-semibold px-2.5 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full">⭐ Featured</span>}
              </div>

              <p className="text-white/65 text-sm leading-relaxed mb-6">{selected.content}</p>

              {selected.admin_note && (
                <div className="mb-5 p-3 bg-blue-900/15 border border-blue-700/20 rounded-xl">
                  <p className="text-blue-400/70 text-xs"><span className="font-semibold text-blue-400">Admin note: </span>{selected.admin_note}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {selected.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "approved")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 border border-emerald-400/20 text-sm font-medium transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                )}
                {selected.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "rejected")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-400/10 hover:bg-red-400/20 text-red-400 border border-red-400/20 text-sm font-medium transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                )}
                <button
                  onClick={() => toggleFeature(selected.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selected.is_featured ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "bg-white/4 text-white/40 border border-white/10 hover:text-amber-400 hover:bg-amber-400/10"}`}
                >
                  <Star className="w-4 h-4" />
                  {selected.is_featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/4 text-white/30 border border-white/10 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20 text-sm font-medium transition-all ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full">
              <MessageSquare className="w-12 h-12 text-white/10 mb-3" />
              <p className="text-white/25 text-sm">Select a testimony to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
