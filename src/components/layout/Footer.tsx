import Link from "next/link";
import { CharisLogo } from "@/components/ui/CharisLogo";
import { WHATSAPP_CHANNEL, FOUNDER_NAME } from "@/lib/constants";

const FOOTER_COLS = [
  {
    title: "Ministry",
    links: [
      { label: "Home",              href: "/" },
      { label: "Daily Prayers",     href: "/prayers" },
      { label: "Live Services",     href: "/church" },
      { label: "Testimonies",       href: "/testimonies" },
      { label: "Prayer Requests",   href: "/prayer-request" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Audio Library",     href: "/prayers" },
      { label: "Blog & News",       href: "/blog" },
      { label: "About Us",          href: "/about" },
      { label: "Contact Us",        href: "/contact" },
      { label: "Partner With Us",   href: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "WhatsApp Channel",  href: WHATSAPP_CHANNEL },
      { label: "YouTube",           href: "https://youtube.com/@charisprayer" },
      { label: "Facebook",          href: "https://facebook.com/charisprayer" },
      { label: "Instagram",         href: "https://instagram.com/charisprayer" },
      { label: "Telegram",          href: "https://t.me/charisprayer" },
    ],
  },
];

type SocialLink = { name: string; href: string; icon: React.ReactNode };

const SOCIAL_ICONS: SocialLink[] = [
  {
    name: "YouTube",
    href: "https://youtube.com/@charisprayer",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/charisprayer",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/charisprayer",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: WHATSAPP_CHANNEL,
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/charisprayer",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/charisprayer",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#04090f] text-white">
      {/* ── Newsletter Banner ── */}
      <div className="border-b border-white/5">
        <div className="page-container py-12 sm:py-14">
          <div className="bg-white/3 border border-amber-500/20 rounded-2xl px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white mb-1.5 leading-tight">
                Stay Connected. Never Miss a Session.
              </h3>
              <p className="text-white/45 text-sm font-light">
                Devotionals, prayer alerts &amp; ministry updates — delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-56 bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-amber-400/50 transition-all"
              />
              <button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold px-5 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex-shrink-0 shadow-md shadow-amber-400/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="page-container pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <CharisLogo size={44} animated={false} textColor="white" className="mb-5" />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-light mb-7">
              A global digital prayer ministry dedicated to igniting prayer movements and transforming lives through daily encounters with God&apos;s presence.
            </p>

            {/* Contact info */}
            <ul className="space-y-2 text-sm text-white/40 mb-7">
              <li>📧 prayer@charisprayer.org</li>
              <li>📞 +1 (800) CHARIS-1</li>
              <li>🕐 Morning Prayer: 5:00 AM Daily</li>
            </ul>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2">
              {SOCIAL_ICONS.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 text-white/40 flex items-center justify-center hover:border-amber-400/40 hover:text-amber-400 hover:bg-amber-400/8 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <h4 className="text-amber-400 text-[10px] font-bold tracking-[3px] uppercase mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-white/40 text-sm font-light hover:text-white/85 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Scripture divider ── */}
        <div className="flex items-center gap-5 mb-8">
          <div className="flex-1 h-px bg-white/8" />
          <p className="text-white/30 text-xs italic text-center max-w-sm leading-relaxed font-light flex-shrink-0">
            &ldquo;If my people, who are called by my name, will humble themselves and pray…&rdquo;
            <span className="block mt-0.5 not-italic text-white/20">— 2 Chronicles 7:14</span>
          </p>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-white/25 text-xs">
          <div>© {new Date().getFullYear()} Charis Prayer Ministry. All rights reserved.</div>
          <div className="flex items-center gap-1">
            Built with <span className="text-amber-400/60">🙏</span> for God&apos;s Kingdom · {FOUNDER_NAME}
          </div>
        </div>
      </div>
    </footer>
  );
}
