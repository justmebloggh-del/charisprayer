'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, Loader2, Heart, Shield, Lock, ArrowRight } from 'lucide-react'

export default function PrayerRequestPage() {
  const [form, setForm] = useState({ name: '', email: '', request: '', urgent: false, is_private: false })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.request.trim()) { setError('Please fill in your name and prayer request.'); return }
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: dbError } = await supabase.from('prayer_requests').insert({
        name: form.name.trim(),
        email: form.email.trim() || null,
        request: form.request.trim(),
        urgent: form.urgent,
        is_private: form.is_private,
      })
      if (dbError) throw dbError
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '480px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={36} style={{ color: '#10B981' }} />
          </div>
          <h1 className="t-h2 font-display">Prayer Received</h1>
          <p className="t-body" style={{ maxWidth: '380px', textAlign: 'center' }}>
            Thank you for trusting us with your heart. Our prayer team will intercede on your behalf. May God move mightily in your situation.
          </p>
          <blockquote style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'var(--text-2)', borderLeft: '2px solid var(--gold)', paddingLeft: '1rem', textAlign: 'left' }}>
            "The Lord is near to all who call on him, to all who call on him in truth." — Psalm 145:18
          </blockquote>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', request: '', urgent: false, is_private: false }) }}
            className="btn btn-ghost"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing">
      <div className="site-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2.5rem,5vw,5rem)', alignItems: 'start' }}>

          {/* Left: info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <span className="section-label" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>Prayer Request</span>
              <h1 className="t-h1 font-display" style={{ marginTop: '1rem' }}>Bring Your<br />Burden to God</h1>
            </div>
            <p className="t-body">
              No prayer is too small, no situation too complex. Share your heart with us and our
              dedicated intercession team will stand in agreement with you before the throne of grace.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: Heart, title: 'Personally Prayed For', desc: 'Every request is read and prayed over by our team.' },
                { icon: Shield, title: 'Handled with Care', desc: 'We approach every request with compassion and faith.' },
                { icon: Lock, title: 'Private & Confidential', desc: 'Mark as private and only our team will see it.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Icon size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{title}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <blockquote style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1.25rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
              "Call to Me, and I will answer you, and show you great and mighty things." — Jeremiah 33:3
            </blockquote>
          </div>

          {/* Right: form */}
          <div className="card" style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', background: 'var(--card)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.375rem', color: 'var(--text)', marginBottom: '1.75rem' }}>
              Share Your Request
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Your Name <span style={{ color: 'var(--red)' }}>*</span></label>
                <input className="input-field" placeholder="e.g. Grace Adeyemi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Email Address <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></label>
                <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Prayer Request <span style={{ color: 'var(--red)' }}>*</span></label>
                <textarea className="input-field" rows={6} placeholder="Share what you'd like us to pray with you about…" value={form.request} onChange={e => setForm({ ...form, request: e.target.value })} />
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', padding: '1.125rem', background: 'var(--elevated)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                {[
                  { key: 'urgent', title: 'Mark as Urgent', desc: 'Requires immediate prayer attention.' },
                  { key: 'is_private', title: 'Keep Private', desc: 'Only our prayer team will see this.' },
                ].map(({ key, title, desc }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ marginTop: '3px', accentColor: 'var(--gold)', width: '16px', height: '16px', flexShrink: 0 }}
                      checked={form[key as 'urgent' | 'is_private']}
                      onChange={e => setForm({ ...form, [key]: e.target.checked })}
                    />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '1px' }}>{title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {error && (
                <p style={{ fontSize: '0.875rem', color: 'var(--red)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.875rem 1rem', borderRadius: 'var(--r-sm)' }}>{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn btn-gold btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
                {loading ? 'Submitting…' : 'Submit Prayer Request'}
              </button>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
