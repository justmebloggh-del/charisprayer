"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Search, Play, Pause, Download, Edit3, Trash2, Star, MoreVertical, Music, Filter, Eye } from "lucide-react";
import { UploadDropzone } from "@/components/admin/UploadDropzone";
import { useToast } from "@/components/admin/Toast";
import { createClient } from "@/utils/supabase/client";
import { PRAYER_CATEGORIES, DAYS_OF_WEEK, SAMPLE_AUDIOS } from "@/lib/constants";

interface Audio {
  id: string;
  title: string;
  category: string;
  scripture: string;
  duration: string;
  plays: number;
  downloads: number;
  featured: boolean;
  day_of_week: string;
  description: string;
  file_url?: string;
  cover_url?: string;
  published: boolean;
  created_at?: string;
}

const EMPTY: Audio = {
  id: "", title: "", category: "Breakthrough", scripture: "", duration: "",
  plays: 0, downloads: 0, featured: false, day_of_week: "Monday",
  description: "", published: true,
};

function AudioRow({ audio, onEdit, onDelete, onFeature, onPreview, isPlaying, onPlay }: {
  audio: Audio;
  onEdit: () => void;
  onDelete: () => void;
  onFeature: () => void;
  onPreview: () => void;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            onClick={onPlay}
            className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0 transition-all ${isPlaying ? "bg-amber-400 text-[#0A1628]" : "bg-white/6 text-white/40 hover:bg-amber-400/20 hover:text-amber-400"}`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </div>
          <div>
            <div className="text-white text-sm font-semibold leading-tight max-w-[220px] truncate">{audio.title}</div>
            {audio.scripture && <div className="text-amber-400/60 text-[11px] italic mt-0.5">{audio.scripture}</div>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[11px] font-bold px-2.5 py-1 rounded-full">{audio.category}</span>
      </td>
      <td className="px-4 py-3.5 text-white/50 text-sm font-mono">{audio.duration || "—"}</td>
      <td className="px-4 py-3.5">
        <div className="text-white/60 text-sm">{(audio.plays ?? 0).toLocaleString()}</div>
        <div className="text-white/25 text-[11px]">{(audio.downloads ?? 0)} dls</div>
      </td>
      <td className="px-4 py-3.5 text-white/40 text-sm">{audio.day_of_week}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${audio.published ? "bg-emerald-900/30 text-emerald-400 border-emerald-700/30" : "bg-slate-700/40 text-slate-400 border-slate-600/30"}`}>
            {audio.published ? "Live" : "Draft"}
          </span>
          {audio.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-amber-400/10 text-white/40 hover:text-amber-400 transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
          <button onClick={onFeature} className={`p-1.5 rounded-lg transition-colors ${audio.featured ? "text-amber-400 hover:bg-amber-400/10" : "text-white/25 hover:text-amber-400 hover:bg-amber-400/10"}`} title={audio.featured ? "Unfeature" : "Feature"}><Star className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/25 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </td>
    </tr>
  );
}

