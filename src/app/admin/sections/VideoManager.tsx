"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Upload, Search, Filter, Star, Trash2, Eye, EyeOff, Play, Tv, Plus, X, Edit3, Clock, Tag, Layers, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { UploadDropzone, UploadedFile } from "@/components/admin/UploadDropzone";
import { VideoPlayer } from "@/components/admin/VideoPlayer";
import { useToast } from "@/components/admin/Toast";

interface Video {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url?: string | null;
  youtube_url?: string | null;
  thumbnail_url?: string | null;
  duration?: string;
  views: number;
  is_featured: boolean;
  published: boolean;
  created_at: string;
  tags?: string[];
}

const CATEGORIES = ["All", "Sermons", "Teachings", "Worship", "Testimonies", "Live", "Conferences", "Prayer"];

const SAMPLE_VIDEOS: Video[] = [
  { id: "1", title: "Sunday Morning Worship Service", description: "A powerful worship service from our Sunday morning gathering.", category: "Worship", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnail_url: "", duration: "1:24:30", views: 4200, is_featured: true, published: true, created_at: new Date(Date.now() - 86400000).toISOString(), tags: ["worship", "sunday"] },
  { id: "2", title: "The Power of Prayer - Part 1", description: "Deep teaching on the foundations of effective prayer.", category: "Teachings", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "45:12", views: 3100, is_featured: false, published: true, created_at: new Date(Date.now() - 172800000).toISOString(), tags: ["prayer", "teaching"] },
  { id: "3", title: "Midnight Warfare - Live Broadcast", description: "Our monthly midnight prayer warfare session.", category: "Live", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "2:10:05", views: 5800, is_featured: true, published: true, created_at: new Date(Date.now() - 259200000).toISOString(), tags: ["prayer", "warfare", "live"] },
  { id: "4", title: "Faith That Moves Mountains", description: "Sermon on building unshakeable faith.", category: "Sermons", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "58:44", views: 2200, is_featured: false, published: false, created_at: new Date(Date.now() - 432000000).toISOString(), tags: ["faith", "sermon"] },
  { id: "5", title: "Annual Conference 2024 Highlights", description: "Best moments from our annual conference.", category: "Conferences", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "15:30", views: 7600, is_featured: true, published: true, created_at: new Date(Date.now() - 604800000).toISOString(), tags: ["conference", "2024"] },
];

