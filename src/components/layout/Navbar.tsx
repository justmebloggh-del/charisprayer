'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const YtIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.1 2.8 12 2.8 12 2.8s-4.1 0-6.8.2C4.6 3 3.3 3 2.2 4.2 1.3 5 1 7 1 7S.7 9.2.7 11.5v2.1C.7 16 1 18.2 1 18.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.6 22.4 12 22.5 12 22.5s4.1 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5v-2.1C23.3 9.2 23 7 23 7zM9.7 15.5V8.3l8.1 3.6-8.1 3.6z"/>
  </svg>
)
const FbIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const IgIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/prayer-request', label: 'Prayer' },
  { href: '/devotion', label: 'Devotion' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        transition: 'background 0.3s ease, border-color 0.3s ease',
        ...(scrolled
          ? { background: 'rgba(11,17,32,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }
          : { background: 'transparent', borderBottom: '1px solid transparent' }),
      }}>
        <nav className="site-container" style={{ display: 'flex', alignItems: 'center', height: '66px', gap: '1.5rem' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-gold)', flexShrink: 0 }}>
              <Image src="/charislogo.jpg" alt="CHARIS PRAYER TIME" width={34} height={34} priority style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
              CHARIS PRAYER TIME
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', marginLeft: 'auto' }} className="desktop-nav">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                prefetch={true}
                style={{
                  padding: '0.4rem 0.875rem',
                  borderRadius: 'var(--r-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'color 0.15s ease, background 0.15s ease',
                  color: isActive(l.href) ? 'var(--gold-light)' : 'var(--text-2)',
                  background: isActive(l.href) ? 'var(--gold-muted)' : 'transparent',
                }}
                className="nav-link"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: social + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginLeft: '0.5rem' }} className="desktop-nav">
            <span className="badge badge-live" style={{ fontSize: '0.5625rem' }}>LIVE</span>

            <a href="https://youtube.com/@charisprayer" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-3)', transition: 'color 0.15s', display: 'flex' }}
              className="social-yt" aria-label="YouTube"
            >
              <YtIcon />
            </a>
            <a href="https://facebook.com/charisprayer" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-3)', transition: 'color 0.15s', display: 'flex' }}
              className="social-fb" aria-label="Facebook"
            >
              <FbIcon />
            </a>

            <Link href="/prayer-request" className="btn btn-gold btn-sm" prefetch={true}>Submit Prayer</Link>
            <Link href="/login" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-3)', transition: 'color 0.15s' }} className="admin-link" prefetch={false}>
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '6px', marginLeft: 'auto', display: 'none' }}
            className="mobile-menu-btn"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 49,
              background: 'var(--surface)',
              display: 'flex', flexDirection: 'column',
              paddingTop: '76px',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '8px' }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <nav style={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem', gap: '0.25rem' }}>
              {navLinks.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.055 }}>
                  <Link
                    href={l.href}
                    prefetch={true}
                    style={{
                      display: 'block',
                      padding: '0.9375rem 1.25rem',
                      borderRadius: 'var(--r)',
                      fontSize: '1.25rem',
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      color: isActive(l.href) ? 'var(--gold-light)' : 'var(--text)',
                      background: isActive(l.href) ? 'var(--gold-muted)' : 'transparent',
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 1.25rem' }}
              >
                <Link href="/prayer-request" className="btn btn-gold" style={{ justifyContent: 'center' }} prefetch={true}>Submit Prayer Request</Link>
                <Link href="/login" className="btn btn-ghost" style={{ justifyContent: 'center' }} prefetch={false}>Admin Login</Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
                style={{ display: 'flex', gap: '1.5rem', padding: '2rem 1.25rem 0', alignItems: 'center' }}
              >
                <a href="https://youtube.com/@charisprayer" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)' }} aria-label="YouTube"><YtIcon /></a>
                <a href="https://facebook.com/charisprayer" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)' }} aria-label="Facebook"><FbIcon /></a>
                <a href="https://instagram.com/charisprayer" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)' }} aria-label="Instagram"><IgIcon /></a>
                <a href="https://wa.me/message/charisprayer" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)', fontSize: '0.8125rem', fontWeight: 500 }}>WhatsApp</a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 820px) {
          .mobile-menu-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
        .nav-link:hover { color: var(--text) !important; }
        .social-yt:hover { color: #EF4444 !important; }
        .social-fb:hover { color: #3B82F6 !important; }
        .admin-link:hover { color: var(--text) !important; }
      `}</style>
    </>
  )
}
