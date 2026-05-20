'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Loader2, Video, Eye } from 'lucide-react'
import type { Video as VideoType } from '@/lib/types'

const BLANK = { title: '', youtube_url: '', thumbnail_url: '', is_live: false, featured: false, archived: false, scheduled_at: '' }

function ytThumb(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : ''
}

export default function VideoManager({ initial }: { initial: VideoType[] }) {
  const [videos, setVideos] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VideoType | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openCreate() { setForm(BLANK); setEditing(null); setOpen(true); setError('') }
  function openEdit(v: VideoType) {
    setForm({ title: v.title, youtube_url: v.youtube_url, thumbnail_url: v.thumbnail_url ?? '', is_live: v.is_live, featured: v.featured, archived: v.archived, scheduled_at: v.scheduled_at ?? '' })
    setEditing(v); setOpen(true); setError('')
  }
  function closeForm() { setOpen(false); setEditing(null) }

  async function save() {
    if (!form.title.trim() || !form.youtube_url.trim()) { setError('Title and YouTube URL are required.'); return }
    setSaving(true)
    const supabase = createClient()
    const payload = { ...form, thumbnail_url: form.thumbnail_url || ytThumb(form.youtube_url) || null, scheduled_at: form.scheduled_at || null }

    if (editing) {
      const { data, error: e } = await supabase.from('videos').update(payload).eq('id', editing.id).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setVideos(prev => prev.map(v => v.id === editing.id ? data : v))
    } else {
      const { data, error: e } = await supabase.from('videos').insert(payload).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setVideos(prev => [data, ...prev])
    }
    setSaving(false); closeForm()
  }

  async function remove(id: string) {
    if (!confirm('Delete this video?')) return
    await createClient().from('videos').delete().eq('id', id)
    setVideos(prev => prev.filter(v => v.id !== id))
  }

  async function toggleArchive(v: VideoType) {
    const next = !v.archived
    await createClient().from('videos').update({ archived: next }).eq('id', v.id)
    setVideos(prev => prev.map(item => item.id === v.id ? { ...item, archived: next } : item))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>Video Manager</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '2px' }}>{videos.length} videos</p>
        </div>
        <button onClick={openCreate} className="btn btn-gold btn-sm"><Plus size={15} /> Add Video</button>
      </div>

      {open && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text)' }}>{editing ? 'Edit Video' : 'Add Video'}</h3>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Title *', key: 'title', placeholder: 'Sermon or broadcast title' },
              { label: 'YouTube URL *', key: 'youtube_url', placeholder: 'https://youtube.com/watch?v=…' },
              { label: 'Thumbnail URL', key: 'thumbnail_url', placeholder: 'Auto-generated if blank' },
              { label: 'Scheduled At', key: 'scheduled_at', placeholder: '', type: 'datetime-local' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">{label}</label>
                <input type={type ?? 'text'} className="input-field" value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
              </div>
            ))}
            {(['is_live', 'featured', 'archived'] as const).map(k => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)', textTransform: 'capitalize' }}>
                <input type="checkbox" style={{ accentColor: 'var(--gold)' }} checked={form[k]} onChange={e => setForm({ ...form, [k]: e.target.checked })} />
                {k.replace('_', ' ')}
              </label>
            ))}
          </div>
          {error && <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--red)', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--r-sm)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} className="btn btn-gold">
              {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Video'}
            </button>
            <button onClick={closeForm} className="btn btn-ghost">Cancel</button>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {videos.length === 0 && !open && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
          <Video size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No videos yet. Add your first one.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {videos.map(v => {
          const thumb = v.thumbnail_url || ytThumb(v.youtube_url)
          return (
            <div key={v.id} className="card" style={{ overflow: 'hidden', opacity: v.archived ? 0.5 : 1 }}>
              <div style={{ width: '100%', height: '140px', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
                {thumb && <img src={thumb} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                {v.is_live && <span className="badge badge-live" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', fontSize: '0.5625rem' }}>LIVE</span>}
                {v.archived && <span className="badge badge-surface" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.5625rem' }}>Archived</span>}
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)', marginBottom: '0.375rem' }} className="truncate-2">{v.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.875rem' }}><Eye size={11} />{(v.views ?? 0).toLocaleString()} views · {formatDate(v.created_at)}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(v)} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}><Pencil size={13} /> Edit</button>
                  <button onClick={() => toggleArchive(v)} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>{v.archived ? 'Restore' : 'Archive'}</button>
                  <button onClick={() => remove(v.id)} className="btn btn-ghost btn-icon-sm" style={{ color: 'var(--red)' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
