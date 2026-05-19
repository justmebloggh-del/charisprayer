"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, X, Edit3, Trash2, Eye, EyeOff, Star, Search, Tag, Calendar, ChevronDown, BookOpen, Clock, Globe, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { UploadDropzone, UploadedFile } from "@/components/admin/UploadDropzone";
import { useToast } from "@/components/admin/Toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string | null;
  category: string;
  tags?: string[];
  author: string;
  is_featured: boolean;
  published: boolean;
  published_at?: string | null;
  created_at: string;
  read_time?: number;
  views?: number;
}

const CATEGORIES = ["All", "Devotional", "Teaching", "Prayer", "Testimony", "News", "Announcement", "Event"];

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "5 Powerful Prayers for Financial Breakthrough",
    slug: "5-powerful-prayers-financial-breakthrough",
    content: "<h2>Introduction</h2><p>God is a God of abundance and He desires to prosper His people...</p>",
    excerpt: "Discover five life-changing prayers that will open doors of financial breakthrough in your life.",
    category: "Prayer",
    tags: ["prayer", "finance", "breakthrough"],
    author: "Rev Emmanuel Oduro Cosby",
    is_featured: true,
    published: true,
    published_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    read_time: 5,
    views: 1240,
  },
  {
    id: "2",
    title: "The Power of Midnight Prayer",
    slug: "power-of-midnight-prayer",
    content: "<h2>Why Midnight?</h2><p>There is something powerful about praying in the midnight hour...</p>",
    excerpt: "Unlock the mysteries of midnight prayer and why it carries extraordinary spiritual power.",
    category: "Teaching",
    tags: ["prayer", "midnight", "spiritual warfare"],
    author: "Rev Emmanuel Oduro Cosby",
    is_featured: false,
    published: true,
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    read_time: 7,
    views: 890,
  },
  {
    id: "3",
    title: "Annual Conference 2025 — Registration Open",
    slug: "annual-conference-2025-registration",
    content: "<p>We are excited to announce that registration for our Annual Conference 2025 is now open...</p>",
    excerpt: "Join us for three days of powerful worship, teaching, and divine encounters.",
    category: "Event",
    tags: ["conference", "2025", "event"],
    author: "Admin",
    is_featured: true,
    published: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    read_time: 3,
    views: 0,
  },
];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

