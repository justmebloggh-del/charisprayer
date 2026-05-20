'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Radio, Play } from 'lucide-react'
import YouTubePlayer from '@/components/ui/YouTubePlayer'
import type { LivestreamSettings } from '@/lib/types'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
})

// A URL is "real" only when it's been configured by the admin.
function isRealUrl(url?: string | null): boolean {
  if (!url) return false
  return !url.includes('UCxxxxxxxxxxxxxxxx') && url.trim().length > 10
}

function LivePlaceholder({ channelId }: { channelId?: string | null }) {
  const [playing, setPlaying] = useState(false)

  // Build an embeddable live-stream URL when channel ID is known
  const embedUrl = channelId
    ? `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&rel=0`
    : null

  if (playing && embedUrl) {
    return (
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
        <iframe
          src={embedUrl}
          title="Charis Prayer Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #18181F 0%, #09090B 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.25rem', padding: '2.5rem 2rem', textAlign: 'center',
    }}>
      {/* Animated radio icon */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gold-muted)', animation: 'live-pulse 2s ease-in-out infinite' }} />
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <Radio size={26} style={{ color: 'var(--gold)' }} />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: 'clamp(1rem, 2.5vw, 1.375rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>
          Daily Prayer · 6 AM WAT
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>Monday – Sunday, every morning</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {(['MON–FRI', 'SATURDAY', 'SUNDAY'] as const).map((d, i) => (
          <div key={d} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: '2px' }}>{d}</p>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)' }}>{i === 0 ? '6:00 AM' : i === 1 ? '8:00 AM' : '9:00 AM'}</p>
          </div>
        ))}
      </div>

      <blockquote style={{
        fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
        fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-3)',
        lineHeight: 1.7, maxWidth: '300px',
        borderTop: '1px solid var(--border)', paddingTop: '1rem', width: '100%',
      }}>
        &ldquo;The effectual fervent prayer of a righteous man availeth much.&rdquo;
        <span style={{ display: 'block', fontStyle: 'normal', fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.375rem' }}>— James 5:16</span>
      </blockquote>

      {embedUrl ? (
        <button
          onClick={() => setPlaying(true)}
          className="btn btn-gold btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Play size={14} fill="#000" /> Watch Live Now
        </button>
      ) : (
        <a href="#sermons" className="btn btn-gold btn-sm">
          Watch Sermons &amp; Messages
        </a>
      )}
    </div>
  )
}

interface Props { livestream?: LivestreamSettings | null }

export default function Hero({ livestream }: Props) {
  const liveUrl    = livestream?.youtube_url
  const replayUrl  = livestream?.replay_url
  const isLive     = livestream?.is_live ?? false
  const streamTitle = livestream?.title || 'Daily Prayer Broadcast'

  // Pick which URL to show: prefer live URL when is_live, else replay, else placeholder
  const activeUrl = isLive && isRealUrl(liveUrl) ? liveUrl!
                  : isRealUrl(replayUrl)          ? replayUrl!
                  : null

  const showEmbed = isRealUrl(activeUrl)

  return (
    <section style={{ background: 'var(--canvas)', position: 'relative', overflow: 'hidden', paddingBlock: 'clamp(4rem, 8vw, 6.5rem)' }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(600px, 80vw)', height: '280px', borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="site-container">
        <div className="hero-grid">

          {/* Left: Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.375rem' }}>
            <motion.div {...fadeUp(0)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isLive && isRealUrl(liveUrl)
                ? <span className="badge badge-live">LIVE NOW</span>
                : <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: 'var(--elevated)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>Watch &amp; Pray</span>
              }
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>Daily Prayer · 6 AM WAT</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.07)} className="t-display font-display" style={{ maxWidth: '520px' }}>
              Where{' '}
              <span className="gradient-gold-text">Grace</span>
              {' '}Meets Prayer
            </motion.h1>

            <motion.p {...fadeUp(0.14)} className="t-body" style={{ maxWidth: '420px' }}>
              Join Rev. Emmanuel Oduro Cosby and thousands of believers worldwide in daily prayer,
              worship, and the transforming power of God&apos;s Word.
            </motion.p>

            <motion.div {...fadeUp(0.21)} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.25rem' }}>
              <Link href="/prayer-request" className="btn btn-gold btn-lg">
                Submit a Prayer <ArrowRight size={17} />
              </Link>
              <Link href="/devotion" className="btn btn-ghost btn-lg">
                Daily Devotion
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.28)} style={{ display: 'flex', gap: '2rem', paddingTop: '1.375rem', borderTop: '1px solid var(--border)', marginTop: '0.25rem' }}>
              {[
                { value: '10K+', label: 'Prayers Answered' },
                { value: '5K+', label: 'Global Members' },
                { value: '7 Days', label: 'Weekly Sessions' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontWeight: 700, fontSize: 'clamp(1.2rem, 2.5vw, 1.625rem)', color: 'var(--gold-light)' }}>{s.value}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: embed or branded placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.12, ease }}
            style={{ position: 'relative' }}
          >
            {/* Gold border glow */}
            <div style={{
              position: 'absolute', inset: '-1px',
              borderRadius: 'calc(var(--r-xl) + 1px)',
              background: 'linear-gradient(135deg, rgba(201,162,39,0.3), transparent 50%, rgba(201,162,39,0.18))',
              zIndex: 0,
            }} />

            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: 'var(--r-xl)', overflow: 'hidden',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 16px 56px rgba(0,0,0,0.6)',
            }}>
              {isLive && isRealUrl(liveUrl) && (
                <div style={{
                  position: 'absolute', top: '0.875rem', left: '0.875rem', zIndex: 10,
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                  background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)',
                  padding: '0.3rem 0.7rem', borderRadius: '999px',
                  border: '1px solid rgba(239,68,68,0.3)', pointerEvents: 'none',
                }}>
                  <Radio size={10} style={{ color: '#EF4444' }} />
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '0.08em' }}>LIVE</span>
                </div>
              )}

              {showEmbed
                ? <YouTubePlayer url={activeUrl!} title={streamTitle} thumbnail={livestream?.thumbnail_url} rounded={false} />
                : <LivePlaceholder channelId={livestream?.channel_id} />
              }
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: clamp(280px, 48%, 520px) 1fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
