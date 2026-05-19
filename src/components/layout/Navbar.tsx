"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CharisLogo } from "@/components/ui/CharisLogo";
import { WHATSAPP_CHANNEL, YOUTUBE_CHANNEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",            label: "Home" },
  { href: "/prayers",     label: "Prayers" },
  { href: "/church",      label: "Church" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/blog",        label: "Blog" },
  { href: "/about",       label: "About" },
  { href: "/contact",     label: "Contact" },
];

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent"
          : "bg-white backdrop-blur-2xl border-b border-gray-100 shadow-[0_2px_32px_rgba(0,0,0,0.07)]"
      )}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10" onClick={() => setMobileOpen(false)}>
              <CharisLogo size={40} animated textColor={transparent ? "white" : "dark"} />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-all duration-200",
                      transparent
                        ? active ? "text-amber-400" : "text-white/75 hover:text-white"
                        : active ? "text-amber-600" : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-400/25">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red" />
                <span className={cn("text-[11px] font-bold tracking-wider", transparent ? "text-red-400" : "text-red-500")}>LIVE · 5AM</span>
              </div>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-green-200/40 hover:shadow-green-200/60 hover:-translate-y-0.5"
              >
                {WA_ICON}
                <span>Join Channel</span>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={cn(
                "lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors z-10",
                transparent ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <CharisLogo size={36} animated={false} textColor="dark" />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {NAV_LINKS.map(({ href, label }, i) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    style={{ animationDelay: `${i * 50}ms` }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 animate-fade-in-up opacity-0",
                      active
                        ? "bg-amber-50 text-amber-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />}
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer actions */}
            <div className="px-5 py-6 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-red flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-red-600 tracking-wider">LIVE DAILY</div>
                  <div className="text-[11px] text-red-400 font-medium">Morning Prayer · 5:00 AM</div>
                </div>
              </div>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                {WA_ICON}
                Join WhatsApp Channel
              </a>
              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Page spacer for non-home pages */}
      {!isHome && <div className="h-16 lg:h-20" />}
    </>
  );
}
