'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Pencil, Trash2, X, Loader2, Music2, Clock, Upload, FileAudio, Link2 } from 'lucide-react'
import type { Audio as AudioTrack } from '@/lib/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const CATEGORIES = ['Morning Prayer', 'Evening Prayer', 'Sunday Service', 'Intercession', 'Worship', 'Faith Teaching']

const BLANK = { title: '', description: '', category: CATEGORIES[0], scripture: '', duration: '', file_url: '', cover_url: '', day_of_week: DAYS[0], featured: false }

async function getAudioDuration(file: File): Promise<string> {
  return new Promise(resolve => {
    const audio = document.createElement('audio')
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src)
      const s = Math.floor(audio.duration)
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sec = s % 60
      resolve(h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        : `${m}:${String(sec).padStart(2, '0')}`)
    }
    audio.onerror = () => resolve('')
    audio.src = URL.createObjectURL(file)
  })
}

export default function AudioManager({ initial }: { initial: AudioTrack[] }) {
  const [tracks, setTracks] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AudioTrack | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  function openCreate() { setForm(BLANK); setEditing(null); setOpen(true); setError(''); setUploadFile(null); setUploadMode('url') }
  function openEdit(t: AudioTrack) {
    setForm({ title: t.title, description: t.description ?? '', category: t.category, scripture: t.scripture ?? '', duration: t.duration, file_url: t.file_url, cover_url: t.cover_url ?? '', day_of_week: t.day_of_week, featured: t.featured })
    setEditing(t); setOpen(true); setError(''); setUploadFile(null); setUploadMode(t.file_url ? 'url' : 'url')
  }
  function closeForm() { setOpen(false); setEditing(null); setUploadFile(null) }

  async function handleAudioFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFile(file)
    const dur = await getAudioDuration(file)
    if (dur) setForm(f => ({ ...f, duration: dur }))
  }

  async function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const name = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('audio-files').upload(name, file, { cacheControl: '31536000', upsert: false })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('audio-files').getPublicUrl(name)
      setForm(f => ({ ...f, cover_url: publicUrl }))
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Cover upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (uploadMode === 'file' && !uploadFile && !form.file_url) { setError('Please select an audio file or paste a URL.'); return }
    if (uploadMode === 'url' && !form.file_url.trim()) { setError('Audio file URL is required.'); return }
    if (!form.duration.trim()) { setError('Duration is required.'); return }

    setSaving(true); setError('')
    let fileUrl = form.file_url

    if (uploadMode === 'file' && uploadFile) {
      setUploading(true); setUploadProgress(10)
      try {
        const supabase = createClient()
        const ext = uploadFile.name.split('.').pop()
        const name = `tracks/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        setUploadProgress(30)
        const { error: upErr } = await supabase.storage.from('audio-files').upload(name, uploadFile, { cacheControl: '31536000', upsert: false })
        if (upErr) throw upErr
        setUploadProgress(80)
        const { data: { publicUrl } } = supabase.storage.from('audio-files').getPublicUrl(name)
        fileUrl = publicUrl
        setUploadProgress(100)
      } catch (err: unknown) {
        setError((err as Error).message ?? 'File upload failed')
        setSaving(false); setUploading(false); return
      } finally { setUploading(false) }
    }

    const supabase = createClient()
    const payload = { ...form, file_url: fileUrl, description: form.description || null, scripture: form.scripture || null, cover_url: form.cover_url || null }

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
    await createClient().from('audios').delete().eq('id', id)
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
            {field('Duration *', <input className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 42:30 (auto-detected on upload)" />)}

            {/* Audio file — toggle URL / upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: '1 / -1' }}>
              <label className="form-label">Audio File *</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={uploadMode === 'url' ? 'btn btn-gold btn-sm' : 'btn btn-ghost btn-sm'}
                  style={{ gap: '0.375rem' }}
                ><Link2 size={13} /> Paste URL</button>
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={uploadMode === 'file' ? 'btn btn-gold btn-sm' : 'btn btn-ghost btn-sm'}
                  style={{ gap: '0.375rem' }}
                ><Upload size={13} /> Upload from Computer</button>
              </div>

              {uploadMode === 'url' ? (
                <input className="input-field" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} placeholder="https://…/audio.mp3" />
              ) : (
                <div>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={handleAudioFileChange}
                  />
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border-gold)', borderRadius: 'var(--r)',
                      padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                      background: uploadFile ? 'rgba(201,162,39,0.04)' : 'var(--surface)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,162,39,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = uploadFile ? 'rgba(201,162,39,0.04)' : 'var(--surface)')}
                  >
                    {uploadFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
                        <FileAudio size={18} style={{ color: 'var(--gold)' }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 600 }}>{uploadFile.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>({(uploadFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={22} style={{ color: 'var(--gold)', opacity: 0.7 }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500 }}>Click to choose audio file</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>MP3, WAV, M4A, AAC — max 500 MB</p>
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ height: '4px', borderRadius: '2px', background: 'var(--elevated)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--gold)', transition: 'width 0.3s ease', borderRadius: '2px' }} />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>Uploading… {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cover image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label className="form-label">Cover Image</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="input-field" value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} placeholder="https://…/cover.jpg or upload →" style={{ flex: 1 }} />
                <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverFileChange} />
                <button type="button" onClick={() => coverInputRef.current?.click()} className="btn btn-ghost btn-sm" title="Upload cover image">
                  <Upload size={14} />
                </button>
              </div>
            </div>

            {field('Scripture', <input className="input-field" value={form.scripture} onChange={e => setForm({ ...form, scripture: e.target.value })} placeholder="e.g. Psalm 91:1" />)}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: '1 / -1' }}>
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
            <button onClick={save} disabled={saving || uploading} className="btn btn-gold">
              {(saving || uploading) && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : uploading ? 'Uploading…' : editing ? 'Save Changes' : 'Add Track'}
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
