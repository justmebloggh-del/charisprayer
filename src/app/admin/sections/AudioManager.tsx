'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Loader2, Music2, Clock } from 'lucide-react'
import type { Audio as AudioTrack } from '@/lib/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const CATEGORIES = ['Morning Prayer', 'Evening Prayer', 'Sunday Service', 'Intercession', 'Worship', 'Faith Teaching']

const BLANK = { title: '', description: '', category: CATEGORIES[0], scripture: '', duration: '', file_url: '', cover_url: '', day_of_week: DAYS[0], featured: false }

export default function AudioManager({ initial }: { initial: AudioTrack[] }) {
  const [tracks, setTracks] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AudioTrack | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openCreate() { setForm(BLANK); setEditing(null); setOpen(true); setError('') }
  function openEdit(t: AudioTrack) {
    setForm({ title: t.title, description: t.description ?? '', category: t.category, scripture: t.scripture ?? '', duration: t.duration, file_url: t.file_url, cover_url: t.cover_url ?? '', day_of_week: t.day_of_week, featured: t.featured })
    setEditing(t); setOpen(true); setError('')
  }
  function closeForm() { setOpen(false); setEditing(null) }

  async function save() {
    if (!form.title.trim() || !form.file_url.trim() || !form.duration.trim()) { setError('Title, file URL, and duration are required.'); return }
    setSaving(true)
    const supabase = createClient()
    const payload = { ...form, description: form.description || null, scripture: form.scripture || null, cover_url: form.cover_url || null }

    if (editing) {
      const { data, error: e } = await supabase.from('audios').update(payload).eq('id', editing.id).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setTracks(prev => prev.map(t => t.id === editing.id ? data : t))
    } else {
      const { data, error: e } = await supabase.from('audios').insert(payload).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setTracks(prev => [data, ...prev])
    }
    setSaving(false); closeForm()
  }

  async function remove(id: string) {
    if (!confirm('Delete this audio track?')) return
    const supabase = createClient()
    await supabase.from('audios').delete().eq('id', id)
    setTracks(prev => prev.filter(t => t.id !== id))
  }

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label className="form-label">{label}</label>
      {node}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>Audio Manager</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '2px' }}>{tracks.length} tracks</p>
        </div>
        <button onClick={openCreate} className="btn btn-gold btn-sm"><Plus size={15} /> Add Track</button>
      </div>

      {/* Form */}
      {open && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text)' }}>{editing ? 'Edit Track' : 'New Audio Track'}</h3>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {field('Title *', <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Prayer session title" />)}
            {field('Category', (
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            ))}
            {field('Day of Week', (
              <select className="input-field" value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            ))}
            {field('Duration *', <input className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 42:30" />)}
            {field('Audio File URL *', <input className="input-field" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} placeholder="https://…/audio.mp3" />)}
            {field('Cover Image URL', <input className="input-field" value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} placeholder="https://…/cover.jpg" />)}
            {field('Scripture', <input className="input-field" value={form.scripture} onChange={e => setForm({ ...form, scripture: e.target.value })} placeholder="e.g. Psalm 91:1" />)}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: 'span 2' }}>
              <label className="form-label">Description</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this session…" style={{ minHeight: '80px' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
              <input type="checkbox" style={{ accentColor: 'var(--gold)' }} checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
              Mark as featured
            </label>
          </div>
          {error && <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--red)', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--r-sm)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} className="btn btn-gold">
              {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Track'}
            </button>
            <button onClick={closeForm} className="btn btn-ghost">Cancel</button>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Track list */}
      {tracks.length === 0 && !open && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
          <Music2 size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No audio tracks yet. Add your first one.</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {tracks.map(t => (
          <div key={t.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {t.cover_url ? <img src={t.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Music2 size={18} style={{ color: 'var(--gold)' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{t.category} · {t.day_of_week}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              {t.featured && <span className="badge badge-gold" style={{ fontSize: '0.5625rem' }}>Featured</span>}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={11} />{t.duration}</span>
              <button onClick={() => openEdit(t)} className="btn btn-ghost btn-icon-sm"><Pencil size={13} /></button>
              <button onClick={() => remove(t.id)} className="btn btn-ghost btn-icon-sm" style={{ color: 'var(--red)' }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
