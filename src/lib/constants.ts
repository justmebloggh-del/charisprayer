export const SITE_NAME = "Charis Prayer";
export const SITE_TAGLINE = "Where Grace Meets Prayer";
export const FOUNDER_NAME = "Rev Emmanuel Oduro Cosby";
export const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VaDoopf6xCSYcdwSu41r";
export const YOUTUBE_CHANNEL = "https://youtube.com/@charisprayer";
// YouTube Channel ID — used for live-stream embed in the Hero player
// Replace with your real channel ID (UCxxxxxxxxxxxxxxxxxxxxxxxx) when available
// Example: "UCxxxxxxxxxxxxxxxxxxxxxx" - get this from YouTube Studio
export const YOUTUBE_CHANNEL_ID = ""; // Add your channel ID here for live streaming
// Fallback video ID shown when no live stream / channel ID is set
// Using a popular Christian worship/prayer video that embeds well
export const YOUTUBE_FALLBACK_VIDEO_ID = "v-PjgYDrg70"; // "How Great Thou Art" - popular worship song
export const PRAYER_TIME = "5:00 AM";

export const PRAYER_CATEGORIES = [
  "All", "Breakthrough", "Healing", "Warfare", "Blessing",
  "Deliverance", "Worship", "Intercession", "Thanksgiving", "Faith",
];

export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export const SOCIAL_LINKS = [
  { name: "YouTube",        href: "https://youtube.com/@charisprayer",                icon: "youtube",   color: "#FF0000" },
  { name: "Facebook",       href: "https://facebook.com/charisprayer",                icon: "facebook",  color: "#1877F2" },
  { name: "Instagram",      href: "https://instagram.com/charisprayer",               icon: "instagram", color: "#E1306C" },
  { name: "TikTok",         href: "https://tiktok.com/@charisprayer",                 icon: "tiktok",    color: "#000000" },
  { name: "WhatsApp",       href: WHATSAPP_CHANNEL,                                   icon: "whatsapp",  color: "#25D366" },
  { name: "Telegram",       href: "https://t.me/charisprayer",                        icon: "telegram",  color: "#0088CC" },
  { name: "X (Twitter)",    href: "https://x.com/charisprayer",                       icon: "twitter",   color: "#000000" },
  { name: "Spotify",        href: "https://open.spotify.com/show/charisprayer",       icon: "spotify",   color: "#1DB954" },
  { name: "Apple Podcasts", href: "https://podcasts.apple.com/charisprayer",          icon: "podcast",   color: "#9933CC" },
];

export const WEEKLY_SCHEDULE = [
  { day: "Mon–Fri", time: "5:00 AM",  name: "Morning Breakthrough Prayer",  platform: "YouTube Live",          icon: "🌅", type: "Daily" },
  { day: "Mon–Fri", time: "12:00 AM", name: "Midnight Warfare Prayer Watch", platform: "YouTube Live",          icon: "🌙", type: "Daily" },
  { day: "Sunday",  time: "9:00 AM",  name: "Sunday Worship Service",        platform: "YouTube + Facebook",    icon: "✝️", type: "Weekly" },
  { day: "Wednesday", time: "7:00 PM", name: "Bible Study & Prayer",         platform: "YouTube Live",          icon: "📖", type: "Midweek" },
  { day: "First Friday", time: "10:00 PM", name: "21-Day Prayer Marathon",   platform: "YouTube + Telegram",    icon: "🔥", type: "Monthly" },
  { day: "Last Sunday",  time: "8:00 PM",  name: "Special Intercession Night", platform: "All Platforms",      icon: "🙏", type: "Monthly" },
];

export const SAMPLE_AUDIOS = [
  { id: "1", title: "Morning Prayer of Breakthrough",    category: "Breakthrough", scripture: "Psalm 18:2",    duration: "28:45", plays: 1240, featured: true,  day: "Monday",    emoji: "🌅" },
  { id: "2", title: "Divine Healing Prayer",             category: "Healing",      scripture: "James 5:15",    duration: "22:10", plays: 980,  featured: false, day: "Tuesday",   emoji: "✨" },
  { id: "3", title: "Midnight Warfare Prayer Watch",     category: "Warfare",      scripture: "Isaiah 62:6",   duration: "45:00", plays: 2100, featured: false, day: "Wednesday", emoji: "🌙" },
  { id: "4", title: "Prayer for Financial Blessing",     category: "Blessing",     scripture: "Deut 28:8",     duration: "31:20", plays: 1560, featured: false, day: "Thursday",  emoji: "🌟" },
  { id: "5", title: "Prayer of Deliverance",             category: "Deliverance",  scripture: "Psalm 91:15",   duration: "38:15", plays: 890,  featured: false, day: "Friday",    emoji: "🕊️" },
  { id: "6", title: "Sunday Morning Worship Prayer",     category: "Worship",      scripture: "Psalm 100:4",   duration: "52:00", plays: 3200, featured: true,  day: "Sunday",    emoji: "🙌" },
  { id: "7", title: "Prayer of Faith & Restoration",    category: "Faith",        scripture: "Hebrews 11:1",  duration: "34:00", plays: 1100, featured: false, day: "Saturday",  emoji: "🔥" },
];

export const SAMPLE_TESTIMONIES = [
  { id: "1", name: "Sarah M.",        location: "London, UK",    tag: "Miraculous Healing",    quote: "After three years battling chronic illness, God healed me completely through the healing prayer session. I am walking in total freedom today!", date: "2 days ago",  approved: true },
  { id: "2", name: "Pastor James K.", location: "Accra, Ghana",  tag: "Business Breakthrough", quote: "I joined the midnight prayer watch for 21 days. On the 22nd day, a business deal worth $500,000 came through. God is faithful!", date: "1 week ago",  approved: true },
  { id: "3", name: "Grace A.",        location: "Houston, TX",   tag: "Family Restoration",    quote: "My marriage was on the verge of collapse. After submitting a prayer request, God brought complete restoration. We are stronger than ever.", date: "2 weeks ago", approved: true },
];
