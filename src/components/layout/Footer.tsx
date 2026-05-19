"use client";
import Link from "next/link";
import { CharisLogo } from "@/components/ui/CharisLogo";
import { SOCIAL_LINKS, WHATSAPP_CHANNEL, FOUNDER_NAME } from "@/lib/constants";

const FOOTER_COLS = [
  { title: "Ministry",   links: [{ label: "Daily Prayers", href: "/prayers" }, { label: "Live Services", href: "/church" }, { label: "Testimonies", href: "/testimonies" }, { label: "Prayer Requests", href: "/prayer-request" }, { label: "About Us", href: "/about" }] },
  { title: "Resources",  links: [{ label: "Audio Library", href: "/prayers" }, { label: "Blog & News", href: "/blog" }, { label: "Contact Us", href: "/contact" }, { label: "Partner With Us", href: "/contact" }, { label: "Give / Donate", href: "/contact" }] },
  { title: "Connect",    links: [{ label: "WhatsApp Channel", href: WHATSAPP_CHANNEL }, { label: "YouTube", href: "https://youtube.com/@charisprayer" }, { label: "Facebook", href: "https://facebook.com/charisprayer" }, { label: "Instagram", href: "https://instagram.com/charisprayer" }, { label: "Telegram", href: "https://t.me/charisprayer" }] },
];

export function Footer() {
  return (
    <footer className="bg-[#040810] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <CharisLogo size={48} animated textColor="white" className="mb-5" />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-light mb-6">
              A global digital prayer ministry dedicated to igniting prayer movements and transforming lives through daily encounters with God's presence.
            </p>
            <div className="space-y-2 text-sm text-white/40">
              <div>📧 prayer@charisprayer.org</div>
              <div>📞 +1 (800) CHARIS-1</div>
              <div>🕐 Morning Prayer: 5:00 AM Daily</div>
            </div>
          </div>

          {/* Links */}
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <h4 className="text-amber-400 text-xs font-bold tracking-[3px] uppercase mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-white/40 text-sm font-light hover:text-white/90 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="border-t border-white/5 border-b border-white/5 py-7 mb-7">
          <div className="flex flex-wrap gap-2 justify-center">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/4 border border-white/8 text-white/50 text-xs font-medium hover:border-amber-400/40 hover:text-amber-400 transition-all duration-200"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-white/25 text-xs">
          <div>© {new Date().getFullYear()} Charis Prayer Ministry. All rights reserved.</div>
          <div>Built with 🙏 for God's Kingdom · {FOUNDER_NAME}</div>
        </div>
      </div>
    </footer>
  );
}
