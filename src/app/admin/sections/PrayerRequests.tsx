'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDate } from '@/lib/utils'
import { CheckCircle, Clock, AlertTriangle, Lock, HandHeart } from 'lucide-react'
import type { PrayerRequest } from '@/lib/types'

type Filter = 'all' | 'pending' | 'prayed'

export default function PrayerRequests({ initial }: { initial: PrayerRequest[] }) {
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? items : items.filter(p => p.status === filter)

  async function markPrayed(id: string) {
    await createClient().from('prayer_requests').update({ status: 'prayed' }).eq('id', id)
    setItems(prev => prev.map(p => p.id === id ? { ...p, status: 'prayed' as const } : p))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>Prayer Requests</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '2px' }}>{items.filter(p => p.status === 'pending').length} awaiting prayer</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['all', 'pending', 'prayed'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-sm" style={{
            background: filter === f ? 'var(--gold)' : 'var(--elevated)',
            color: filter === f ? '#000' : 'var(--text-2)',
            border: filter === f ? 'none' : '1px solid var(--border)',
            borderRadius: 'var(--r-full)',
            textTransform: 'capitalize',
          }}>{f} {f !== 'all' && `(${items.filter(p => p.status === f).length})`}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--text-3)', alignSelf: 'center' }}>{visible.length} shown</span>
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
          <HandHeart size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No prayer requests found.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {visible.map(p => (
          <div key={p.id} className="card" style={{ padding: '1.375rem', borderColor: p.urgent ? 'rgba(239,68,68,0.25)' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>{p.name}</span>
                {p.urgent && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.6875rem', fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)', padding: '2px 8px', borderRadius: '99px' }}>
                    <AlertTriangle size={10} /> Urgent
                  </span>
                )}
                {p.is_private && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.6875rem', color: 'var(--text-3)', background: 'var(--elevated)', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--border)' }}>
                    <Lock size={10} /> Private
                  </span>
                )}
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', fontWeight: 600,
                padding: '3px 10px', borderRadius: '99px', flexShrink: 0,
                background: p.status === 'prayed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                color: p.status === 'prayed' ? '#34D399' : '#FCD34D',
                border: `1px solid ${p.status === 'prayed' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
              }}>
                {p.status === 'prayed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                {p.status}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '1rem' }}>{p.request}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{formatDate(p.created_at)}{p.email ? ` · ${p.email}` : ''}</span>
              {p.status === 'pending' && (
                <button onClick={() => markPrayed(p.id)} className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle size={13} /> Mark Prayed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
