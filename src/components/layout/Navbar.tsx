"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CharisLogo } from "@/components/ui/CharisLogo";
import { WHATSAPP_CHANNEL, YOUTUBE_CHANNEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",             label: "Home" },
  { href: "/prayers",      label: "Prayers" },
  { href: "/church",       label: "Church" },
  { href: "/testimonies",  label: "Testimonies" },
  { href: "/blog",         label: "Blog" },
  { href: "/about",        label: "About" },
  { href: "/contact",      label: "Contact" },
];

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const closeMobile  = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen(p => !p), []);

  const transparent = isHome && !scrolled;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-400",
          transparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" onClick={closeMobile} aria-label="Charis Prayer Home">
            <CharisLogo
              size={36}
              animated={false}
              textColor={transparent ? "white" : "dark"}
              className="h-9"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    transparent
                      ? active ? "text-amber-400" : "text-white/80 hover:text-white"
                      : active ? "text-amber-600" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-3 ml-auto flex-shrink-0">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-400/30 bg-red-500/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-red flex-shrink-0" />
              <span className={cn("text-[10px] font-black tracking-widest uppercase", transparent ? "text-red-400" : "text-red-500")}>
                Live
              </span>
            </div>

            {/* Donate */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] text-xs font-bold px-4 py-2 rounded-full hover:brightness-105 transition-all shadow-sm shadow-amber-200/50"
            >
              Give / Donate
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium px-3 py-2 rounded-lg transition-colors",
                transparent ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-800"
              )}
            >
              Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "ml-auto lg:hidden p-2 rounded-xl transition-colors",
              transparent ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[82vw] max-w-sm bg-[#0A1628] z-50 flex flex-col lg:hidden",
          "transition-transform duration-300 ease-out will-change-transform",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <CharisLogo size={34} animated={false} textColor="white" />
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                  active
                    ? "bg-amber-400/12 text-amber-400 border border-amber-400/20"
                    : "text-white/65 hover:text-white hover:bg-white/6"
                )}
              >
                {label}
                {active && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Social + CTAs */}
        <div className="px-5 py-6 border-t border-white/8 space-y-3">
          {/* Live pill */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-red" />
            <span className="text-red-400 text-xs font-black tracking-widest uppercase">Live Now · 5:00 AM Daily</span>
          </div>

          {/* Donate */}
          <Link
            href="/contact"
            onClick={closeMobile}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold py-3.5 rounded-2xl text-sm w-full hover:brightness-105 transition-all"
          >
            Give / Donate
          </Link>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-semibold py-3.5 rounded-2xl text-sm w-full hover:bg-[#25D366]/20 transition-colors"
          >
            {WA_SVG}
            Join WhatsApp Channel
          </a>
        </div>
      </div>
    </>
  );
}
