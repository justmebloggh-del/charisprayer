'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Radio, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { LivestreamSettings } from '@/lib/types'
import YouTubePlayer from '@/components/ui/YouTubePlayer'

interface Props { initial: LivestreamSettings | null }

const DEFAULT: Omit<LivestreamSettings, 'id' | 'updated_at'> = {
  youtube_url: '',
  replay_url: '',
  is_live: false,
  title: 'Sunday Service',
  description: '',
  thumbnail_url: '',
  channel_id: '',
}

export default function LivestreamManager({ initial }: Props) {
  const [form, setForm] = useState({
    youtube_url: initial?.youtube_url ?? '',
    replay_url: initial?.replay_url ?? '',
    is_live: initial?.is_live ?? false,
    title: initial?.title ?? DEFAULT.title,
    description: initial?.description ?? '',
    thumbnail_url: initial?.thumbnail_url ?? '',
    channel_id: initial?.channel_id ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<'live' | 'replay' | null>(null)

  function field(label: string, node: React.ReactNode) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <label className="form-label">{label}</label>
        {node}
      </div>
    )
  }

  async function save() {
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const payload = { ...form, updated_at: new Date().toISOString() }

    const { error: e } = await supabase
      .from('livestream_settings')
      .upsert({ id: 1, ...payload }, { onConflict: 'id' })

    if (e) { setError(e.message); setSaving(false); return }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const previewUrl = preview === 'live' ? form.youtube_url : form.replay_url

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>Livestream Manager</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '2px' }}>Control what plays in the homepage embed and hero section.</p>
      </div>

      {/* Status banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
        borderRadius: 'var(--r)',
        background: form.is_live ? 'rgba(239,68,68,0.08)' : 'var(--elevated)',
        border: `1px solid ${form.is_live ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
      }}>
        <Radio size={18} style={{ color: form.is_live ? '#EF4444' : 'var(--text-3)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>
            {form.is_live ? 'Livestream is ON' : 'Livestream is OFF'}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>
            {form.is_live ? 'Homepage shows live badge and plays the live YouTube URL.' : 'Homepage plays the replay video (if set).'}
          </p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }}>
          <div
            style={{
              width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer',
              background: form.is_live ? '#EF4444' : 'var(--border-strong)',
              transition: 'background 0.2s ease',
            }}
            onClick={() => setForm(f => ({ ...f, is_live: !f.is_live }))}
          >
            <div style={{
              position: 'absolute', top: '3px',
              left: form.is_live ? '23px' : '3px',
              width: '18px', height: '18px', borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{form.is_live ? 'Go Offline' : 'Go Live'}</span>
        </label>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '1.5rem' }}>Stream Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {field('Stream Title', <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Sunday Morning Service" />)}
          {field('YouTube Channel ID', <input className="input-field" value={form.channel_id} onChange={e => setForm(f => ({ ...f, channel_id: e.target.value }))} placeholder="UCxxxxxxxxxxxx" />)}
          {field('Live YouTube URL', <input className="input-field" value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} placeholder="https://youtube.com/live/..." />)}
          {field('Replay / Featured Video URL', <input className="input-field" value={form.replay_url} onChange={e => setForm(f => ({ ...f, replay_url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />)}
          {field('Custom Thumbnail URL', <input className="input-field" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://… (auto-detected if blank)" />)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: '1 / -1' }}>
            <label className="form-label">Stream Description</label>
            <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description shown below the player…" />
          </div>
        </div>
      </div>

      {/* Error / Success */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', borderRadius: 'var(--r-sm)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: '0.875rem' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}
      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', borderRadius: 'var(--r-sm)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399', fontSize: '0.875rem' }}>
          <CheckCircle2 size={15} /> Settings saved! Homepage will reflect changes on next visit.
        </div>
      )}

      {/* Save button */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={save} disabled={saving} className="btn btn-gold">
          {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={15} /> Save Settings</>}
        </button>
        <button onClick={() => setPreview('live')} className="btn btn-ghost btn-sm" disabled={!form.youtube_url}>Preview Live URL</button>
        <button onClick={() => setPreview('replay')} className="btn btn-ghost btn-sm" disabled={!form.replay_url}>Preview Replay</button>
        {preview && <button onClick={() => setPreview(null)} className="btn btn-ghost btn-sm">Close Preview</button>}
      </div>

      {/* Inline preview */}
      {preview && previewUrl && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Radio size={13} style={{ color: preview === 'live' ? '#EF4444' : 'var(--gold)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
              {preview === 'live' ? 'Live URL Preview' : 'Replay URL Preview'}: <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>{form.title}</span>
            </span>
          </div>
          <YouTubePlayer url={previewUrl} title={form.title} rounded={false} />
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
