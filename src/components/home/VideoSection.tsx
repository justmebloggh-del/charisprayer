'use client'

import { useState } from 'react'
import { Eye, X, Play } from 'lucide-react'
import YouTubePlayer from '@/components/ui/YouTubePlayer'
import type { Video } from '@/lib/types'

const FALLBACK: Video[] = [
  { id: '1', title: 'Sunday Morning Service — Overflow of Grace', youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: '', is_live: false, featured: true, archived: false, views: 4200, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', title: 'Wednesday Prayer Meeting — Break Every Chain', youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: '', is_live: false, featured: true, archived: false, views: 2800, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', title: 'Special Broadcast — The Effectual Prayer', youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: '', is_live: false, featured: false, archived: false, views: 1950, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

function getYouTubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m?.[1] ?? ''
}

function getThumbnail(v: Video) {
  if (v.thumbnail_url) return v.thumbnail_url
  const id = getYouTubeId(v.youtube_url)
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''
}

interface Props { videos?: Video[] }

export default function VideoSection({ videos = FALLBACK }: Props) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [featured, ...rest] = videos

  function openVideo(v: Video) {
    setActiveVideo(v)
    setTimeout(() => document.getElementById('video-player-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  return (
    <section id="sermons" className="section-spacing" style={{ background: 'var(--canvas)', scrollMarginTop: '80px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>Sermons &amp; Messages</span>
            <h2 className="t-h1 font-display">Watch &amp; Be Blessed</h2>
          </div>
          <button
            onClick={() => featured && openVideo(featured)}
            className="btn btn-ghost btn-sm"
          >
            Watch Latest Sermon →
          </button>
        </div>

        {/* In-app player (shows when a video is selected) */}
        <div id="video-player-anchor" style={{ display: activeVideo ? 'block' : 'none', marginBottom: '2rem' }}>
          {activeVideo && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.375rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>{activeVideo.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={11} /> {activeVideo.views.toLocaleString()} views
                  </p>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '6px' }}
                  aria-label="Close player"
                >
                  <X size={18} />
                </button>
              </div>
              <YouTubePlayer
                url={activeVideo.youtube_url}
                title={activeVideo.title}
                thumbnail={activeVideo.thumbnail_url}
                rounded={false}
              />
            </div>
          )}
        </div>

        {/* Featured card */}
        {featured && (
          <div
            className="card video-card"
            style={{ overflow: 'hidden', marginBottom: '1.25rem', cursor: 'pointer' }}
            onClick={() => openVideo(featured)}
          >
            <div style={{ position: 'relative', paddingBottom: '42%', background: 'var(--surface)', overflow: 'hidden' }}>
              <img
                src={getThumbnail(featured)}
                alt={featured.title}
                className="video-thumb-img"
                loading="lazy"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,162,39,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(0,0,0,0.5)', transition: 'transform 0.2s ease' }} className="play-circle">
                  <Play size={24} fill="#000" color="#000" style={{ marginLeft: '3px' }} />
                </div>
              </div>
              {featured.is_live && <span className="badge badge-live" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', fontSize: '0.5625rem' }}>LIVE</span>}
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <p style={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--text)' }}>{featured.title}</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}><Eye size={12} />{featured.views.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Grid of remaining videos */}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {rest.map(v => (
              <div
                key={v.id}
                className="card video-card"
                style={{ overflow: 'hidden', cursor: 'pointer', opacity: v.archived ? 0.5 : 1 }}
                onClick={() => openVideo(v)}
              >
                <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'var(--surface)', overflow: 'hidden' }}>
                  <img
                    src={getThumbnail(v)}
                    alt={v.title}
                    className="video-thumb-img"
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(201,162,39,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.5)', transition: 'transform 0.2s ease' }} className="play-circle">
                      <Play size={18} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                    </div>
                  </div>
                  {v.is_live && <span className="badge badge-live" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', fontSize: '0.5625rem' }}>LIVE</span>}
                  {activeVideo?.id === v.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,162,39,0.15)', border: '2px solid var(--gold)', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--gold)', background: 'rgba(0,0,0,0.8)', padding: '3px 8px', borderRadius: '4px' }}>NOW PLAYING</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '1rem 1.125rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.4, marginBottom: '0.375rem' }} className="truncate-2">{v.title}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={11} />{v.views.toLocaleString()} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`.video-card:hover .video-thumb-img { transform: scale(1.04); } .video-card:hover .play-circle { transform: scale(1.12); }`}</style>
    </section>
  )
}
