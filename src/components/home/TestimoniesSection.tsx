'use client'

import { useState, useEffect } from 'react'
import type { Testimony } from '@/lib/types'

const FALLBACK: Testimony[] = [
  { id: '1', name: 'Grace Adeyemi', location: 'Lagos, Nigeria', tag: 'Healing', quote: 'I submitted a prayer request for my mother who had been battling a serious illness. Within two weeks, the doctors confirmed she was healed. God answered our prayers through this ministry.', status: 'approved', created_at: '', updated_at: '' },
  { id: '2', name: 'David Mensah', location: 'Accra, Ghana', tag: 'Provision', quote: 'After three months of unemployment, I joined the Wednesday intercession prayer. Within days I received two job offers. The prayers of this community moved heaven on my behalf.', status: 'approved', created_at: '', updated_at: '' },
  { id: '3', name: 'Esther Okonkwo', location: 'Abuja, Nigeria', tag: 'Peace', quote: 'The daily prayer sessions have completely transformed my mornings and my marriage. What seemed broken has been beautifully restored. I am forever grateful to Rev. Cosby and this community.', status: 'approved', created_at: '', updated_at: '' },
  { id: '4', name: 'Samuel Boateng', location: 'Kumasi, Ghana', tag: 'Breakthrough', quote: 'My visa had been denied four times. After praying with the CHARIS PRAYER TIME community, my application was approved on the fifth attempt. Every impossible situation bows to prayer.', status: 'approved', created_at: '', updated_at: '' },
  { id: '5', name: 'Ruth Asamoah', location: 'London, UK', tag: 'Miracle', quote: 'Diagnosed with a condition doctors said was incurable. I joined the healing prayer session and trusted God. Six months later, every symptom was gone. To God be the glory!', status: 'approved', created_at: '', updated_at: '' },
  { id: '6', name: 'Emmanuel Asante', location: 'New York, USA', tag: 'Restoration', quote: 'My family was on the verge of collapse. The intercession prayer and devotionals gave us new perspective. We are now stronger than ever as a family. Prayer truly works.', status: 'approved', created_at: '', updated_at: '' },
]

const tagColors: Record<string, { bg: string; color: string }> = {
  Healing:      { bg: 'rgba(16,185,129,0.12)',  color: '#34D399' },
  Provision:    { bg: 'rgba(59,130,246,0.12)',   color: '#60A5FA' },
  Peace:        { bg: 'rgba(139,92,246,0.12)',   color: '#A78BFA' },
  Breakthrough: { bg: 'rgba(245,158,11,0.12)',   color: '#FCD34D' },
  Miracle:      { bg: 'rgba(239,68,68,0.12)',    color: '#FCA5A5' },
  Restoration:  { bg: 'rgba(236,72,153,0.12)',   color: '#F9A8D4' },
}

export default function TestimoniesSection() {
  const [items, setItems] = useState<Testimony[]>(FALLBACK)

  useEffect(() => {
    ;(async () => {
      try {
        const { createPublicClient } = await import('@/utils/supabase/public')
        const { data } = await createPublicClient()
          .from('testimonies').select('*').eq('status', 'approved')
          .order('created_at', { ascending: false }).limit(6)
        if (data && data.length > 0) setItems(data as Testimony[])
      } catch {}
    })()
  }, [])

  return (
    <section className="section-spacing" style={{ background: 'var(--canvas)' }}>
      <div className="site-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <span className="section-label">Testimonies</span>
          <h2 className="t-h1 font-display">Lives Changed by Prayer</h2>
          <p className="t-body" style={{ maxWidth: '480px' }}>
            Real stories from our global community. God is still answering prayers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {items.map(t => {
            const tc = tagColors[t.tag] ?? { bg: 'var(--gold-muted)', color: 'var(--gold-light)' }
            return (
              <div key={t.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: '4rem', lineHeight: 0.7, color: 'var(--gold)', opacity: 0.3, userSelect: 'none' }}>&ldquo;</div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.8, flex: 1 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>{t.name}</p>
                    {t.location && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{t.location}</p>}
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: 'var(--r-full)', background: tc.bg, color: tc.color, border: `1px solid ${tc.color}30` }}>
                    {t.tag}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
