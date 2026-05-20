'use client'

import { Music2, Video, BookOpen, HandHeart, Star, TrendingUp, Eye, BookHeart } from 'lucide-react'
import type { PrayerRequest, Testimony, BlogPost, Audio, Video as VideoType, Devotion } from '@/lib/types'

interface Props {
  prayers: PrayerRequest[]
  testimonies: Testimony[]
  posts: BlogPost[]
  audios: Audio[]
  videos: VideoType[]
  devotions: Devotion[]
}

export default function Analytics({ prayers, testimonies, posts, audios, videos, devotions }: Props) {
  const totalViews = posts.reduce((s, p) => s + (p.views ?? 0), 0)
  const totalPlays = audios.reduce((s, a) => s + (a.plays ?? 0), 0)
  const totalVideoViews = videos.reduce((s, v) => s + (v.views ?? 0), 0)
  const totalDevotionViews = devotions.reduce((s, d) => s + (d.views ?? 0), 0)

  const stats = [
    { label: 'Prayer Requests', value: prayers.length, sub: `${prayers.filter(p => p.status === 'pending').length} pending`, icon: HandHeart, color: '#F59E0B' },
    { label: 'Testimonies', value: testimonies.length, sub: `${testimonies.filter(t => t.status === 'approved').length} approved`, icon: Star, color: '#10B981' },
    { label: 'Devotions', value: devotions.length, sub: `${devotions.filter(d => d.published).length} published`, icon: BookHeart, color: '#4F46E5' },
    { label: 'Blog Posts', value: posts.length, sub: `${posts.filter(p => p.status === 'published').length} published`, icon: BookOpen, color: '#3B82F6' },
    { label: 'Audio Tracks', value: audios.length, sub: `${totalPlays.toLocaleString()} total plays`, icon: Music2, color: '#8B5CF6' },
    { label: 'Videos', value: videos.length, sub: `${totalVideoViews.toLocaleString()} total views`, icon: Video, color: '#EF4444' },
    { label: 'Blog Views', value: totalViews.toLocaleString(), sub: 'across all posts', icon: Eye, color: '#3B82F6' },
    { label: 'Devotion Views', value: totalDevotionViews.toLocaleString(), sub: 'across all devotions', icon: BookHeart, color: '#4F46E5' },
  ]

  const topPosts = [...posts].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5)
  const topAudios = [...audios].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0)).slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)', marginBottom: '0.375rem' }}>Analytics Overview</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>Platform-wide statistics and content performance.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card" style={{ padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '0.75rem', color: s.color, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={11} /> {s.sub}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Top blog posts */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={16} style={{ color: '#3B82F6' }} /> Top Blog Posts
          </h3>
          {topPosts.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', textAlign: 'center', padding: '2rem 0' }}>No posts yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topPosts.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-3)', width: '16px', flexShrink: 0 }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{p.category}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3B82F6', flexShrink: 0 }}>{(p.views ?? 0).toLocaleString()} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top audio tracks */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Music2 size={16} style={{ color: '#8B5CF6' }} /> Top Audio Tracks
          </h3>
          {topAudios.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', textAlign: 'center', padding: '2rem 0' }}>No audio yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topAudios.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-3)', width: '16px', flexShrink: 0 }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{a.category} · {a.duration}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8B5CF6', flexShrink: 0 }}>{(a.plays ?? 0).toLocaleString()} plays</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
