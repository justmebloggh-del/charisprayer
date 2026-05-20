'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

function getYouTubeId(url: string): string {
  if (!url) return ''
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/)
  return m?.[1] ?? ''
}

interface Props {
  url: string
  title?: string
  thumbnail?: string
  rounded?: boolean
}

function isDirectFile(url: string) {
  return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url)
}

export default function YouTubePlayer({ url, title = 'Video', thumbnail, rounded = true }: Props) {
  const [playing, setPlaying] = useState(false)
  const ytId = getYouTubeId(url)
  const thumb = thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '')
  const embedSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
    : url.includes('channel=') ? `${url}&autoplay=1&mute=0` : url
  const isDirect = isDirectFile(url)

  const radius = rounded ? 'var(--r-lg)' : '0'

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', borderRadius: radius, overflow: 'hidden' }}>
      {playing ? (
        isDirect ? (
          <video
            src={url}
            title={title}
            controls
            autoPlay
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        />
        )
      ) : (
        <button
          onClick={() => setPlaying(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label={`Play ${title}`}
        >
          {thumb && (
            <img
              src={thumb}
              alt={title}
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 60%)' }} />
          {/* Play button */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'rgba(201,162,39,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
              className="yt-play-btn"
            >
              <Play size={26} fill="#000" color="#000" style={{ marginLeft: '4px' }} />
            </div>
          </div>
        </button>
      )}
      <style>{`.yt-play-btn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(0,0,0,0.6); }`}</style>
    </div>
  )
}
