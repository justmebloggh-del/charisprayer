'use client'

import { useState } from 'react'
import { useAudio } from '@/context/AudioContext'
import { Play, Pause, Download, Music2, Clock } from 'lucide-react'
import type { Audio as AudioTrack } from '@/lib/types'

const CATEGORIES = ['All', 'Morning Prayer', 'Evening Prayer', 'Sunday Service', 'Intercession', 'Worship']

const FALLBACK: AudioTrack[] = [
  { id: '1', title: 'Power of the Morning Watch', category: 'Morning Prayer', duration: '42:18', file_url: '', day_of_week: 'Monday', featured: true, plays: 1240, downloads: 340, created_at: '', updated_at: '' },
  { id: '2', title: 'Interceding for the Nations', category: 'Intercession', duration: '38:05', file_url: '', day_of_week: 'Wednesday', featured: false, plays: 980, downloads: 210, created_at: '', updated_at: '' },
  { id: '3', title: 'Sunday Worship & Prayer', category: 'Sunday Service', duration: '1:12:44', file_url: '', day_of_week: 'Sunday', featured: true, plays: 2100, downloads: 560, created_at: '', updated_at: '' },
  { id: '4', title: 'Evening Devotion', category: 'Evening Prayer', duration: '28:33', file_url: '', day_of_week: 'Friday', featured: false, plays: 760, downloads: 145, created_at: '', updated_at: '' },
  { id: '5', title: 'Faith Declarations', category: 'Morning Prayer', duration: '22:10', file_url: '', day_of_week: 'Tuesday', featured: false, plays: 890, downloads: 198, created_at: '', updated_at: '' },
  { id: '6', title: 'Breakthrough Prayer', category: 'Intercession', duration: '45:00', file_url: '', day_of_week: 'Thursday', featured: false, plays: 1050, downloads: 280, created_at: '', updated_at: '' },
  { id: '7', title: 'Healing & Restoration', category: 'Evening Prayer', duration: '33:47', file_url: '', day_of_week: 'Saturday', featured: false, plays: 670, downloads: 120, created_at: '', updated_at: '' },
  { id: '8', title: 'Glory Worship', category: 'Worship', duration: '55:22', file_url: '', day_of_week: 'Sunday', featured: true, plays: 1890, downloads: 430, created_at: '', updated_at: '' },
]

function AudioCard({ track, queue }: { track: AudioTrack; queue: AudioTrack[] }) {
  const { currentTrack, isPlaying, play, togglePlay } = useAudio()
  const isActive = currentTrack?.id === track.id
  const isThisPlaying = isActive && isPlaying

  function handlePlay() {
    if (isActive) { togglePlay(); return }
    play(track, queue)
  }

  const categoryColors: Record<string, string> = {
    'Morning Prayer': '#F59E0B',
    'Evening Prayer': '#8B5CF6',
    'Sunday Service': '#3B82F6',
    'Intercession': '#EF4444',
    'Worship': '#EC4899',
    'All': 'var(--gold)',
  }
  const color = categoryColors[track.category] ?? 'var(--gold)'

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        cursor: 'pointer',
        borderColor: isActive ? 'var(--border-gold)' : undefined,
        boxShadow: isActive ? 'var(--shadow-gold)' : undefined,
        background: isActive ? 'rgba(201,162,39,0.04)' : undefined,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Cover art */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: 'var(--r-sm)', overflow: 'hidden', background: 'var(--surface)', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))` }}>
          {track.cover_url
            ? <img src={track.cover_url} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            : (
              <div style={{ textAlign: 'center' }}>
                <Music2 size={32} style={{ color, opacity: 0.6, marginBottom: '0.5rem' }} />
                <div style={{ width: '2px', height: '32px', background: `linear-gradient(${color}, transparent)`, margin: '0 auto' }} />
              </div>
            )
          }
        </div>

        {/* Play button overlay */}
        <button
          onClick={handlePlay}
          aria-label={isThisPlaying ? 'Pause' : 'Play'}
          style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isThisPlaying ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
            transition: 'background 0.2s ease',
            border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => { if (!isThisPlaying) (e.currentTarget.style.background = 'rgba(0,0,0,0.4)') }}
          onMouseLeave={e => { if (!isThisPlaying) (e.currentTarget.style.background = 'rgba(0,0,0,0)') }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: isThisPlaying ? 'var(--gold)' : 'rgba(201,162,39,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            transform: isThisPlaying ? 'scale(1)' : 'scale(0.85)',
            transition: 'transform 0.2s ease',
          }}>
            {isThisPlaying
              ? <Pause size={20} fill="#000" color="#000" />
              : <Play size={20} fill="#000" color="#000" style={{ marginLeft: '3px' }} />
            }
          </div>
        </button>

        {/* Waveform when playing */}
        {isThisPlaying && (
          <div className="waveform" style={{ position: 'absolute', bottom: '0.625rem', left: '0.625rem', height: '20px' }}>
            {[14, 20, 12, 18, 16, 22, 10].map((h, i) => (
              <div key={i} className="waveform-bar" style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{track.category}</span>
          {track.featured && <span className="badge badge-gold" style={{ fontSize: '0.5625rem' }}>Featured</span>}
        </div>
        <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.3, marginBottom: '0.5rem' }} className="truncate-2">{track.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={11} /> {track.duration}
          </span>
          {track.file_url && (
            <a
              href={track.file_url}
              download
              onClick={e => e.stopPropagation()}
              style={{ color: 'var(--text-3)', transition: 'color 0.15s', display: 'flex' }}
              title="Download"
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              <Download size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

interface Props { tracks?: AudioTrack[] }

export default function AudioSection({ tracks = FALLBACK }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All' ? tracks : tracks.filter(t => t.category === activeCategory)

  return (
    <section className="section-spacing" style={{ background: 'var(--surface)' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <span className="section-label">Audio Library</span>
          <h2 className="t-h1 font-display">Prayer & Worship Sessions</h2>
          <p className="t-body" style={{ maxWidth: '520px' }}>
            Stream or download our daily prayer recordings. Let the Word of God renew your mind and strengthen your faith.
          </p>
        </div>

        {/* Category filter */}
        <div className="scroll-row" style={{ marginBottom: '2rem', gap: '0.5rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="btn btn-sm"
              style={{
                background: activeCategory === cat ? 'var(--gold)' : 'var(--elevated)',
                color: activeCategory === cat ? '#000' : 'var(--text-2)',
                border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                borderRadius: 'var(--r-full)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}>
          {filtered.map(track => (
            <AudioCard key={track.id} track={track} queue={filtered} />
          ))}
        </div>
      </div>
    </section>
  )
}