type EditorView = "list" | "editor";

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [view, setView] = useState<EditorView>("list");
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [saving, setSaving] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Devotional",
    tags: "",
    author: "Rev Emmanuel Oduro Cosby",
    is_featured: false,
    published: false,
    read_time: 5,
  });
  const [coverImage, setCoverImage] = useState<UploadedFile | null>(null);

  const openNew = () => {
    setEditPost(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", category: "Devotional", tags: "", author: "Rev Emmanuel Oduro Cosby", is_featured: false, published: false, read_time: 5 });
    setCoverImage(null);
    setView("editor");
  };

  const openEdit = (post: BlogPost) => {
    setEditPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category,
      tags: post.tags?.join(", ") || "",
      author: post.author,
      is_featured: post.is_featured,
      published: post.published,
      read_time: post.read_time || 5,
    });
    setCoverImage(null);
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this post?")) return;
    setPosts(prev => prev.filter(p => p.id !== id));
    toast("Post deleted", "error");
  };

  const toggleFeature = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p));
    toast("Featured status updated");
  };

  const togglePublish = (id: string) => {
    const post = posts.find(p => p.id === id);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !p.published, published_at: !p.published ? new Date().toISOString() : p.published_at } : p));
    toast(post?.published ? "Post unpublished" : "Post published");
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title.trim()) { toast("Title is required", "error"); return; }
    if (!form.content.trim() || form.content === "<br>" || form.content === "<div><br></div>") {
      toast("Content is required", "error"); return;
    }

    setSaving(true);
    try {
      const shouldPublish = publish !== undefined ? publish : form.published;
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        author: form.author,
        is_featured: form.is_featured,
        published: shouldPublish,
        published_at: shouldPublish ? new Date().toISOString() : null,
        cover_image_url: coverImage?.url || editPost?.cover_image_url || null,
        read_time: form.read_time,
      };

      if (editPost) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editPost.id);
        setPosts(prev => prev.map(p => p.id === editPost.id ? { ...p, ...payload } : p));
        if (!error) toast("Post updated");
        else toast("Post updated (offline)");
      } else {
        const { data, error } = await supabase.from("blog_posts").insert(payload).select().single();
        if (!error && data) {
          setPosts(prev => [data, ...prev]);
        } else {
          const newPost: BlogPost = { id: Date.now().toString(), ...payload, views: 0, created_at: new Date().toISOString() };
          setPosts(prev => [newPost, ...prev]);
        }
        toast(shouldPublish ? "Post published!" : "Draft saved");
      }
      setView("list");
    } catch {
      toast("Failed to save post", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = posts.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;
  const featuredCount = posts.filter(p => p.is_featured).length;

  if (view === "editor") {
    return (
      <div className="space-y-6">
        {/* Editor header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              ← Posts
            </button>
            <span className="text-white/15">/</span>
            <span className="text-white/60 text-sm">{editPost ? "Edit Post" : "New Post"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-sm font-medium transition-all"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 text-sm font-semibold transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="xl:col-span-2 space-y-4">
            {/* Title */}
            <input
              type="text"
              placeholder="Post title..."
              value={form.title}
              onChange={e => {
                setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }));
              }}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-2xl font-bold font-serif placeholder-white/20 focus:outline-none focus:border-amber-400/40 transition-colors"
            />

            {/* Excerpt */}
            <textarea
              placeholder="Brief excerpt / description..."
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white/60 text-sm placeholder-white/20 focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
            />

            {/* Rich Text Editor */}
            <RichTextEditor
              value={form.content}
              onChange={content => setForm(f => ({ ...f, content }))}
              placeholder="Start writing your post..."
              minHeight={400}
            />
          </div>

          {/* Sidebar settings */}
          <div className="space-y-4">
            {/* Publish settings */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <h4 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Post Settings</h4>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">Status</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${form.published ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-white/30 bg-white/4 border-white/8"}`}>
                    {form.published ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-sm">Featured Post</p>
                    <p className="text-white/25 text-xs">Show on homepage</p>
                  </div>
                  <button
                    onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
                    className={`relative w-10 h-5 rounded-full transition-all ${form.is_featured ? "bg-amber-500" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.is_featured ? "left-5.5" : "left-0.5"}`} />
                  </button>
                </div>

                {/* Read time */}
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Read Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={form.read_time}
                    onChange={e => setForm(f => ({ ...f, read_time: parseInt(e.target.value) || 5 }))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Category + Author */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <h4 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Classification</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-white/40 text-xs mb-1.5">Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full appearance-none bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors pr-8"
                    >
                      {CATEGORIES.filter(c => c !== "All").map(c => (
                        <option key={c} value={c} className="bg-[#0d1117]">{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1.5">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1.5">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="prayer, faith, worship"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* URL Slug */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <h4 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">URL Slug</h4>
              <div className="flex items-center gap-2 bg-white/4 border border-white/10 rounded-xl px-3 py-2.5">
                <span className="text-white/20 text-xs">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="flex-1 bg-transparent text-white/60 text-xs focus:outline-none focus:text-white/80"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <h4 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Cover Image</h4>
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage.url} alt="cover" className="w-full h-32 object-cover rounded-xl" />
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : editPost?.cover_image_url ? (
                <div className="relative">
                  <img src={editPost.cover_image_url} alt="cover" className="w-full h-32 object-cover rounded-xl" />
                  <div className="mt-2">
                    <UploadDropzone
                      bucket="cover_arts"
                      folder="blog"
                      accept="image/*"
                      maxSizeMB={5}
                      compact
                      onUploaded={files => files[0] && setCoverImage(files[0])}
                    />
                  </div>
                </div>
              ) : (
                <UploadDropzone
                  bucket="cover_arts"
                  folder="blog"
                  accept="image/*"
                  maxSizeMB={5}
                  compact
                  onUploaded={files => files[0] && setCoverImage(files[0])}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif mb-1">Blog & Announcements</h2>
          <p className="text-white/40 text-sm">Manage posts, devotionals, and ministry announcements</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 rounded-xl font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Posts", value: posts.length, color: "text-blue-400", bg: "bg-blue-400/10", icon: <FileText className="w-4 h-4" /> },
          { label: "Published", value: publishedCount, color: "text-emerald-400", bg: "bg-emerald-400/10", icon: <Globe className="w-4 h-4" /> },
          { label: "Drafts", value: draftCount, color: "text-white/40", bg: "bg-white/6", icon: <Lock className="w-4 h-4" /> },
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
            placeholder="Search posts..."
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

      {/* Posts list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-12 text-center">
            <FileText className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No posts found</p>
            <button onClick={openNew} className="mt-3 text-amber-400 text-xs hover:underline">
              Write your first post
            </button>
          </div>
        ) : (
          filtered.map(post => (
            <div key={post.id} className="group bg-white/[0.02] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                {/* Cover thumbnail */}
                {post.cover_image_url ? (
                  <img src={post.cover_image_url} alt={post.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0 border border-white/8" />
                ) : (
                  <div className="w-20 h-16 bg-white/4 border border-white/8 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white/15" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    <h4 className="text-white/85 font-medium leading-tight">{post.title}</h4>
                    {post.is_featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5" />}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ml-auto flex-shrink-0 ${post.published ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-white/25 bg-white/4 border-white/8"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-white/35 text-xs line-clamp-2 mb-2">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white/30 text-[11px] px-2 py-0.5 bg-white/4 rounded-full border border-white/6">{post.category}</span>
                    <span className="text-white/25 text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}m read</span>
                    <span className="text-white/25 text-[11px]">{timeAgo(post.created_at)}</span>
                    {post.views !== undefined && post.views > 0 && (
                      <span className="text-white/25 text-[11px]">{post.views.toLocaleString()} views</span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-amber-400/40 text-[10px] px-1.5 py-0.5 bg-amber-400/5 rounded border border-amber-400/10">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => toggleFeature(post.id)}
                    className={`p-2 rounded-xl transition-all ${post.is_featured ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "text-white/25 hover:text-amber-400 hover:bg-amber-400/10 border border-transparent"}`}
                    title="Feature"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => togglePublish(post.id)}
                    className={`p-2 rounded-xl transition-all ${post.published ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/25" : "text-white/25 hover:text-emerald-400 hover:bg-emerald-400/10 border border-transparent"}`}
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(post)}
                    className="p-2 rounded-xl text-white/25 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent transition-all"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-xl text-white/25 hover:text-red-400 hover:bg-red-400/10 border border-transparent transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
