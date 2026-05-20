'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDate } from '@/lib/utils'
import { CheckCircle, XCircle, Clock, Star } from 'lucide-react'
import type { Testimony, TestimonyStatus } from '@/lib/types'

type Filter = 'all' | TestimonyStatus

export default function Testimonies({ initial }: { initial: Testimony[] }) {
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? items : items.filter(t => t.status === filter)

  async function updateStatus(id: string, status: TestimonyStatus) {
    await createClient().from('testimonies').update({ status }).eq('id', id)
    setItems(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const statusStyle = (s: TestimonyStatus) => ({
    display: 'flex', alignItems: 'center', gap: '4px',
    fontSize: '0.6875rem', fontWeight: 600 as const, padding: '3px 10px', borderRadius: '99px', flexShrink: 0 as const,
    background: s === 'approved' ? 'rgba(16,185,129,0.1)' : s === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
    color:      s === 'approved' ? '#34D399' : s === 'rejected' ? '#FCA5A5' : '#FCD34D',
    border: `1px solid ${s === 'approved' ? 'rgba(16,185,129,0.2)' : s === 'rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>Testimonies</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '2px' }}>{items.filter(t => t.status === 'pending').length} pending review</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-sm" style={{
            background: filter === f ? 'var(--gold)' : 'var(--elevated)',
            color: filter === f ? '#000' : 'var(--text-2)',
            border: filter === f ? 'none' : '1px solid var(--border)',
            borderRadius: 'var(--r-full)', textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
          <Star size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No testimonies found.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {visible.map(t => (
          <div key={t.id} className="card" style={{ padding: '1.375rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.875rem' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>{t.name}</p>
                {t.location && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{t.location}</p>}
              </div>
              <span style={statusStyle(t.status)}>
                {t.status === 'approved' ? <CheckCircle size={10} /> : t.status === 'rejected' ? <XCircle size={10} /> : <Clock size={10} />}
                {t.status}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '0.875rem' }}>"{t.quote}"</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, background: 'var(--gold-muted)', color: 'var(--gold-light)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: '99px' }}>{t.tag}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{formatDate(t.created_at)}</span>
              </div>
              {t.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => updateStatus(t.id, 'approved')} className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button onClick={() => updateStatus(t.id, 'rejected')} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
