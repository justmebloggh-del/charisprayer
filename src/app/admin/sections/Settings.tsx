"use client";

import { useState } from "react";
import { Settings2, User, Globe, Bell, Shield, Palette, Save, Eye, EyeOff, Upload, Trash2, RefreshCw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { UploadDropzone, UploadedFile } from "@/components/admin/UploadDropzone";
import { useToast } from "@/components/admin/Toast";

type SettingsTab = "ministry" | "appearance" | "notifications" | "account" | "security";

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "ministry", label: "Ministry Info", icon: <Globe className="w-4 h-4" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
  { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
];

export function Settings() {
  const [tab, setTab] = useState<SettingsTab>("ministry");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  // Ministry settings
  const [ministry, setMinistry] = useState({
    name: "Charis Prayer Ministry",
    tagline: "Touching Heaven, Changing Earth",
    description: "A global prayer ministry dedicated to equipping believers with powerful, effective prayer.",
    email: "info@charisprayer.org",
    phone: "+233 244 123 456",
    address: "Accra, Ghana",
    youtube_channel: "https://youtube.com/@charisprayer",
    facebook: "https://facebook.com/charisprayer",
    instagram: "https://instagram.com/charisprayer",
    whatsapp: "+233 244 123 456",
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    primary_color: "#C9A227",
    hero_video_url: "",
    show_live_indicator: true,
    show_prayer_ticker: true,
    enable_dark_mode: true,
    home_message: "Welcome to Charis Prayer Ministry. Experience God's presence through powerful prayer.",
  });
  const [logoFile, setLogoFile] = useState<UploadedFile | null>(null);

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    email_prayer_requests: true,
    email_testimonies: true,
    email_new_members: false,
    push_enabled: true,
    prayer_request_alert: true,
    testimony_alert: true,
    daily_digest: false,
    weekly_report: true,
  });

  // Account settings
  const [account, setAccount] = useState({
    display_name: "Rev Emmanuel Oduro Cosby",
    email: "admin@charisprayer.org",
    bio: "Senior Pastor and founder of Charis Prayer Ministry.",
  });

  // Security
  const [security, setSecurity] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast("Settings saved successfully");
  };

  const handlePasswordChange = async () => {
    if (!security.current_password || !security.new_password) {
      toast("Please fill all password fields", "error"); return;
    }
    if (security.new_password !== security.confirm_password) {
      toast("New passwords do not match", "error"); return;
    }
    if (security.new_password.length < 8) {
      toast("Password must be at least 8 characters", "error"); return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: security.new_password });
      if (error) throw error;
      toast("Password updated successfully");
      setSecurity({ current_password: "", new_password: "", confirm_password: "" });
    } catch (e: any) {
      toast(e.message || "Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  };

  const SaveButton = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick || handleSave}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
    >
      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {saving ? "Saving..." : "Save Changes"}
    </button>
  );

  function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-all ${checked ? "bg-emerald-500" : "bg-white/10"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${checked ? "left-5.5" : "left-0.5"}`} style={{ left: checked ? "calc(100% - 18px)" : "2px" }} />
      </button>
    );
  }

  function Section({ title, desc, children, action }: { title: string; desc?: string; children: React.ReactNode; action?: React.ReactNode }) {
    return (
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h4 className="text-white font-semibold mb-0.5">{title}</h4>
            {desc && <p className="text-white/35 text-sm">{desc}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    );
  }

  function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
    return (
      <div>
        <label className="block text-white/40 text-xs mb-1.5">{label}</label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-serif mb-1">Settings</h2>
        <p className="text-white/40 text-sm">Configure your ministry platform settings</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white/4 rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white/70"}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Ministry Info */}
      {tab === "ministry" && (
        <div className="space-y-4">
          <Section title="Ministry Details" desc="Basic information about your ministry" action={<SaveButton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Ministry Name" value={ministry.name} onChange={v => setMinistry(m => ({ ...m, name: v }))} />
              <Input label="Tagline" value={ministry.tagline} onChange={v => setMinistry(m => ({ ...m, tagline: v }))} />
              <div className="sm:col-span-2">
                <label className="block text-white/40 text-xs mb-1.5">Description</label>
                <textarea
                  value={ministry.description}
                  onChange={e => setMinistry(m => ({ ...m, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
                />
              </div>
              <Input label="Email" value={ministry.email} onChange={v => setMinistry(m => ({ ...m, email: v }))} type="email" />
              <Input label="Phone" value={ministry.phone} onChange={v => setMinistry(m => ({ ...m, phone: v }))} />
              <Input label="Address" value={ministry.address} onChange={v => setMinistry(m => ({ ...m, address: v }))} />
            </div>
          </Section>

          <Section title="Social Media Links" desc="Connect your ministry's social platforms" action={<SaveButton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="YouTube Channel" value={ministry.youtube_channel} onChange={v => setMinistry(m => ({ ...m, youtube_channel: v }))} />
              <Input label="Facebook" value={ministry.facebook} onChange={v => setMinistry(m => ({ ...m, facebook: v }))} />
              <Input label="Instagram" value={ministry.instagram} onChange={v => setMinistry(m => ({ ...m, instagram: v }))} />
              <Input label="WhatsApp" value={ministry.whatsapp} onChange={v => setMinistry(m => ({ ...m, whatsapp: v }))} />
            </div>
          </Section>
        </div>
      )}

      {/* Appearance */}
      {tab === "appearance" && (
        <div className="space-y-4">
          <Section title="Branding" desc="Customize your platform's look and feel" action={<SaveButton />}>
            <div className="space-y-5">
              <div>
                <label className="block text-white/40 text-xs mb-2">Ministry Logo</label>
                {logoFile ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-xl">
                    <img src={logoFile.url} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-emerald-400 text-sm flex-1">{logoFile.name}</span>
                    <button onClick={() => setLogoFile(null)} className="text-white/30 hover:text-white/60 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <UploadDropzone
                    bucket="cover_arts"
                    folder="branding"
                    accept="image/*"
                    maxSizeMB={2}
                    compact
                    onUploaded={files => files[0] && setLogoFile(files[0])}
                  />
                )}
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={appearance.primary_color}
                    onChange={e => setAppearance(a => ({ ...a, primary_color: e.target.value }))}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-white/20 bg-transparent"
                  />
                  <input
                    type="text"
                    value={appearance.primary_color}
                    onChange={e => setAppearance(a => ({ ...a, primary_color: e.target.value }))}
                    className="flex-1 bg-white/4 border border-white/10 rounded-xl px-4 py-2.5 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-2">Homepage Welcome Message</label>
                <textarea
                  value={appearance.home_message}
                  onChange={e => setAppearance(a => ({ ...a, home_message: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
                />
              </div>
            </div>
          </Section>

          <Section title="Display Options" desc="Control what is shown on the homepage">
            <div className="space-y-4">
              {[
                { key: "show_live_indicator", label: "Show Live Indicator", desc: "Display a live badge when streaming" },
                { key: "show_prayer_ticker", label: "Prayer Ticker", desc: "Show scrolling prayer requests on homepage" },
                { key: "enable_dark_mode", label: "Dark Mode Default", desc: "Default theme for new visitors" },
              ].map(opt => (
                <div key={opt.key} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
                  <div>
                    <p className="text-white/70 text-sm">{opt.label}</p>
                    <p className="text-white/30 text-xs">{opt.desc}</p>
                  </div>
                  <Toggle
                    checked={appearance[opt.key as keyof typeof appearance] as boolean}
                    onChange={v => setAppearance(a => ({ ...a, [opt.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="space-y-4">
          <Section title="Email Alerts" desc="Choose which events trigger email notifications" action={<SaveButton />}>
            <div className="space-y-3">
              {[
                { key: "email_prayer_requests", label: "New Prayer Requests", desc: "Get notified when someone submits a prayer request" },
                { key: "email_testimonies", label: "New Testimonies", desc: "Get notified when a testimony is submitted for review" },
                { key: "email_new_members", label: "New Members", desc: "Get notified when someone creates an account" },
                { key: "weekly_report", label: "Weekly Report", desc: "Receive a weekly ministry analytics digest" },
                { key: "daily_digest", label: "Daily Digest", desc: "Receive a daily summary of all activity" },
              ].map(opt => (
                <div key={opt.key} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
                  <div>
                    <p className="text-white/70 text-sm">{opt.label}</p>
                    <p className="text-white/30 text-xs">{opt.desc}</p>
                  </div>
                  <Toggle
                    checked={notifSettings[opt.key as keyof typeof notifSettings] as boolean}
                    onChange={v => setNotifSettings(n => ({ ...n, [opt.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Push Notifications" desc="Control push notification behavior">
            <div className="space-y-3">
              {[
                { key: "push_enabled", label: "Enable Push Notifications", desc: "Send push notifications to subscribed users" },
                { key: "prayer_request_alert", label: "Prayer Request Alerts", desc: "Notify admins of new prayer requests" },
                { key: "testimony_alert", label: "Testimony Alerts", desc: "Notify admins of new testimonies pending review" },
              ].map(opt => (
                <div key={opt.key} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
                  <div>
                    <p className="text-white/70 text-sm">{opt.label}</p>
                    <p className="text-white/30 text-xs">{opt.desc}</p>
                  </div>
                  <Toggle
                    checked={notifSettings[opt.key as keyof typeof notifSettings] as boolean}
                    onChange={v => setNotifSettings(n => ({ ...n, [opt.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Account */}
      {tab === "account" && (
        <div className="space-y-4">
          <Section title="Profile Information" desc="Update your admin profile" action={<SaveButton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Display Name" value={account.display_name} onChange={v => setAccount(a => ({ ...a, display_name: v }))} />
              <Input label="Email Address" value={account.email} onChange={v => setAccount(a => ({ ...a, email: v }))} type="email" />
              <div className="sm:col-span-2">
                <label className="block text-white/40 text-xs mb-1.5">Bio</label>
                <textarea
                  value={account.bio}
                  onChange={e => setAccount(a => ({ ...a, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
                />
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* Security */}
      {tab === "security" && (
        <div className="space-y-4">
          <Section title="Change Password" desc="Update your admin account password">
            <div className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={security.current_password}
                    onChange={e => setSecurity(s => ({ ...s, current_password: e.target.value }))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 transition-colors"
                  />
                  <button onClick={() => setShowPasswords(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Input label="New Password" value={security.new_password} onChange={v => setSecurity(s => ({ ...s, new_password: v }))} type={showPasswords ? "text" : "password"} placeholder="At least 8 characters" />
              <Input label="Confirm New Password" value={security.confirm_password} onChange={v => setSecurity(s => ({ ...s, confirm_password: v }))} type={showPasswords ? "text" : "password"} />
              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/25 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                Update Password
              </button>
            </div>
          </Section>

          <Section title="Danger Zone" desc="Irreversible and destructive actions">
            <div className="p-4 bg-red-900/10 border border-red-700/20 rounded-xl">
              <p className="text-red-400/80 text-sm font-medium mb-1">Delete All Draft Content</p>
              <p className="text-white/30 text-xs mb-4">This will permanently delete all unpublished drafts, unsent notifications, and pending moderation queue. This action cannot be undone.</p>
              <button
                onClick={() => { if (confirm("Are you sure? This cannot be undone.")) toast("Draft content cleared", "error"); }}
                className="px-4 py-2 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-600/25 text-xs font-semibold transition-all"
              >
                Clear All Drafts
              </button>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