export function AudioManager() {
  const [audios, setAudios] = useState<Audio[]>(
    SAMPLE_AUDIOS.map((a, i) => ({
      id: a.id, title: a.title, category: a.category, scripture: a.scripture,
      duration: a.duration, plays: a.plays, downloads: Math.floor(a.plays * 0.3),
      featured: a.featured, day_of_week: a.day, description: "",
      published: true, file_url: undefined, cover_url: undefined,
    }))
  );
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState<"upload" | "edit" | null>(null);
  const [editing, setEditing] = useState<Audio | null>(null);
  const [form, setForm] = useState<Audio>(EMPTY);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("audios").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setAudios(data as Audio[]);
    });
  }, []);

  const filtered = audios.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || a.category === catFilter;
    return matchSearch && matchCat;
  });

  const openUpload = () => { setForm(EMPTY); setUploadedUrl(""); setCoverUrl(""); setModal("upload"); };
  const openEdit = (a: Audio) => { setEditing(a); setForm(a); setUploadedUrl(a.file_url ?? ""); setCoverUrl(a.cover_url ?? ""); setModal("edit"); };

  const save = async () => {
    const payload = { ...form, file_url: uploadedUrl || form.file_url, cover_url: coverUrl || form.cover_url };
    if (modal === "upload") {
      if (!payload.title) { toast("Title is required", "error"); return; }
      const newAudio: Audio = { ...payload, id: Date.now().toString(), plays: 0, downloads: 0 };
      setAudios(prev => [newAudio, ...prev]);
      toast("Audio added successfully");
    } else if (editing) {
      setAudios(prev => prev.map(a => a.id === editing.id ? { ...a, ...payload } : a));
      toast("Audio updated");
    }
    setModal(null);
    setEditing(null);
  };

  const del = (id: string) => {
    setAudios(prev => prev.filter(a => a.id !== id));
    toast("Audio deleted", "info");
  };

  const toggleFeature = (id: string) => {
    setAudios(prev => prev.map(a => a.id === id ? { ...a, featured: !a.featured } : a));
    toast("Featured status updated");
  };

  const playPreview = (audio: Audio) => {
    if (!audio.file_url) return;
    if (playingId === audio.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(audio.file_url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(audio.id);
    }
  };

  const totalPlays = audios.reduce((s, a) => s + (a.plays ?? 0), 0);
  const totalDls = audios.reduce((s, a) => s + (a.downloads ?? 0), 0);
  const featured = audios.filter(a => a.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif mb-1">Audio Library</h2>
          <p className="text-white/40 text-sm">{audios.length} prayers · {totalPlays.toLocaleString()} total plays · {featured} featured</p>
        </div>
        <button onClick={openUpload} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg shadow-amber-400/20">
          <Plus className="w-4 h-4" /> Upload Audio
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Plays", value: totalPlays.toLocaleString(), icon: <Play className="w-4 h-4" />, color: "text-amber-400" },
          { label: "Downloads", value: totalDls.toLocaleString(), icon: <Download className="w-4 h-4" />, color: "text-blue-400" },
          { label: "Featured", value: featured.toString(), icon: <Star className="w-4 h-4" />, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex items-center gap-3">
            <div className={`${s.color} bg-white/5 p-2 rounded-lg`}>{s.icon}</div>
            <div>
              <div className={`font-bold text-lg ${s.color}`}>{s.value}</div>
              <div className="text-white/35 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audios..." className="w-full bg-white/4 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...PRAYER_CATEGORIES.slice(1, 7)].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${catFilter === c ? "bg-amber-400/15 text-amber-400 border border-amber-400/30" : "bg-white/4 text-white/40 border border-white/8 hover:text-white/60"}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              {["Audio", "Category", "Duration", "Plays", "Day", "Status", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-16 text-center">
                <Music className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/25 text-sm">No audios found</p>
              </td></tr>
            ) : filtered.map(a => (
              <AudioRow
                key={a.id} audio={a}
                onEdit={() => openEdit(a)}
                onDelete={() => del(a.id)}
                onFeature={() => toggleFeature(a.id)}
                onPreview={() => {}}
                isPlaying={playingId === a.id}
                onPlay={() => playPreview(a)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">{modal === "upload" ? "Upload New Audio" : "Edit Audio"}</h3>
                <p className="text-white/35 text-xs mt-0.5">{modal === "upload" ? "Add a new prayer audio to the library" : "Update audio details"}</p>
              </div>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-xl bg-white/6 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {modal === "upload" && (
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">MP3 Audio File <span className="text-amber-400">*</span></label>
                  <UploadDropzone
                    bucket="audio_files" folder="prayers" accept=".mp3,audio/*"
                    acceptLabel="MP3, WAV, M4A" maxSizeMB={100}
                    onUploaded={([f]) => { setUploadedUrl(f.url); toast("Audio uploaded!", "success"); }}
                    compact
                  />
                  {uploadedUrl && <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1.5">✓ File ready: {uploadedUrl.split("/").pop()}</p>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Title <span className="text-amber-400">*</span></label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Morning Prayer of Breakthrough" className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0d1117] border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-400/60 transition-colors">
                    {PRAYER_CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Day of Week</label>
                  <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })} className="w-full bg-[#0d1117] border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-400/60 transition-colors">
                    {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Scripture Reference</label>
                  <input value={form.scripture} onChange={e => setForm({ ...form, scripture: e.target.value })} placeholder="Psalm 18:2" className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Duration</label>
                  <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="28:45" className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of this prayer..." className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Cover Art</label>
                <UploadDropzone
                  bucket="cover_arts" folder="audio" accept="image/*" acceptLabel="PNG, JPG, WebP" maxSizeMB={5}
                  onUploaded={([f]) => setCoverUrl(f.url)}
                  compact
                />
                {coverUrl && <img src={coverUrl} alt="Cover" className="mt-2 w-20 h-20 rounded-xl object-cover border border-white/10" />}
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button onClick={() => setForm({ ...form, featured: !form.featured })} className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-amber-400" : "bg-white/15"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
                  </button>
                  <span className="text-white/60 text-sm">Feature on homepage</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button onClick={() => setForm({ ...form, published: !form.published })} className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? "bg-emerald-500" : "bg-white/15"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? "translate-x-5" : ""}`} />
                  </button>
                  <span className="text-white/60 text-sm">Published (live)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/8">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:bg-white/4 transition-colors text-sm">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-amber-400/15">
                {modal === "upload" ? "Add to Library" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
