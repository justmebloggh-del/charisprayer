'use client'

import { useState } from 'react'
import { LogOut, HandHeart, Star, BookOpen, Music2, Video, BarChart3, Radio, BookHeart, Menu, X } from 'lucide-react'
import PrayerRequests from './sections/PrayerRequests'
import Testimonies from './sections/Testimonies'
import BlogManager from './sections/BlogManager'
import AudioManager from './sections/AudioManager'
import VideoManager from './sections/VideoManager'
import Analytics from './sections/Analytics'
import LivestreamManager from './sections/LivestreamManager'
import DevotionManager from './sections/DevotionManager'
import type { PrayerRequest, Testimony, BlogPost, Audio, Video as VideoType, Devotion, LivestreamSettings } from '@/lib/types'

export interface Props {
  prayers: PrayerRequest[]
  testimonies: Testimony[]
  posts: BlogPost[]
  audios: Audio[]
  videos: VideoType[]
  devotions: Devotion[]
  livestream: LivestreamSettings | null
}

const tabs = [
  { id: 'analytics',    label: 'Analytics',      icon: BarChart3   },
  { id: 'livestream',   label: 'Livestream',     icon: Radio       },
  { id: 'prayers',      label: 'Prayers',        icon: HandHeart   },
  { id: 'testimonies',  label: 'Testimonies',    icon: Star        },
  { id: 'devotions',    label: 'Devotions',      icon: BookHeart   },
  { id: 'blog',         label: 'Blog',           icon: BookOpen    },
  { id: 'audio',        label: 'Audio',          icon: Music2      },
  { id: 'video',        label: 'Videos',         icon: Video       },
]

export default function AdminDashboard({ prayers, testimonies, posts, audios, videos, devotions, livestream }: Props) {
  const [active, setActive] = useState('analytics')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pending = {
    prayers:     prayers.filter(p => p.status === 'pending').length,
    testimonies: testimonies.filter(t => t.status === 'pending').length,
  }

  function NavItem({ t }: { t: typeof tabs[0] }) {
    const Icon = t.icon
    const badge = t.id === 'prayers' ? pending.prayers : t.id === 'testimonies' ? pending.testimonies : 0
    return (
      <button
        key={t.id}
        onClick={() => { setActive(t.id); setSidebarOpen(false) }}
        className={`admin-nav-item ${active === t.id ? 'active' : ''}`}
      >
        <Icon size={15} />
        {t.label}
        {badge > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.5625rem', fontWeight: 700, background: '#F59E0B', color: '#000', minWidth: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
            {badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)', position: 'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 48, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" data-open={sidebarOpen ? 'true' : 'false'}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1.125rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>CHARIS PRAYER TIME</p>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginTop: '1px' }}>Admin Dashboard</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'none', padding: '4px' }} className="sidebar-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '1px', overflowY: 'auto' }}>
          {tabs.map(t => <NavItem key={t.id} t={t} />)}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '0.875rem', borderTop: '1px solid var(--border)' }}>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="admin-nav-item" style={{ color: 'var(--red)', width: '100%', margin: 0 }}>
              <LogOut size={14} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: 'auto', padding: 'clamp(1.25rem,2.5vw,2.25rem)', paddingLeft: 'calc(clamp(1.25rem,2.5vw,2.25rem) + 0px)' }} className="admin-main">
        {/* Mobile top bar */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }} className="admin-topbar">
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '6px' }} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
            {tabs.find(t => t.id === active)?.label ?? 'Dashboard'}
          </span>
        </div>

        {active === 'analytics'   && <Analytics    prayers={prayers} testimonies={testimonies} posts={posts} audios={audios} videos={videos} devotions={devotions} />}
        {active === 'livestream'  && <LivestreamManager initial={livestream} />}
        {active === 'prayers'     && <PrayerRequests initial={prayers} />}
        {active === 'testimonies' && <Testimonies initial={testimonies} />}
        {active === 'devotions'   && <DevotionManager initial={devotions} />}
        {active === 'blog'        && <BlogManager initial={posts} />}
        {active === 'audio'       && <AudioManager initial={audios} />}
        {active === 'video'       && <VideoManager initial={videos} />}
      </main>

    </div>
  )
}
