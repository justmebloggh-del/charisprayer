'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Loader2, Video, Eye, Upload, FileVideo, Link2 } from 'lucide-react'
import type { Video as VideoType } from '@/lib/types'

const BLANK = { title: '', youtube_url: '', thumbnail_url: '', is_live: false, featured: false, archived: false, scheduled_at: '' }

function ytThumb(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : ''
}

function isDirectFile(url: string) {
  return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url)
}

export default function VideoManager({ initial }: { initial: VideoType[] }) {
  const [videos, setVideos] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VideoType | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  function openCreate() { setForm(BLANK); setEditing(null); setOpen(true); setError(''); setUploadFile(null); setUploadMode('url') }
  function openEdit(v: VideoType) {
    setForm({ title: v.title, youtube_url: v.youtube_url, thumbnail_url: v.thumbnail_url ?? '', is_live: v.is_live, featured: v.featured, archived: v.archived, scheduled_at: v.scheduled_at ?? '' })
    setEditing(v); setOpen(true); setError(''); setUploadFile(null)
    setUploadMode(isDirectFile(v.youtube_url) ? 'file' : 'url')
  }
  function closeForm() { setOpen(false); setEditing(null); setUploadFile(null) }

  async function handleThumbFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const name = `thumbs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('video-files').upload(name, file, { cacheControl: '31536000', upsert: false })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('video-files').getPublicUrl(name)
      setForm(f => ({ ...f, thumbnail_url: publicUrl }))
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Thumbnail upload failed')
    } finally { setUploading(false) }
  }

  async function save() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (uploadMode === 'url' && !form.youtube_url.trim()) { setError('YouTube URL is required.'); return }
    if (uploadMode === 'file' && !uploadFile && !form.youtube_url) { setError('Please select a video file or paste a URL.'); return }

    setSaving(true); setError('')
    let videoUrl = form.youtube_url

    if (uploadMode === 'file' && uploadFile) {
      setUploading(true); setUploadProgress(10)
      try {
        const supabase = createClient()
        const ext = uploadFile.name.split('.').pop()
        const name = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        setUploadProgress(30)
        const { error: upErr } = await supabase.storage.from('video-files').upload(name, uploadFile, { cacheControl: '31536000', upsert: false })
        if (upErr) throw upErr
        setUploadProgress(80)
        const { data: { publicUrl } } = supabase.storage.from('video-files').getPublicUrl(name)
        videoUrl = publicUrl
        setUploadProgress(100)
      } catch (err: unknown) {
        setError((err as Error).message ?? 'File upload failed')
        setSaving(false); setUploading(false); return
      } finally { setUploading(false) }
    }

    const supabase = createClient()
    const payload = {
      ...form,
      youtube_url: videoUrl,
      thumbnail_url: form.thumbnail_url || (uploadMode === 'url' ? ytThumb(videoUrl) : null) || null,
      scheduled_at: form.scheduled_at || null,
    }

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
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: '1 / -1' }}>
              <label className="form-label">Title *</label>
              <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Sermon or broadcast title" />
            </div>

            {/* Video source — toggle URL / upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: '1 / -1' }}>
              <label className="form-label">Video Source *</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button type="button" onClick={() => setUploadMode('url')} className={uploadMode === 'url' ? 'btn btn-gold btn-sm' : 'btn btn-ghost btn-sm'} style={{ gap: '0.375rem' }}>
                  <Link2 size={13} /> YouTube URL
                </button>
                <button type="button" onClick={() => setUploadMode('file')} className={uploadMode === 'file' ? 'btn btn-gold btn-sm' : 'btn btn-ghost btn-sm'} style={{ gap: '0.375rem' }}>
                  <Upload size={13} /> Upload from Computer
                </button>
              </div>

              {uploadMode === 'url' ? (
                <input className="input-field" value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=…" />
              ) : (
                <div>
                  <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => setUploadFile(e.target.files?.[0] ?? null)} />
                  <div
                    onClick={() => videoInputRef.current?.click()}
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
                        <FileVideo size={18} style={{ color: 'var(--gold)' }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 600 }}>{uploadFile.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>({(uploadFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={22} style={{ color: 'var(--gold)', opacity: 0.7 }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500 }}>Click to choose video file</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>MP4, MOV, WebM — max 500 MB</p>
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
                  {editing && form.youtube_url && isDirectFile(form.youtube_url) && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>Current file: {form.youtube_url.split('/').pop()}</p>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label className="form-label">Thumbnail {uploadMode === 'url' ? '(auto from YouTube if blank)' : ''}</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="input-field" value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://… or upload →" style={{ flex: 1 }} />
                <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbFileChange} />
                <button type="button" onClick={() => thumbInputRef.current?.click()} className="btn btn-ghost btn-sm" title="Upload thumbnail">
                  <Upload size={14} />
                </button>
              </div>
            </div>

            {/* Scheduled at */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label className="form-label">Scheduled At</label>
              <input type="datetime-local" className="input-field" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} />
            </div>

            {/* Checkboxes */}
            {(['is_live', 'featured', 'archived'] as const).map(k => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)', textTransform: 'capitalize' }}>
                <input type="checkbox" style={{ accentColor: 'var(--gold)' }} checked={form[k]} onChange={e => setForm({ ...form, [k]: e.target.checked })} />
                {k.replace('_', ' ')}
              </label>
            ))}
          </div>

          {error && <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--red)', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--r-sm)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving || uploading} className="btn btn-gold">
              {(saving || uploading) && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : uploading ? 'Uploading…' : editing ? 'Save Changes' : 'Add Video'}
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
                {isDirectFile(v.youtube_url) && <span className="badge badge-surface" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.5625rem', background: 'rgba(201,162,39,0.9)', color: '#000' }}>Uploaded</span>}
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
