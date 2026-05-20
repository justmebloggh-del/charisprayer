'use client'

import Link from 'next/link'
import Image from 'next/image'

const YtIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.1 2.8 12 2.8 12 2.8s-4.1 0-6.8.2C4.6 3 3.3 3 2.2 4.2 1.3 5 1 7 1 7S.7 9.2.7 11.5v2.1C.7 16 1 18.2 1 18.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.6 22.4 12 22.5 12 22.5s4.1 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5v-2.1C23.3 9.2 23 7 23 7zM9.7 15.5V8.3l8.1 3.6-8.1 3.6z"/>
  </svg>
)
const FbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="site-container" style={{ paddingBlock: 'clamp(3rem,6vw,5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>

          {/* Brand col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-gold)', flexShrink: 0 }}>
                <Image src="/charislogo.jpg" alt="Charis Prayer" width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text)' }}>
                Charis Prayer
              </span>
            </Link>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '280px' }}>
              A global prayer ministry led by Rev. Emmanuel Oduro Cosby, dedicated to intercession, worship, and faith.
            </p>

            <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '0.875rem', fontStyle: 'italic', fontSize: '0.8125rem', color: 'var(--text-3)', lineHeight: 1.65 }}>
              "Where Grace Meets Prayer"
            </blockquote>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
              {[
                { href: 'https://youtube.com', Icon: YtIcon, hoverColor: '#EF4444' },
                { href: 'https://facebook.com', Icon: FbIcon, hoverColor: '#3B82F6' },
                { href: 'https://instagram.com', Icon: IgIcon, hoverColor: '#E1306C' },
              ].map(({ href, Icon, hoverColor }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--elevated)', color: 'var(--text-3)',
                    border: '1px solid var(--border)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = hoverColor
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = hoverColor
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-3)'
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--elevated)'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Ministry</p>
            {[
              { href: '/', label: 'Home' },
              { href: '/prayer-request', label: 'Submit Prayer' },
              { href: '/blog', label: 'Devotionals' },
              { href: '/login', label: 'Admin' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                style={{ fontSize: '0.875rem', color: 'var(--text-2)', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Scripture + newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Daily Word</p>
            <blockquote style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.75, fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>
              "The effective, fervent prayer of a righteous man avails much."
              <footer style={{ marginTop: '0.5rem', fontStyle: 'normal', fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>— James 5:16</footer>
            </blockquote>

            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', marginBottom: '0.75rem' }}>Get weekly devotionals in your inbox:</p>
              <form className="footer-newsletter-form" style={{ display: 'flex', gap: '0.5rem' }} onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-field"
                  style={{ flex: 1, height: '2.5rem', padding: '0 0.875rem', fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn-gold btn-sm" style={{ flexShrink: 0 }}>Join</button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '3rem', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} Charis Prayer Ministry. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
            Led by Rev. Emmanuel Oduro Cosby
          </p>
        </div>
      </div>
    </footer>
  )
}
