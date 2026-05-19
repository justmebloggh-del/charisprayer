"use client";

import { useState } from "react";
import { Bell, Send, Users, Globe, Tag, Plus, X, Trash2, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  target: "all" | "prayer" | "members" | "new";
  type: "announcement" | "prayer" | "event" | "update";
  scheduled_at?: string;
  sent_at?: string;
  status: "draft" | "scheduled" | "sent";
  reach?: number;
  created_at: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Sunday Service Reminder", message: "Join us tomorrow for our Sunday morning worship service at 9:00 AM. God has something special in store!", target: "all", type: "announcement", sent_at: new Date(Date.now() - 86400000).toISOString(), status: "sent", reach: 12400, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "2", title: "Midnight Prayer Watch Tonight", message: "Don't miss our monthly midnight prayer warfare session starting at 11:30 PM. Bring your prayer points!", target: "prayer", type: "prayer", scheduled_at: new Date(Date.now() + 3600000).toISOString(), status: "scheduled", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", title: "New Audio Upload: Morning Devotion", message: "A fresh morning devotion has been uploaded. Start your day with God's Word!", target: "all", type: "update", status: "draft", created_at: new Date(Date.now() - 1800000).toISOString() },
];

const TYPE_CONFIG = {
  announcement: { label: "Announcement", color: "text-blue-400", bg: "bg-blue-400/10" },
  prayer: { label: "Prayer", color: "text-purple-400", bg: "bg-purple-400/10" },
  event: { label: "Event", color: "text-amber-400", bg: "bg-amber-400/10" },
  update: { label: "Update", color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "text-white/40", bg: "bg-white/6", border: "border-white/10" },
  scheduled: { label: "Scheduled", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  sent: { label: "Sent", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
};

const TARGET_LABELS: Record<Notification["target"], string> = {
  all: "All Users",
  prayer: "Prayer Warriors",
  members: "Members",
  new: "New Subscribers",
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    message: "",
    target: "all" as Notification["target"],
    type: "announcement" as Notification["type"],
    scheduled_at: "",
  });

  const resetForm = () => {
    setForm({ title: "", message: "", target: "all", type: "announcement", scheduled_at: "" });
  };

  const handleSend = async (id: string) => {
    setSending(id);
    await new Promise(r => setTimeout(r, 1500));
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: "sent" as const, sent_at: new Date().toISOString(), reach: Math.floor(Math.random() * 10000) + 2000 } : n));
    setSending(null);
    toast("Notification sent successfully!");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this notification?")) return;
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast("Notification deleted", "error");
  };

  const handleCreate = () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast("Title and message are required", "error");
      return;
    }
    const newNotif: Notification = {
      id: Date.now().toString(),
      ...form,
      status: form.scheduled_at ? "scheduled" : "draft",
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : undefined,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
    toast(form.scheduled_at ? "Notification scheduled" : "Draft saved");
    setShowForm(false);
    resetForm();
  };

  const sentCount = notifications.filter(n => n.status === "sent").length;
  const scheduledCount = notifications.filter(n => n.status === "scheduled").length;
  const totalReach = notifications.filter(n => n.reach).reduce((acc, n) => acc + (n.reach || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif mb-1">Notifications</h2>
          <p className="text-white/40 text-sm">Send push notifications and announcements to your community</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 rounded-xl font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          New Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Sent", value: sentCount, color: "text-emerald-400", bg: "bg-emerald-400/10", icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: "Scheduled", value: scheduledCount, color: "text-blue-400", bg: "bg-blue-400/10", icon: <Clock className="w-4 h-4" /> },
          { label: "Total Reach", value: totalReach.toLocaleString(), color: "text-purple-400", bg: "bg-purple-400/10", icon: <Users className="w-4 h-4" /> },
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

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.map(n => {
          const typeCfg = TYPE_CONFIG[n.type];
          const statusCfg = STATUS_CONFIG[n.status];
          return (
            <div key={n.id} className="group bg-white/[0.02] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className={`${typeCfg.bg} ${typeCfg.color} p-2.5 rounded-xl flex-shrink-0`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                    <h4 className="text-white/85 font-medium">{n.title}</h4>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mb-3">{n.message}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.color}`}>{typeCfg.label}</span>
                    <span className="text-white/30 text-xs flex items-center gap-1"><Users className="w-3 h-3" />{TARGET_LABELS[n.target]}</span>
                    {n.reach && <span className="text-white/30 text-xs flex items-center gap-1"><Globe className="w-3 h-3" />{n.reach.toLocaleString()} reached</span>}
                    {n.sent_at && <span className="text-white/25 text-xs">Sent {new Date(n.sent_at).toLocaleDateString()}</span>}
                    {n.scheduled_at && n.status === "scheduled" && (
                      <span className="text-blue-400/70 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Scheduled {new Date(n.scheduled_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {n.status !== "sent" && (
                    <button
                      onClick={() => handleSend(n.id)}
                      disabled={sending === n.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 border border-emerald-400/20 text-xs font-medium transition-all disabled:opacity-50"
                    >
                      {sending === n.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      {sending === n.id ? "Sending..." : "Send Now"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-2 rounded-xl text-white/25 hover:text-red-400 hover:bg-red-400/10 border border-transparent transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-lg mt-8 mb-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h3 className="text-white font-semibold">New Notification</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Notification title..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Message *</label>
                <textarea
                  placeholder="What do you want to say?"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
                />
                <p className="text-white/25 text-xs mt-1">{form.message.length}/200 characters</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Type</label>
                  <div className="relative">
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Notification["type"] }))} className="w-full appearance-none bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 pr-10">
                      <option value="announcement" className="bg-[#0d1117]">Announcement</option>
                      <option value="prayer" className="bg-[#0d1117]">Prayer</option>
                      <option value="event" className="bg-[#0d1117]">Event</option>
                      <option value="update" className="bg-[#0d1117]">Update</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Target Audience</label>
                  <div className="relative">
                    <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value as Notification["target"] }))} className="w-full appearance-none bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 pr-10">
                      <option value="all" className="bg-[#0d1117]">All Users</option>
                      <option value="prayer" className="bg-[#0d1117]">Prayer Warriors</option>
                      <option value="members" className="bg-[#0d1117]">Members</option>
                      <option value="new" className="bg-[#0d1117]">New Subscribers</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Schedule (Optional)</label>
                <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors" />
                <p className="text-white/25 text-xs mt-1">Leave empty to save as draft and send manually</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-sm font-medium transition-all">
                  Cancel
                </button>
                <button onClick={handleCreate} className="flex-1 py-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 text-sm font-semibold transition-all">
                  {form.scheduled_at ? "Schedule" : "Save Draft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
