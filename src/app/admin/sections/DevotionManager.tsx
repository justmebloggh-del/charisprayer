'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Loader2, BookHeart } from 'lucide-react'
import type { Devotion } from '@/lib/types'

const BLANK = {
  title: '',
  scripture_reference: '',
  scripture_text: '',
  message: '',
  excerpt: '',
  featured_image_url: '',
  author: 'Rev. Emmanuel Cosby Oduro',
  published: false,
  featured: false,
}

export default function DevotionManager({ initial }: { initial: Devotion[] }) {
  const [devotions, setDevotions] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Devotion | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'content' | 'scripture' | 'settings'>('content')

  function openCreate() { setForm(BLANK); setEditing(null); setOpen(true); setError(''); setTab('content') }
  function openEdit(d: Devotion) {
    setForm({
      title: d.title,
      scripture_reference: d.scripture_reference ?? '',
      scripture_text: d.scripture_text ?? '',
      message: d.message,
      excerpt: d.excerpt ?? '',
      featured_image_url: d.featured_image_url ?? '',
      author: d.author,
      published: d.published,
      featured: d.featured,
    })
    setEditing(d); setOpen(true); setError(''); setTab('content')
  }
  function closeForm() { setOpen(false); setEditing(null) }

  async function save() {
    if (!form.title.trim() || !form.message.trim()) { setError('Title and message are required.'); return }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      ...form,
      scripture_reference: form.scripture_reference || null,
      scripture_text: form.scripture_text || null,
      excerpt: form.excerpt || null,
      featured_image_url: form.featured_image_url || null,
    }

    if (editing) {
      const { data, error: e } = await supabase.from('devotions').update(payload).eq('id', editing.id).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setDevotions(prev => prev.map(d => d.id === editing.id ? data : d))
    } else {
      const { data, error: e } = await supabase.from('devotions').insert(payload).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setDevotions(prev => [data, ...prev])
    }
    setSaving(false); closeForm()
  }

  async function remove(id: string) {
    if (!confirm('Delete this devotion?')) return
    await createClient().from('devotions').delete().eq('id', id)
    setDevotions(prev => prev.filter(d => d.id !== id))
  }

  async function togglePublished(d: Devotion) {
    const next = !d.published
    await createClient().from('devotions').update({ published: next }).eq('id', d.id)
    setDevotions(prev => prev.map(item => item.id === d.id ? { ...item, published: next } : item))
  }

  const tabStyle = (t: string) => ({
    padding: '0.5rem 1rem',
    borderRadius: 'var(--r-sm)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    background: tab === t ? 'var(--gold-muted)' : 'transparent',
    color: tab === t ? 'var(--gold-light)' : 'var(--text-3)',
    border: tab === t ? '1px solid var(--border-gold)' : '1px solid transparent',
    transition: 'all 0.15s',
  } as React.CSSProperties)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>Devotion Manager</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '2px' }}>
            {devotions.filter(d => d.published).length} published · {devotions.filter(d => !d.published).length} drafts
          </p>
        </div>
        <button onClick={openCreate} className="btn btn-gold btn-sm"><Plus size={15} /> New Devotion</button>
      </div>

      {/* Form */}
      {open && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text)' }}>{editing ? 'Edit Devotion' : 'New Devotion'}</h3>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.875rem' }}>
            {(['content', 'scripture', 'settings'] as const).map(t => (
              <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">Title *</label>
                <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Devotion title" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">Excerpt (shown on listing)</label>
                <textarea className="input-field" rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary…" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">Message * <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(HTML supported)</span></label>
                <textarea
                  className="input-field"
                  rows={12}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="<p>Write the devotion message here…</p>"
                  style={{ minHeight: '240px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          )}

          {tab === 'scripture' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">Scripture Reference</label>
                <input className="input-field" value={form.scripture_reference} onChange={e => setForm(f => ({ ...f, scripture_reference: e.target.value }))} placeholder="e.g. Philippians 4:6-7" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">Scripture Text</label>
                <textarea className="input-field" rows={5} value={form.scripture_text} onChange={e => setForm(f => ({ ...f, scripture_text: e.target.value }))} placeholder="Full verse text…" />
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">Author</label>
                <input className="input-field" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">Featured Image URL</label>
                <input className="input-field" value={form.featured_image_url} onChange={e => setForm(f => ({ ...f, featured_image_url: e.target.value }))} placeholder="https://…" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'var(--elevated)', borderRadius: 'var(--r)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--gold)' }} checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                  Publish immediately
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--gold)' }} checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                  Mark as featured (shown as &ldquo;Today&apos;s Devotion&rdquo;)
                </label>
              </div>
            </div>
          )}

          {error && <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--red)', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--r-sm)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} className="btn btn-gold">
              {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Devotion'}
            </button>
            <button onClick={closeForm} className="btn btn-ghost">Cancel</button>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty state */}
      {devotions.length === 0 && !open && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
          <BookHeart size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No devotions yet. Create your first one.</p>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {devotions.map(d => (
          <div key={d.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                <span style={{
                  fontSize: '0.625rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px',
                  background: d.published ? 'rgba(16,185,129,0.1)' : 'var(--elevated)',
                  color: d.published ? '#34D399' : 'var(--text-3)',
                  border: `1px solid ${d.published ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                }}>{d.published ? 'Published' : 'Draft'}</span>
                {d.featured && <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'var(--gold-muted)', color: 'var(--gold-light)', border: '1px solid var(--border-gold)' }}>Featured</span>}
                {d.scripture_reference && <span style={{ fontSize: '0.6875rem', color: 'var(--gold)', fontWeight: 600 }}>{d.scripture_reference}</span>}
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{d.author} · {formatDate(d.created_at)} · {(d.views ?? 0).toLocaleString()} views</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
              <button onClick={() => togglePublished(d)} title={d.published ? 'Unpublish' : 'Publish'} className="btn btn-ghost btn-icon-sm">
                {d.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => openEdit(d)} className="btn btn-ghost btn-icon-sm"><Pencil size={14} /></button>
              <button onClick={() => remove(d.id)} className="btn btn-ghost btn-icon-sm" style={{ color: 'var(--red)' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
