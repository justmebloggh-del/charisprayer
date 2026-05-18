// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const ADMIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: 'Jost', system-ui, sans-serif; background: #0d1117; color: #e6edf3; overflow-x: hidden; }
  .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulseRed { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideIn { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
  .gold-text {
    background: linear-gradient(135deg, #C9A227 0%, #F5D785 40%, #C9A227 80%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: shimmer 4s linear infinite;
  }
  .live-dot { animation: pulseRed 1.4s ease-in-out infinite; }
  .fade-in { animation: fadeIn 0.4s ease forwards; }
  .slide-in { animation: slideIn 0.3s ease forwards; }
  .admin-btn { font-family:'Jost',sans-serif; cursor:pointer; border:none; transition:all 0.2s; }
  .admin-btn:hover { opacity:0.85; transform:translateY(-1px); }
  .admin-input { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:10px 14px; color:#e6edf3; font-family:'Jost',sans-serif; font-size:14px; outline:none; width:100%; transition:border 0.2s; }
  .admin-input:focus { border-color:#C9A227; }
  .admin-input::placeholder { color:rgba(255,255,255,0.3); }
  .admin-select { background:#161b22; border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:10px 14px; color:#e6edf3; font-family:'Jost',sans-serif; font-size:14px; outline:none; width:100%; cursor:pointer; }
  .admin-select:focus { border-color:#C9A227; }
  .sidebar-item { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:10px; cursor:pointer; transition:all 0.2s; font-size:13px; font-weight:500; letter-spacing:0.3px; border:none; background:none; width:100%; text-align:left; color:rgba(255,255,255,0.6); }
  .sidebar-item:hover { background:rgba(201,162,39,0.08); color:#C9A227; }
  .sidebar-item.active { background:rgba(201,162,39,0.12); color:#C9A227; border-left:3px solid #C9A227; }
  .stat-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:22px; transition:all 0.2s; }
  .stat-card:hover { border-color:rgba(201,162,39,0.3); background:rgba(201,162,39,0.04); }
  .table-row:hover { background:rgba(255,255,255,0.04); }
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:0.5px; }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; }
  .modal-box { background:#161b22; border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:36px; width:90%; max-width:560px; max-height:90vh; overflow-y:auto; animation:fadeIn 0.3s ease; }
  .upload-zone { border:2px dashed rgba(201,162,39,0.3); border-radius:12px; padding:40px; text-align:center; cursor:pointer; transition:all 0.2s; }
  .upload-zone:hover { border-color:#C9A227; background:rgba(201,162,39,0.04); }
  .toggle { position:relative; width:44px; height:24px; background:rgba(255,255,255,0.15); border-radius:12px; cursor:pointer; transition:background 0.2s; border:none; }
  .toggle.on { background:#C9A227; }
  .toggle::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; background:#fff; border-radius:50%; transition:transform 0.2s; }
  .toggle.on::after { transform:translateX(20px); }
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:#0d1117; }
  ::-webkit-scrollbar-thumb { background:#C9A227; border-radius:3px; }
  .notification-dot { width:8px; height:8px; background:#ff3b3b; border-radius:50%; animation:pulseRed 1.4s infinite; }
  .progress-bar { height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; background:linear-gradient(90deg,#C9A227,#F5D785); border-radius:3px; transition:width 0.5s ease; }
  .chart-bar { background:linear-gradient(180deg,#C9A227,rgba(201,162,39,0.3)); border-radius:4px 4px 0 0; transition:height 0.5s ease; }
  .day-tab { padding:8px 16px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:600; letter-spacing:0.5px; border:1px solid rgba(255,255,255,0.1); background:transparent; color:rgba(255,255,255,0.5); transition:all 0.2s; font-family:'Jost',sans-serif; }
  .day-tab.active { background:rgba(201,162,39,0.15); border-color:#C9A227; color:#C9A227; }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const INIT_AUDIOS = [
  { id: 1, title: "Morning Prayer of Breakthrough", category: "Breakthrough", scripture: "Psalm 18:2", duration: "28:45", plays: 1240, featured: true, day: "Monday", description: "A powerful morning prayer to start your day with breakthrough.", cover: null, file: "morning-breakthrough.mp3" },
  { id: 2, title: "Divine Healing Prayer", category: "Healing", scripture: "James 5:15", duration: "22:10", plays: 980, featured: false, day: "Tuesday", description: "Receive divine healing through this anointed prayer.", cover: null, file: "healing-prayer.mp3" },
  { id: 3, title: "Midnight Warfare Prayer Watch", category: "Warfare", scripture: "Isaiah 62:6", duration: "45:00", plays: 2100, featured: false, day: "Wednesday", description: "Engage in spiritual warfare at midnight.", cover: null, file: "midnight-warfare.mp3" },
  { id: 4, title: "Prayer for Financial Blessing", category: "Blessing", scripture: "Deut 28:8", duration: "31:20", plays: 1560, featured: false, day: "Thursday", description: "Unlock financial blessings through prayer.", cover: null, file: "financial-blessing.mp3" },
  { id: 5, title: "Prayer of Deliverance", category: "Deliverance", scripture: "Psalm 91:15", duration: "38:15", plays: 890, featured: false, day: "Friday", description: "Experience total deliverance through this prayer.", cover: null, file: "deliverance.mp3" },
  { id: 6, title: "Sunday Morning Worship Prayer", category: "Worship", scripture: "Psalm 100:4", duration: "52:00", plays: 3200, featured: true, day: "Sunday", description: "A glorious Sunday worship prayer experience.", cover: null, file: "sunday-worship.mp3" },
];

const INIT_VIDEOS = [
  { id: 1, title: "Morning Breakthrough Service", youtubeUrl: "https://youtube.com/watch?v=abc123", thumbnail: null, isLive: false, scheduled: "2025-05-20T06:00", featured: true, views: 4200, archived: false },
  { id: 2, title: "Midnight Prayer Watch", youtubeUrl: "https://youtube.com/watch?v=def456", thumbnail: null, isLive: true, scheduled: "2025-05-19T00:00", featured: false, views: 1800, archived: false },
  { id: 3, title: "Sunday Worship Service Archive", youtubeUrl: "https://youtube.com/watch?v=ghi789", thumbnail: null, isLive: false, scheduled: "2025-05-18T09:00", featured: false, views: 6700, archived: true },
];

const INIT_USERS = [
  { id: 1, name: "Sarah Mitchell", email: "sarah@example.com", role: "admin", joined: "2024-01-15", status: "active", country: "UK" },
  { id: 2, name: "Pastor James Kofi", email: "james@example.com", role: "moderator", joined: "2024-03-22", status: "active", country: "Ghana" },
  { id: 3, name: "Grace Adeyemi", email: "grace@example.com", role: "user", joined: "2024-06-10", status: "active", country: "Nigeria" },
  { id: 4, name: "Michael Chen", email: "michael@example.com", role: "user", joined: "2024-08-05", status: "suspended", country: "USA" },
  { id: 5, name: "Amara Diallo", email: "amara@example.com", role: "user", joined: "2025-01-20", status: "active", country: "Senegal" },
];

const INIT_TESTIMONIES = [
  { id: 1, name: "Sarah M.", location: "London, UK", tag: "Miraculous Healing", text: "After three years battling chronic illness, God healed me completely through the healing prayer session.", date: "2025-05-16", status: "approved" },
  { id: 2, name: "Pastor James K.", location: "Accra, Ghana", tag: "Business Breakthrough", text: "I joined the midnight prayer watch for 21 days. On the 22nd day, a business deal worth $500,000 came through.", date: "2025-05-10", status: "pending" },
  { id: 3, name: "Grace A.", location: "Houston, TX", tag: "Family Restoration", text: "My marriage was on the verge of collapse. After submitting a prayer request, God brought complete restoration.", date: "2025-05-04", status: "pending" },
  { id: 4, name: "Anonymous", location: "Lagos, Nigeria", tag: "Healing", text: "I was diagnosed with stage 2 cancer. After 30 days of prayer, my doctor confirmed I am cancer-free.", date: "2025-04-28", status: "approved" },
];

const INIT_PRAYERS = [
  { id: 1, name: "Emmanuel Boateng", email: "e.boateng@email.com", request: "Please pray for my mother who is in the hospital with a serious illness.", urgent: true, private: false, date: "2025-05-18", status: "prayed" },
  { id: 2, name: "Anonymous", email: "", request: "I need prayer for my marriage. We are going through a very difficult time.", urgent: false, private: true, date: "2025-05-17", status: "pending" },
  { id: 3, name: "Blessing Okafor", email: "blessing@email.com", request: "Pray for my job interview tomorrow. I really need this opportunity.", urgent: true, private: false, date: "2025-05-17", status: "pending" },
  { id: 4, name: "David Mensah", email: "david@email.com", request: "Financial breakthrough needed. I have been struggling for months.", urgent: false, private: false, date: "2025-05-16", status: "prayed" },
];

const INIT_BLOGS = [
  { id: 1, title: "5 Powerful Prayers for Breakthrough", category: "Prayer", author: "Rev Emmanuel Oduro Cosby", date: "2025-05-15", status: "published", views: 3400, excerpt: "Discover five powerful prayers that will unlock breakthrough in every area of your life." },
  { id: 2, title: "Understanding the Power of Midnight Prayer", category: "Teaching", author: "Rev Emmanuel Oduro Cosby", date: "2025-05-10", status: "published", views: 2100, excerpt: "Why midnight is a strategic time for spiritual warfare and intercession." },
  { id: 3, title: "How to Build a Daily Prayer Habit", category: "Devotional", author: "Admin", date: "2025-05-08", status: "draft", views: 0, excerpt: "Practical steps to establish a consistent and powerful daily prayer routine." },
];

const INIT_NOTIFICATIONS = [
  { id: 1, title: "New Live Service Starting", message: "Morning Breakthrough Prayer starts in 30 minutes. Join us on YouTube!", type: "live", sent: "2025-05-18T05:30", audience: "all", status: "sent" },
  { id: 2, title: "New Prayer Audio Available", message: "A new healing prayer has been uploaded. Listen now!", type: "audio", sent: "2025-05-17T10:00", audience: "all", status: "sent" },
  { id: 3, title: "21-Day Prayer Challenge", message: "Join our 21-day prayer marathon starting June 1st!", type: "event", sent: null, audience: "all", status: "scheduled" },
];

const HOMEPAGE_SECTIONS = {
  heroTitle: "Enter the Presence of God Daily",
  heroSubtitle: "Stream live prayers, download anointed messages, and experience the transforming power of God's grace.",
  liveEnabled: true,
  featuredAudioEnabled: true,
  testimonialsEnabled: true,
  scheduleEnabled: true,
  prayerRequestEnabled: true,
  announcementBanner: "🔴 LIVE NOW — Morning Prayer Service",
  announcementEnabled: true,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const GOLD = "#C9A227";
const DARK = "#0d1117";
const CARD = "#161b22";
const BORDER = "rgba(255,255,255,0.08)";

function Btn({ children, onClick, variant = "gold", size = "md", style = {} }) {
  const base = { fontFamily: "'Jost',sans-serif", cursor: "pointer", border: "none", borderRadius: 8, fontWeight: 600, letterSpacing: 0.5, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6 };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 13 }, lg: { padding: "13px 28px", fontSize: 14 } };
  const variants = {
    gold: { background: "linear-gradient(135deg,#C9A227,#E8C547)", color: "#0A1628" },
    dark: { background: "rgba(255,255,255,0.08)", color: "#e6edf3", border: "1px solid rgba(255,255,255,0.1)" },
    danger: { background: "rgba(255,59,59,0.15)", color: "#ff6b6b", border: "1px solid rgba(255,59,59,0.3)" },
    success: { background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" },
    ghost: { background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" },
  };
  return <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>;
}

function Input({ label, value, onChange, type = "text", placeholder = "", required = false, style = {} }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}{required && <span style={{ color: GOLD, marginLeft: 4 }}>*</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="admin-input" />
    </div>
  );
}

function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} className="admin-select">
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder = "" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="admin-input" style={{ resize: "vertical" }} />
    </div>
  );
}

function Toggle({ on, onToggle, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button className={`toggle ${on ? "on" : ""}`} onClick={onToggle} aria-label={label} />
      {label && <span style={{ fontSize: 13, color: on ? "#e6edf3" : "rgba(255,255,255,0.4)" }}>{label}</span>}
    </div>
  );
}

function Badge({ children, color = "gold" }) {
  const colors = {
    gold: { bg: "rgba(201,162,39,0.15)", text: "#C9A227" },
    green: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
    red: { bg: "rgba(255,59,59,0.15)", text: "#ff6b6b" },
    blue: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
    gray: { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.5)" },
    orange: { bg: "rgba(251,146,60,0.15)", text: "#fb923c" },
  };
  const c = colors[color] || colors.gold;
  return <span className="badge" style={{ background: c.bg, color: c.text }}>{children}</span>;
}

function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: width }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function UploadZone({ label, accept, onFile, fileName }) {
  const ref = useRef();
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
      <div className="upload-zone" onClick={() => ref.current?.click()}>
        <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={e => onFile && onFile(e.target.files[0])} />
        {fileName ? (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
            <div style={{ color: GOLD, fontSize: 13, fontWeight: 600 }}>{fileName}</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 4 }}>Click to replace</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>☁️</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 4 }}>Click to upload or drag & drop</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{accept}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
      <div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{title}</h2>
        {subtitle && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@charisprayer.org" && password === "Admin@2025") {
        onLogin({ name: "Rev Emmanuel Oduro Cosby", role: "super_admin", email });
      } else if (email === "mod@charisprayer.org" && password === "Mod@2025") {
        onLogin({ name: "Moderator", role: "moderator", email });
      } else {
        setError("Invalid credentials. Try admin@charisprayer.org / Admin@2025");
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#04090f,#0A1628,#0e1d38)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="fade-in">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#C9A227,#F5D785)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "#0A1628", fontFamily: "Cormorant Garamond,Georgia,serif", margin: "0 auto 16px" }}>CP</div>
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Charis Prayer Ministry</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: 36 }}>
          <Input label="Email Address" value={email} onChange={setEmail} type="email" placeholder="admin@charisprayer.org" required />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Password <span style={{ color: GOLD }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="admin-input" onKeyDown={e => e.key === "Enter" && handle()} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14 }}>{showPass ? "🙈" : "👁"}</button>
            </div>
          </div>
          {error && <div style={{ background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6b6b", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
          <Btn onClick={handle} style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 14 }}>
            {loading ? "Signing in..." : "🔐 Sign In to Dashboard"}
          </Btn>
          <div style={{ marginTop: 20, padding: "14px", background: "rgba(201,162,39,0.06)", borderRadius: 8, border: "1px solid rgba(201,162,39,0.15)" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Demo Credentials</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Admin: admin@charisprayer.org / Admin@2025</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 }}>Mod: mod@charisprayer.org / Mod@2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS DASHBOARD ─────────────────────────────────────────────────────
function Analytics() {
  const stats = [
    { label: "Total Plays", value: "9,970", change: "+12%", icon: "🎧", color: "gold" },
    { label: "Active Users", value: "12,400", change: "+8%", icon: "👥", color: "blue" },
    { label: "Prayer Requests", value: "284", change: "+23%", icon: "🙏", color: "green" },
    { label: "Live Viewers", value: "1,247", change: "+5%", icon: "📺", color: "red" },
    { label: "Testimonies", value: "48", change: "+15%", icon: "✨", color: "orange" },
    { label: "Nations Reached", value: "85", change: "+3", icon: "🌍", color: "gold" },
  ];
  const chartData = [
    { day: "Mon", plays: 65 }, { day: "Tue", plays: 82 }, { day: "Wed", plays: 74 },
    { day: "Thu", plays: 91 }, { day: "Fri", plays: 88 }, { day: "Sat", plays: 55 }, { day: "Sun", plays: 100 },
  ];
  const topAudios = [
    { title: "Sunday Morning Worship Prayer", plays: 3200, pct: 100 },
    { title: "Midnight Warfare Prayer Watch", plays: 2100, pct: 66 },
    { title: "Prayer for Financial Blessing", plays: 1560, pct: 49 },
    { title: "Morning Prayer of Breakthrough", plays: 1240, pct: 39 },
    { title: "Divine Healing Prayer", plays: 980, pct: 31 },
  ];
  const colorMap = { gold: GOLD, blue: "#60a5fa", green: "#4ade80", red: "#ff6b6b", orange: "#fb923c" };

  return (
    <div className="fade-in">
      <SectionHeader title="Analytics Dashboard" subtitle="Real-time ministry performance overview" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <Badge color={s.color === "red" ? "red" : s.color === "blue" ? "blue" : s.color === "green" ? "green" : s.color === "orange" ? "orange" : "gold"}>{s.change}</Badge>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Weekly Play Activity</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
            {chartData.map(d => (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div className="chart-bar" style={{ width: "100%", height: `${d.plays}%` }} />
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Top Audio Content</div>
          {topAudios.map((a, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", maxWidth: "75%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>{a.plays.toLocaleString()}</div>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${a.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Avg. Session Duration", value: "18m 42s", icon: "⏱" },
          { label: "Prayer Requests This Week", value: "47", icon: "🙏" },
          { label: "New Users This Month", value: "1,284", icon: "👤" },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AUDIO MANAGEMENT ─────────────────────────────────────────────────────────
function AudioManagement() {
  const [audios, setAudios] = useState(INIT_AUDIOS);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeDay, setActiveDay] = useState("All");
  const [form, setForm] = useState({ title: "", category: "Breakthrough", scripture: "", duration: "", description: "", day: "Monday", featured: false, file: null, cover: null, fileName: "", coverName: "" });

  const cats = ["Breakthrough", "Healing", "Warfare", "Blessing", "Deliverance", "Worship", "Intercession", "Thanksgiving"];

  const openAdd = () => { setEditing(null); setForm({ title: "", category: "Breakthrough", scripture: "", duration: "", description: "", day: "Monday", featured: false, file: null, cover: null, fileName: "", coverName: "" }); setModal(true); };
  const openEdit = a => { setEditing(a.id); setForm({ ...a, fileName: a.file || "", coverName: a.cover || "" }); setModal(true); };
  const save = () => {
    if (!form.title) return;
    if (editing) {
      setAudios(prev => prev.map(a => a.id === editing ? { ...a, ...form } : a));
    } else {
      setAudios(prev => [...prev, { ...form, id: Date.now(), plays: 0 }]);
    }
    setModal(false);
  };
  const del = id => setAudios(prev => prev.filter(a => a.id !== id));
  const toggleFeatured = id => setAudios(prev => prev.map(a => a.id === id ? { ...a, featured: !a.featured } : a));

  const filtered = activeDay === "All" ? audios : audios.filter(a => a.day === activeDay);

  return (
    <div className="fade-in">
      <SectionHeader
        title="Audio Management"
        subtitle={`${audios.length} audio files · Manage prayer audio library`}
        action={<Btn onClick={openAdd}>➕ Upload Audio</Btn>}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {["All", ...DAYS].map(d => (
          <button key={d} className={`day-tab ${activeDay === d ? "active" : ""}`} onClick={() => setActiveDay(d)}>{d}</button>
        ))}
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["Title", "Category", "Day", "Duration", "Plays", "Featured", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="table-row" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 13, marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>📖 {a.scripture}</div>
                </td>
                <td style={{ padding: "14px 16px" }}><Badge>{a.category}</Badge></td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{a.day}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{a.duration}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: GOLD, fontWeight: 600 }}>{a.plays.toLocaleString()}</td>
                <td style={{ padding: "14px 16px" }}>
                  <Toggle on={a.featured} onToggle={() => toggleFeatured(a.id)} />
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="dark" onClick={() => openEdit(a)}>✏️ Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => del(a.id)}>🗑</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No audio files for {activeDay}</div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Audio" : "Upload New Audio"}>
        <Input label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Prayer title" required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })} options={cats} />
          <Select label="Day of Week" value={form.day} onChange={v => setForm({ ...form, day: v })} options={DAYS} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Scripture Reference" value={form.scripture} onChange={v => setForm({ ...form, scripture: v })} placeholder="e.g. Psalm 18:2" />
          <Input label="Duration" value={form.duration} onChange={v => setForm({ ...form, duration: v })} placeholder="e.g. 28:45" />
        </div>
        <Textarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Brief description of this prayer..." rows={3} />
        <UploadZone label="MP3 Audio File" accept=".mp3,audio/*" onFile={f => setForm({ ...form, file: f, fileName: f?.name || "" })} fileName={form.fileName} />
        <UploadZone label="Cover Art (optional)" accept="image/*" onFile={f => setForm({ ...form, cover: f, coverName: f?.name || "" })} fileName={form.coverName} />
        <div style={{ marginBottom: 20 }}>
          <Toggle on={form.featured} onToggle={() => setForm({ ...form, featured: !form.featured })} label="Feature on Homepage" />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>{editing ? "💾 Save Changes" : "⬆️ Upload Audio"}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── VIDEO / LIVESTREAM MANAGEMENT ───────────────────────────────────────────
function VideoManagement() {
  const [videos, setVideos] = useState(INIT_VIDEOS);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", youtubeUrl: "", scheduled: "", isLive: false, featured: false, archived: false, thumbnail: null, thumbName: "" });

  const openAdd = () => { setEditing(null); setForm({ title: "", youtubeUrl: "", scheduled: "", isLive: false, featured: false, archived: false, thumbnail: null, thumbName: "" }); setModal(true); };
  const openEdit = v => { setEditing(v.id); setForm({ ...v, thumbName: v.thumbnail || "" }); setModal(true); };
  const save = () => {
    if (!form.title) return;
    if (editing) {
      setVideos(prev => prev.map(v => v.id === editing ? { ...v, ...form } : v));
    } else {
      setVideos(prev => [...prev, { ...form, id: Date.now(), views: 0 }]);
    }
    setModal(false);
  };
  const del = id => setVideos(prev => prev.filter(v => v.id !== id));
  const toggleLive = id => setVideos(prev => prev.map(v => v.id === id ? { ...v, isLive: !v.isLive } : v));

  return (
    <div className="fade-in">
      <SectionHeader
        title="Video & Livestream Management"
        subtitle="Manage YouTube streams, broadcasts, and archived videos"
        action={<Btn onClick={openAdd}>➕ Add Video / Stream</Btn>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 18 }}>
        {videos.map(v => (
          <div key={v.id} style={{ background: CARD, border: `1px solid ${v.isLive ? "rgba(255,59,59,0.4)" : BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ height: 140, background: "linear-gradient(135deg,#0A1628,#1a2e50)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {v.isLive && (
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 6, background: "#ff3b3b", borderRadius: 6, padding: "4px 10px" }}>
                  <div className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>LIVE</span>
                </div>
              )}
              {v.featured && <div style={{ position: "absolute", top: 10, right: 10, background: GOLD, color: "#0A1628", padding: "3px 10px", borderRadius: 5, fontSize: 10, fontWeight: 800 }}>FEATURED</div>}
              {v.archived && <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "3px 10px", borderRadius: 5, fontSize: 10, fontWeight: 700 }}>ARCHIVED</div>}
              <div style={{ fontSize: 40 }}>📺</div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 6 }}>{v.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.youtubeUrl}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>📅 {v.scheduled ? new Date(v.scheduled).toLocaleString() : "Not scheduled"} · 👁 {v.views.toLocaleString()}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                <Toggle on={v.isLive} onToggle={() => toggleLive(v.id)} label={v.isLive ? "Live" : "Offline"} />
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" variant="dark" onClick={() => openEdit(v)}>✏️</Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(v.id)}>🗑</Btn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Video / Stream" : "Add Video / Stream"}>
        <Input label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Broadcast title" required />
        <Input label="YouTube URL" value={form.youtubeUrl} onChange={v => setForm({ ...form, youtubeUrl: v })} placeholder="https://youtube.com/watch?v=..." />
        <Input label="Scheduled Date & Time" value={form.scheduled} onChange={v => setForm({ ...form, scheduled: v })} type="datetime-local" />
        <UploadZone label="Thumbnail Image" accept="image/*" onFile={f => setForm({ ...form, thumbnail: f, thumbName: f?.name || "" })} fileName={form.thumbName} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <Toggle on={form.isLive} onToggle={() => setForm({ ...form, isLive: !form.isLive })} label="Toggle Live Mode" />
          <Toggle on={form.featured} onToggle={() => setForm({ ...form, featured: !form.featured })} label="Feature on Homepage" />
          <Toggle on={form.archived} onToggle={() => setForm({ ...form, archived: !form.archived })} label="Mark as Archived" />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>{editing ? "💾 Save Changes" : "➕ Add Video"}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── HOMEPAGE MANAGEMENT ─────────────────────────────────────────────────────
function HomepageManagement() {
  const [hp, setHp] = useState(HOMEPAGE_SECTIONS);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="fade-in">
      <SectionHeader title="Homepage Management" subtitle="Control what visitors see on the public homepage" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Hero Section</div>
          <Input label="Hero Title" value={hp.heroTitle} onChange={v => setHp({ ...hp, heroTitle: v })} />
          <Textarea label="Hero Subtitle" value={hp.heroSubtitle} onChange={v => setHp({ ...hp, heroSubtitle: v })} rows={3} />
          <Input label="Announcement Banner Text" value={hp.announcementBanner} onChange={v => setHp({ ...hp, announcementBanner: v })} />
          <Toggle on={hp.announcementEnabled} onToggle={() => setHp({ ...hp, announcementEnabled: !hp.announcementEnabled })} label="Show Announcement Banner" />
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Section Visibility</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Toggle on={hp.liveEnabled} onToggle={() => setHp({ ...hp, liveEnabled: !hp.liveEnabled })} label="Live Stream Widget" />
            <Toggle on={hp.featuredAudioEnabled} onToggle={() => setHp({ ...hp, featuredAudioEnabled: !hp.featuredAudioEnabled })} label="Featured Audio Section" />
            <Toggle on={hp.testimonialsEnabled} onToggle={() => setHp({ ...hp, testimonialsEnabled: !hp.testimonialsEnabled })} label="Testimonies Section" />
            <Toggle on={hp.scheduleEnabled} onToggle={() => setHp({ ...hp, scheduleEnabled: !hp.scheduleEnabled })} label="Service Schedule Section" />
            <Toggle on={hp.prayerRequestEnabled} onToggle={() => setHp({ ...hp, prayerRequestEnabled: !hp.prayerRequestEnabled })} label="Prayer Request Section" />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
        {saved && <span style={{ color: "#4ade80", fontSize: 13 }}>✅ Changes saved successfully!</span>}
        <Btn onClick={save}>💾 Save Homepage Settings</Btn>
      </div>
    </div>
  );
}

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────
function UserManagement() {
  const [users, setUsers] = useState(INIT_USERS);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "user", status: "active", country: "" });

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ name: "", email: "", role: "user", status: "active", country: "" }); setModal(true); };
  const openEdit = u => { setEditing(u.id); setForm({ ...u }); setModal(true); };
  const save = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing ? { ...u, ...form } : u));
    } else {
      setUsers(prev => [...prev, { ...form, id: Date.now(), joined: new Date().toISOString().split("T")[0] }]);
    }
    setModal(false);
  };
  const del = id => setUsers(prev => prev.filter(u => u.id !== id));
  const toggleStatus = id => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));

  const roleColor = r => r === "super_admin" ? "red" : r === "admin" ? "gold" : r === "moderator" ? "blue" : "gray";

  return (
    <div className="fade-in">
      <SectionHeader
        title="User Management"
        subtitle={`${users.length} registered users`}
        action={<Btn onClick={openAdd}>➕ Add User</Btn>}
      />
      <div style={{ marginBottom: 18 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search users by name or email..." className="admin-input" style={{ maxWidth: 380 }} />
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["User", "Role", "Country", "Joined", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="table-row" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#C9A227,#E8C547)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#0A1628" }}>{u.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}><Badge color={roleColor(u.role)}>{u.role.replace("_", " ").toUpperCase()}</Badge></td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{u.country}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{u.joined}</td>
                <td style={{ padding: "14px 16px" }}>
                  <Badge color={u.status === "active" ? "green" : "red"}>{u.status.toUpperCase()}</Badge>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="dark" onClick={() => openEdit(u)}>✏️</Btn>
                    <Btn size="sm" variant={u.status === "active" ? "danger" : "success"} onClick={() => toggleStatus(u.id)}>{u.status === "active" ? "🚫" : "✅"}</Btn>
                    <Btn size="sm" variant="danger" onClick={() => del(u.id)}>🗑</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit User" : "Add New User"}>
        <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Full name" required />
        <Input label="Email Address" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="user@example.com" required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} options={[{ value: "user", label: "User" }, { value: "moderator", label: "Moderator" }, { value: "admin", label: "Admin" }, { value: "super_admin", label: "Super Admin" }]} />
          <Select label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[{ value: "active", label: "Active" }, { value: "suspended", label: "Suspended" }]} />
        </div>
        <Input label="Country" value={form.country} onChange={v => setForm({ ...form, country: v })} placeholder="e.g. Ghana" />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>{editing ? "💾 Save Changes" : "➕ Add User"}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── TESTIMONY MODERATION ─────────────────────────────────────────────────────
function TestimonyModeration() {
  const [items, setItems] = useState(INIT_TESTIMONIES);
  const [filter, setFilter] = useState("all");

  const approve = id => setItems(prev => prev.map(t => t.id === id ? { ...t, status: "approved" } : t));
  const reject = id => setItems(prev => prev.map(t => t.id === id ? { ...t, status: "rejected" } : t));
  const del = id => setItems(prev => prev.filter(t => t.id !== id));

  const filtered = filter === "all" ? items : items.filter(t => t.status === filter);
  const pending = items.filter(t => t.status === "pending").length;

  return (
    <div className="fade-in">
      <SectionHeader
        title="Testimony Moderation"
        subtitle="Review and approve submitted testimonies"
        action={pending > 0 ? <Badge color="orange">⚠️ {pending} Pending</Badge> : null}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} className={`day-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>{f} ({items.filter(t => f === "all" || t.status === f).length})</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ background: CARD, border: `1px solid ${t.status === "pending" ? "rgba(251,146,60,0.3)" : t.status === "approved" ? "rgba(34,197,94,0.2)" : BORDER}`, borderRadius: 14, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 2 }}>{t.name} <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: 12 }}>· {t.location}</span></div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge color="gold">{t.tag}</Badge>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{t.date}</span>
                </div>
              </div>
              <Badge color={t.status === "approved" ? "green" : t.status === "pending" ? "orange" : "red"}>{t.status.toUpperCase()}</Badge>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, fontStyle: "italic", marginBottom: 16 }}>"{t.text}"</p>
            <div style={{ display: "flex", gap: 8 }}>
              {t.status !== "approved" && <Btn size="sm" variant="success" onClick={() => approve(t.id)}>✅ Approve</Btn>}
              {t.status !== "rejected" && <Btn size="sm" variant="danger" onClick={() => reject(t.id)}>❌ Reject</Btn>}
              <Btn size="sm" variant="danger" onClick={() => del(t.id)}>🗑 Delete</Btn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No testimonies in this category</div>}
      </div>
    </div>
  );
}

// ─── PRAYER REQUEST MODERATION ────────────────────────────────────────────────
function PrayerRequestModeration() {
  const [requests, setRequests] = useState(INIT_PRAYERS);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", request: "", urgent: false, private: false });
  const [done, setDone] = useState(false);

  const markPrayed = id => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "prayed" } : r));
  const del = id => setRequests(prev => prev.filter(r => r.id !== id));
  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const pending = requests.filter(r => r.status === "pending").length;

  const submitRequest = () => {
    if (!form.request) return;
    setRequests(prev => [...prev, { ...form, id: Date.now(), date: new Date().toISOString().split("T")[0], status: "pending" }]);
    setDone(true);
  };

  return (
    <div className="fade-in">
      <SectionHeader
        title="Prayer Request Management"
        subtitle="Manage and respond to prayer requests"
        action={
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {pending > 0 && <Badge color="orange">⚠️ {pending} Pending</Badge>}
            <Btn onClick={() => { setModal(true); setDone(false); setForm({ name: "", email: "", request: "", urgent: false, private: false }); }}>🙏 Submit Request</Btn>
          </div>
        }
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "prayed"].map(f => (
          <button key={f} className={`day-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>{f} ({requests.filter(r => f === "all" || r.status === f).length})</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: CARD, border: `1px solid ${r.urgent ? "rgba(255,59,59,0.3)" : BORDER}`, borderRadius: 14, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>
                  {r.private ? "🔒 Anonymous" : r.name || "Anonymous"}
                  {r.email && <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12, marginLeft: 8 }}>{r.email}</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {r.urgent && <Badge color="red">🔴 URGENT</Badge>}
                  {r.private && <Badge color="gray">🔒 PRIVATE</Badge>}
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{r.date}</span>
                </div>
              </div>
              <Badge color={r.status === "prayed" ? "green" : "orange"}>{r.status === "prayed" ? "✅ PRAYED" : "⏳ PENDING"}</Badge>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>{r.request}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {r.status !== "prayed" && <Btn size="sm" variant="success" onClick={() => markPrayed(r.id)}>🙏 Mark as Prayed</Btn>}
              <Btn size="sm" variant="danger" onClick={() => del(r.id)}>🗑 Delete</Btn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No prayer requests in this category</div>}
      </div>

      {/* Public Prayer Request Form Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Submit a Prayer Request" width={600}>
        {!done ? (
          <div>
            <div style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>🙏 Submit your prayer request and our dedicated prayer team will intercede for you. No request is too big or too small for God.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Your Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Full name" />
              <Input label="Email (optional)" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="your@email.com" />
            </div>
            <Textarea label="Prayer Request" value={form.request} onChange={v => setForm({ ...form, request: v })} rows={5} placeholder="Share your prayer request here... God hears your heart and so do we." />
            <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                <input type="checkbox" checked={form.urgent} onChange={e => setForm({ ...form, urgent: e.target.checked })} style={{ accentColor: GOLD }} />
                🔴 Urgent Prayer
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                <input type="checkbox" checked={form.private} onChange={e => setForm({ ...form, private: e.target.checked })} style={{ accentColor: GOLD }} />
                🔒 Keep Private
              </label>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn onClick={submitRequest}>🙏 Submit Prayer Request</Btn>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🕊️</div>
            <h3 className="serif" style={{ fontSize: 26, color: "#fff", marginBottom: 10, fontWeight: 700 }}>Your Prayer is Received</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>"The effective, fervent prayer of a righteous man avails much."</p>
            <p style={{ color: GOLD, fontStyle: "italic", fontSize: 13, marginBottom: 24 }}>— James 5:16</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn variant="ghost" onClick={() => { setDone(false); setForm({ name: "", email: "", request: "", urgent: false, private: false }); }}>Submit Another</Btn>
              <Btn onClick={() => setModal(false)}>Close</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── NOTIFICATION MANAGEMENT ──────────────────────────────────────────────────
function NotificationManagement() {
  const [notifs, setNotifs] = useState(INIT_NOTIFICATIONS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "general", audience: "all", scheduled: "" });

  const send = () => {
    if (!form.title || !form.message) return;
    setNotifs(prev => [...prev, { ...form, id: Date.now(), sent: new Date().toISOString(), status: "sent" }]);
    setModal(false);
  };
  const del = id => setNotifs(prev => prev.filter(n => n.id !== id));

  const typeColor = t => t === "live" ? "red" : t === "audio" ? "gold" : t === "event" ? "blue" : "gray";

  return (
    <div className="fade-in">
      <SectionHeader
        title="Notification Management"
        subtitle="Send push notifications and announcements to users"
        action={<Btn onClick={() => { setForm({ title: "", message: "", type: "general", audience: "all", scheduled: "" }); setModal(true); }}>📣 Send Notification</Btn>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[["📣", "Total Sent", notifs.filter(n => n.status === "sent").length], ["⏳", "Scheduled", notifs.filter(n => n.status === "scheduled").length], ["👥", "Audience Reach", "12,400+"]].map(([icon, label, val]) => (
          <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 26 }}>{icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{val}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifs.map(n => (
          <div key={n.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{n.title}</div>
                <Badge color={typeColor(n.type)}>{n.type.toUpperCase()}</Badge>
                <Badge color={n.status === "sent" ? "green" : "orange"}>{n.status.toUpperCase()}</Badge>
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 4 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>👥 {n.audience} · {n.sent ? new Date(n.sent).toLocaleString() : "Scheduled"}</div>
            </div>
            <Btn size="sm" variant="danger" onClick={() => del(n.id)} style={{ marginLeft: 16 }}>🗑</Btn>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Send Notification">
        <Input label="Notification Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="e.g. Live Service Starting Now" required />
        <Textarea label="Message" value={form.message} onChange={v => setForm({ ...form, message: v })} rows={3} placeholder="Notification message..." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={[{ value: "general", label: "General" }, { value: "live", label: "Live Service" }, { value: "audio", label: "New Audio" }, { value: "event", label: "Event" }]} />
          <Select label="Audience" value={form.audience} onChange={v => setForm({ ...form, audience: v })} options={[{ value: "all", label: "All Users" }, { value: "subscribers", label: "Subscribers Only" }, { value: "prayer_warriors", label: "Prayer Warriors" }]} />
        </div>
        <Input label="Schedule (optional)" value={form.scheduled} onChange={v => setForm({ ...form, scheduled: v })} type="datetime-local" />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={send}>📣 Send Now</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── BLOG / NEWS MANAGEMENT ───────────────────────────────────────────────────
function BlogManagement() {
  const [posts, setPosts] = useState(INIT_BLOGS);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Prayer", author: "Rev Emmanuel Oduro Cosby", excerpt: "", content: "", status: "draft" });

  const cats = ["Prayer", "Teaching", "Devotional", "Testimony", "News", "Announcement"];

  const openAdd = () => { setEditing(null); setForm({ title: "", category: "Prayer", author: "Rev Emmanuel Oduro Cosby", excerpt: "", content: "", status: "draft" }); setModal(true); };
  const openEdit = p => { setEditing(p.id); setForm({ ...p }); setModal(true); };
  const save = () => {
    if (!form.title) return;
    if (editing) {
      setPosts(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p));
    } else {
      setPosts(prev => [...prev, { ...form, id: Date.now(), date: new Date().toISOString().split("T")[0], views: 0 }]);
    }
    setModal(false);
  };
  const del = id => setPosts(prev => prev.filter(p => p.id !== id));
  const togglePublish = id => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p));

  return (
    <div className="fade-in">
      <SectionHeader
        title="Blog & News Management"
        subtitle={`${posts.length} posts · ${posts.filter(p => p.status === "published").length} published`}
        action={<Btn onClick={openAdd}>✍️ New Post</Btn>}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{p.title}</div>
                <Badge color={p.status === "published" ? "green" : "gray"}>{p.status.toUpperCase()}</Badge>
                <Badge>{p.category}</Badge>
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 4 }}>{p.excerpt}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>✍️ {p.author} · 📅 {p.date} · 👁 {p.views.toLocaleString()} views</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
              <Btn size="sm" variant={p.status === "published" ? "dark" : "success"} onClick={() => togglePublish(p.id)}>{p.status === "published" ? "📥 Unpublish" : "🚀 Publish"}</Btn>
              <Btn size="sm" variant="dark" onClick={() => openEdit(p)}>✏️</Btn>
              <Btn size="sm" variant="danger" onClick={() => del(p.id)}>🗑</Btn>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Post" : "New Blog Post"} width={640}>
        <Input label="Post Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Post title" required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })} options={cats} />
          <Select label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
        </div>
        <Input label="Author" value={form.author} onChange={v => setForm({ ...form, author: v })} placeholder="Author name" />
        <Textarea label="Excerpt / Summary" value={form.excerpt} onChange={v => setForm({ ...form, excerpt: v })} rows={2} placeholder="Brief summary of the post..." />
        <Textarea label="Content" value={form.content} onChange={v => setForm({ ...form, content: v })} rows={6} placeholder="Full post content..." />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>{editing ? "💾 Save Changes" : "✍️ Create Post"}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "analytics", icon: "📊", label: "Analytics", roles: ["super_admin", "admin", "moderator"] },
  { id: "audio", icon: "🎧", label: "Audio Management", roles: ["super_admin", "admin"] },
  { id: "video", icon: "📺", label: "Video & Livestream", roles: ["super_admin", "admin"] },
  { id: "homepage", icon: "🏠", label: "Homepage", roles: ["super_admin", "admin"] },
  { id: "users", icon: "👥", label: "User Management", roles: ["super_admin", "admin"] },
  { id: "testimonies", icon: "✨", label: "Testimonies", roles: ["super_admin", "admin", "moderator"] },
  { id: "prayers", icon: "🙏", label: "Prayer Requests", roles: ["super_admin", "admin", "moderator"] },
  { id: "notifications", icon: "📣", label: "Notifications", roles: ["super_admin", "admin"] },
  { id: "blog", icon: "✍️", label: "Blog & News", roles: ["super_admin", "admin", "moderator"] },
];

function Sidebar({ active, setActive, user, onLogout }) {
  const allowed = NAV_ITEMS.filter(n => n.roles.includes(user.role));
  return (
    <aside style={{ width: 240, background: "#0d1117", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#C9A227,#F5D785)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#0A1628", fontFamily: "Cormorant Garamond,Georgia,serif", flexShrink: 0 }}>CP</div>
          <div>
            <div className="serif" style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Charis Prayer</div>
            <div style={{ fontSize: 9, color: GOLD, letterSpacing: 2, marginTop: 3, textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 2, textTransform: "uppercase", padding: "0 8px", marginBottom: 10 }}>Navigation</div>
        {allowed.map(n => (
          <button key={n.id} className={`sidebar-item ${active === n.id ? "active" : ""}`} onClick={() => setActive(n.id)}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 12px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#C9A227,#E8C547)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0A1628", flexShrink: 0 }}>{user.name[0]}</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name.split(" ")[0]}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.5 }}>{user.role.replace("_", " ")}</div>
          </div>
        </div>
        <button className="sidebar-item" onClick={onLogout} style={{ color: "#ff6b6b" }}>
          <span>🚪</span><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ section, user }) {
  const item = NAV_ITEMS.find(n => n.id === section);
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(t); }, []);

  return (
    <div style={{ height: 64, background: "#0d1117", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{item?.icon}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{item?.label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.25)", borderRadius: 8, padding: "6px 12px" }}>
          <div className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff3b3b" }} />
          <span style={{ fontSize: 11, color: "#ff6b6b", fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C9A227,#E8C547)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{user.name[0]}</div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{user.name.split(" ")[0]}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN APP ───────────────────────────────────────────────────────────
export default function AdminDashboard({ user, onLogout }) {
  const [section, setSection] = useState("analytics");

  const renderSection = () => {
    switch (section) {
      case "analytics": return <Analytics />;
      case "audio": return <AudioManagement />;
      case "video": return <VideoManagement />;
      case "homepage": return <HomepageManagement />;
      case "users": return <UserManagement />;
      case "testimonies": return <TestimonyModeration />;
      case "prayers": return <PrayerRequestModeration />;
      case "notifications": return <NotificationManagement />;
      case "blog": return <BlogManagement />;
      default: return <Analytics />;
    }
  };

  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: DARK }}>
        <Sidebar active={section} setActive={setSection} user={user} onLogout={onLogout} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Topbar section={section} user={user} />
          <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
            {renderSection()}
          </main>
        </div>
      </div>
    </>
  );
}