function formatViews(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

interface VideoRowProps {
  video: Video;
  onSelect: (v: Video) => void;
  onToggleFeature: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (v: Video) => void;
}

function VideoRow({ video, onSelect, onToggleFeature, onTogglePublish, onDelete, onEdit }: VideoRowProps) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/8">
      {/* Thumbnail */}
      <div
        className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer bg-white/5 border border-white/8 group/thumb"
        onClick={() => onSelect(video)}
      >
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center">
            {video.youtube_url ? (
              <Tv className="w-8 h-8 text-red-400/60" />
            ) : (
              <Video className="w-8 h-8 text-white/20" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 text-[#0A1628] ml-0.5" />
          </div>
        </div>
        {video.duration && (
          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md">
            {video.duration}
          </div>
        )}
        {video.youtube_url && (
          <div className="absolute top-1.5 left-1.5">
            <Tv className="w-3.5 h-3.5 text-red-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h4 className="text-white/85 text-sm font-medium truncate leading-tight">{video.title}</h4>
          {video.is_featured && (
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5" />
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white/30 text-[11px] px-2 py-0.5 bg-white/4 rounded-full border border-white/6">{video.category}</span>
          <span className="text-white/30 text-[11px]">{formatViews(video.views)} views</span>
          <span className="text-white/25 text-[11px]">{timeAgo(video.created_at)}</span>
          {video.tags && video.tags.length > 0 && (
            <div className="flex gap-1">
              {video.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-amber-400/50 text-[10px] px-1.5 py-0.5 bg-amber-400/5 rounded-md border border-amber-400/10">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onToggleFeature(video.id)}
          className={`p-2 rounded-xl transition-all ${video.is_featured ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "text-white/25 hover:text-amber-400 hover:bg-amber-400/10 border border-transparent"}`}
          title={video.is_featured ? "Unfeature" : "Feature"}
        >
          <Star className="w-4 h-4" />
        </button>
        <button
          onClick={() => onTogglePublish(video.id)}
          className={`p-2 rounded-xl transition-all ${video.published ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/25" : "text-white/25 hover:text-emerald-400 hover:bg-emerald-400/10 border border-transparent"}`}
          title={video.published ? "Unpublish" : "Publish"}
        >
          {video.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onEdit(video)}
          className="p-2 rounded-xl text-white/25 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent transition-all"
          title="Edit"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(video.id)}
          className="p-2 rounded-xl text-white/25 hover:text-red-400 hover:bg-red-400/10 border border-transparent transition-all"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Publish badge (always visible) */}
      <div className="flex-shrink-0">
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${video.published ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-white/25 bg-white/4 border-white/8"}`}>
          {video.published ? "Live" : "Draft"}
        </span>
      </div>
    </div>
  );
}

export function VideoManager() {
  const [videos, setVideos] = useState<Video[]>(SAMPLE_VIDEOS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  // Upload form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Sermons",
    youtube_url: "",
    duration: "",
    tags: "",
  });
  const [uploadedVideo, setUploadedVideo] = useState<UploadedFile | null>(null);
  const [uploadedThumb, setUploadedThumb] = useState<UploadedFile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "youtube">("youtube");

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setVideos(data);
    } catch {
      // fall back to sample data
    } finally {
      setLoading(false);
    }
  }

  const filtered = videos.filter(v => {
    const matchCat = category === "All" || v.category === category;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleFeature = (id: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, is_featured: !v.is_featured } : v));
    toast("Feature status updated");
  };

  const togglePublish = (id: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, published: !v.published } : v));
    const v = videos.find(v => v.id === id);
    toast(v?.published ? "Video unpublished" : "Video published");
  };

  const deleteVideo = (id: string) => {
    if (!confirm("Delete this video?")) return;
    setVideos(prev => prev.filter(v => v.id !== id));
    toast("Video deleted", "error");
  };

  const openEdit = (v: Video) => {
    setEditVideo(v);
    setForm({
      title: v.title,
      description: v.description || "",
      category: v.category,
      youtube_url: v.youtube_url || "",
      duration: v.duration || "",
      tags: v.tags?.join(", ") || "",
    });
    setUploadType(v.youtube_url ? "youtube" : "file");
    setShowUpload(true);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", category: "Sermons", youtube_url: "", duration: "", tags: "" });
    setUploadedVideo(null);
    setUploadedThumb(null);
    setEditVideo(null);
    setUploadType("youtube");
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast("Title is required", "error"); return; }
    if (uploadType === "youtube" && !form.youtube_url.trim()) { toast("YouTube URL is required", "error"); return; }
    if (uploadType === "file" && !editVideo && !uploadedVideo) { toast("Please upload a video file", "error"); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        youtube_url: uploadType === "youtube" ? form.youtube_url : null,
        file_url: uploadedVideo?.url || editVideo?.file_url || null,
        thumbnail_url: uploadedThumb?.url || editVideo?.thumbnail_url || null,
        duration: form.duration,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        is_featured: false,
        published: true,
        views: 0,
      };

      if (editVideo) {
        const { error } = await supabase.from("videos").update(payload).eq("id", editVideo.id);
        if (!error) {
          setVideos(prev => prev.map(v => v.id === editVideo.id ? { ...v, ...payload } : v));
          toast("Video updated successfully");
        }
      } else {
        const { data, error } = await supabase.from("videos").insert(payload).select().single();
        if (!error && data) {
          setVideos(prev => [data, ...prev]);
          toast("Video added successfully");
        } else {
          // local fallback
          const newVideo: Video = { id: Date.now().toString(), ...payload, created_at: new Date().toISOString(), views: 0 };
          setVideos(prev => [newVideo, ...prev]);
          toast("Video saved (offline mode)");
        }
      }

      setShowUpload(false);
      resetForm();
    } catch {
      toast("Failed to save video", "error");
    } finally {
      setSaving(false);
    }
  };

  const featuredCount = videos.filter(v => v.is_featured).length;
  const publishedCount = videos.filter(v => v.published).length;
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif mb-1">Video Library</h2>
          <p className="text-white/40 text-sm">Manage sermons, teachings, and broadcasts</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowUpload(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-amber-400/10"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Videos", value: videos.length, color: "text-blue-400", bg: "bg-blue-400/10", icon: <Video className="w-4 h-4" /> },
          { label: "Published", value: publishedCount, color: "text-emerald-400", bg: "bg-emerald-400/10", icon: <Eye className="w-4 h-4" /> },
          { label: "Featured", value: featuredCount, color: "text-amber-400", bg: "bg-amber-400/10", icon: <Star className="w-4 h-4" /> },
          { label: "Total Views", value: formatViews(totalViews), color: "text-purple-400", bg: "bg-purple-400/10", icon: <Play className="w-4 h-4" /> },
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
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${category === cat ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "text-white/40 border border-white/8 hover:border-white/20 hover:text-white/70"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video List */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Video className="w-10 h-10 text-white/15 mb-3" />
            <p className="text-white/30 text-sm">No videos found</p>
            <button onClick={() => { resetForm(); setShowUpload(true); }} className="mt-3 text-amber-400 text-xs hover:underline">
              Add your first video
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/4">
            {filtered.map(video => (
              <VideoRow
                key={video.id}
                video={video}
                onSelect={setPreviewVideo}
                onToggleFeature={toggleFeature}
                onTogglePublish={togglePublish}
                onDelete={deleteVideo}
                onEdit={openEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewVideo(null)}>
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-4 w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">{previewVideo.title}</h3>
                <p className="text-white/40 text-xs mt-0.5">{previewVideo.category} · {previewVideo.duration} · {formatViews(previewVideo.views)} views</p>
              </div>
              <button onClick={() => setPreviewVideo(null)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <VideoPlayer
              src={previewVideo.file_url}
              youtubeUrl={previewVideo.youtube_url}
              thumbnail={previewVideo.thumbnail_url}
              title={previewVideo.title}
              className="w-full"
            />
            {previewVideo.description && (
              <p className="text-white/40 text-sm mt-4 leading-relaxed">{previewVideo.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Upload / Edit Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => { setShowUpload(false); resetForm(); }}>
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-2xl mt-8 mb-8" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h3 className="text-white font-semibold">{editVideo ? "Edit Video" : "Add New Video"}</h3>
              <button onClick={() => { setShowUpload(false); resetForm(); }} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Upload type toggle */}
              <div className="flex gap-2 bg-white/4 rounded-xl p-1">
                <button
                  onClick={() => setUploadType("youtube")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${uploadType === "youtube" ? "bg-red-600/20 text-red-400 border border-red-600/30" : "text-white/40 hover:text-white/70"}`}
                >
                  <Tv className="w-4 h-4" />
                  YouTube / Link
                </button>
                <button
                  onClick={() => setUploadType("file")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${uploadType === "file" ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "text-white/40 hover:text-white/70"}`}
                >
                  <Upload className="w-4 h-4" />
                  Upload MP4
                </button>
              </div>

              {/* YouTube URL or file upload */}
              {uploadType === "youtube" ? (
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">YouTube URL *</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.youtube_url}
                    onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
                  />
                  <p className="text-white/25 text-[11px] mt-1.5">Supports youtube.com/watch?v=, youtu.be/, and /live/ URLs</p>
                </div>
              ) : (
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Video File (MP4) *</label>
                  {editVideo?.file_url && !uploadedVideo ? (
                    <div className="flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-xl mb-2">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm flex-1 truncate">Current video file</span>
                      <button onClick={() => setUploadedVideo(null)} className="text-white/30 hover:text-white/60 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : uploadedVideo ? (
                    <div className="flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-xl">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm flex-1 truncate">{uploadedVideo.name}</span>
                      <button onClick={() => setUploadedVideo(null)} className="text-white/30 hover:text-white/60 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadDropzone
                      bucket="video_files"
                      folder="sermons"
                      accept="video/mp4,video/mov,video/avi,video/*"
                      maxSizeMB={500}
                      onUploaded={files => files[0] && setUploadedVideo(files[0])}
                    />
                  )}
                </div>
              )}

              {/* Thumbnail */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Thumbnail Image</label>
                {uploadedThumb ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-xl">
                    <img src={uploadedThumb.url} alt="thumb" className="w-12 h-8 rounded object-cover" />
                    <span className="text-emerald-400 text-sm flex-1 truncate">{uploadedThumb.name}</span>
                    <button onClick={() => setUploadedThumb(null)} className="text-white/30 hover:text-white/60 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <UploadDropzone
                    bucket="cover_arts"
                    folder="video_thumbs"
                    accept="image/jpeg,image/png,image/webp"
                    maxSizeMB={5}
                    compact
                    onUploaded={files => files[0] && setUploadedThumb(files[0])}
                  />
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Video title..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Description</label>
                <textarea
                  placeholder="Brief description of the video..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
                />
              </div>

              {/* Category + Duration row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full appearance-none bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors pr-10"
                    >
                      {CATEGORIES.filter(c => c !== "All").map(c => (
                        <option key={c} value={c} className="bg-[#0d1117]">{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 45:30"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="prayer, worship, faith (comma separated)"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowUpload(false); resetForm(); }}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editVideo ? "Save Changes" : "Add Video"
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
