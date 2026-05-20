'use client'

import { useState, useEffect } from 'react'
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

function LivePlaceholder({ channelId, thumbnailUrl }: { channelId?: string | null; thumbnailUrl?: string | null }) {
  const [playing, setPlaying] = useState(false)

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
      position: 'relative',
      background: 'linear-gradient(135deg, #18181F 0%, #09090B 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.25rem', padding: '2.5rem 2rem', textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* Background thumbnail */}
      {thumbnailUrl && (
        <>
          <img
            src={thumbnailUrl}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 100%)' }} />
        </>
      )}
      {/* All content above the overlay */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>

        {/* Animated radio icon — hide when thumbnail fills the bg */}
        {!thumbnailUrl && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gold-muted)', animation: 'live-pulse 2s ease-in-out infinite' }} />
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <Radio size={26} style={{ color: 'var(--gold)' }} />
            </div>
          </div>
        )}

        <div>
          <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: 'clamp(1rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#fff', marginBottom: '0.375rem', textShadow: thumbnailUrl ? '0 1px 6px rgba(0,0,0,0.8)' : 'none' }}>
            Charis Prayer Time · 5AM–6AM BST (GMT+1)
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>Monday · Wednesday · Thursday</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['MON', 'WED', 'THU'] as const).map(d => (
            <div key={d} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: '2px' }}>{d}</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>5:00 AM</p>
            </div>
          ))}
        </div>

        <a
          href="https://whatsapp.com/channel/0029VaDoopf6xCSYcdwSu41r"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Follow our WhatsApp channel
        </a>

        {!thumbnailUrl && (
          <blockquote style={{
            fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
            fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-3)',
            lineHeight: 1.7, maxWidth: '300px',
            borderTop: '1px solid var(--border)', paddingTop: '1rem', width: '100%',
          }}>
            &ldquo;The effectual fervent prayer of a righteous man availeth much.&rdquo;
            <span style={{ display: 'block', fontStyle: 'normal', fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.375rem' }}>— James 5:16</span>
          </blockquote>
        )}

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
    </div>
  )
}

export default function Hero() {
  const [livestream, setLivestream] = useState<LivestreamSettings | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { createPublicClient } = await import('@/utils/supabase/public')
        const { data } = await createPublicClient()
          .from('livestream_settings').select('*').eq('id', 1).single()
        if (data) setLivestream(data as LivestreamSettings)
      } catch {}
    })()
  }, [])

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
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>Charis Prayer Time · 5AM–6AM BST</span>
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
                : <LivePlaceholder channelId={livestream?.channel_id} thumbnailUrl={livestream?.thumbnail_url} />
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
