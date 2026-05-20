'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Loader2, BookOpen } from 'lucide-react'
import type { BlogPost, BlogStatus } from '@/lib/types'

const BLANK = { title: '', excerpt: '', content: '', category: '', author: 'Rev. Emmanuel Cosby Oduro', cover_url: '', status: 'draft' as BlogStatus }

export default function BlogManager({ initial }: { initial: BlogPost[] }) {
  const [posts, setPosts] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openCreate() { setForm(BLANK); setEditing(null); setOpen(true); setError('') }
  function openEdit(p: BlogPost) {
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, category: p.category, author: p.author, cover_url: p.cover_url ?? '', status: p.status })
    setEditing(p); setOpen(true); setError('')
  }
  function closeForm() { setOpen(false); setEditing(null) }

  async function save() {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) { setError('Title, excerpt, and content are required.'); return }
    setSaving(true)
    const supabase = createClient()
    const payload = { ...form, cover_url: form.cover_url || null }

    if (editing) {
      const { data, error: e } = await supabase.from('blog_posts').update(payload).eq('id', editing.id).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setPosts(prev => prev.map(p => p.id === editing.id ? data : p))
    } else {
      const { data, error: e } = await supabase.from('blog_posts').insert(payload).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setPosts(prev => [data, ...prev])
    }
    setSaving(false); closeForm()
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return
    await createClient().from('blog_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  async function toggleStatus(p: BlogPost) {
    const next: BlogStatus = p.status === 'published' ? 'draft' : 'published'
    await createClient().from('blog_posts').update({ status: next }).eq('id', p.id)
    setPosts(prev => prev.map(item => item.id === p.id ? { ...item, status: next } : item))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>Blog Manager</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '2px' }}>{posts.filter(p => p.status === 'published').length} published · {posts.filter(p => p.status === 'draft').length} drafts</p>
        </div>
        <button onClick={openCreate} className="btn btn-gold btn-sm"><Plus size={15} /> New Post</button>
      </div>

      {open && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text)' }}>{editing ? 'Edit Post' : 'New Blog Post'}</h3>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Title *', key: 'title', placeholder: 'Post title' },
              { label: 'Category *', key: 'category', placeholder: 'e.g. Prayer, Faith, Healing' },
              { label: 'Author', key: 'author', placeholder: 'Author name' },
              { label: 'Cover Image URL', key: 'cover_url', placeholder: 'https://…' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label">{label}</label>
                <input className="input-field" value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: '1 / -1' }}>
              <label className="form-label">Excerpt * (shown on listing)</label>
              <textarea className="input-field" rows={3} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary of the post…" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', gridColumn: '1 / -1' }}>
              <label className="form-label">Content * (HTML supported)</label>
              <textarea className="input-field" rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Full post content…" style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '0.875rem' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
              <input type="checkbox" style={{ accentColor: 'var(--gold)' }} checked={form.status === 'published'} onChange={e => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })} />
              Publish immediately
            </label>
          </div>
          {error && <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--red)', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--r-sm)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} className="btn btn-gold">
              {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Post'}
            </button>
            <button onClick={closeForm} className="btn btn-ghost">Cancel</button>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {posts.length === 0 && !open && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
          <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No posts yet. Create your first one.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {posts.map(p => (
          <div key={p.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: p.status === 'published' ? 'rgba(16,185,129,0.1)' : 'var(--elevated)', color: p.status === 'published' ? '#34D399' : 'var(--text-3)', border: `1px solid ${p.status === 'published' ? 'rgba(16,185,129,0.2)' : 'var(--border)'}` }}>{p.status}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.category}</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{p.author} · {formatDate(p.created_at)} · {(p.views ?? 0).toLocaleString()} views</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
              <button onClick={() => toggleStatus(p)} title={p.status === 'published' ? 'Unpublish' : 'Publish'} className="btn btn-ghost btn-icon-sm">{p.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              <button onClick={() => openEdit(p)} className="btn btn-ghost btn-icon-sm"><Pencil size={14} /></button>
              <button onClick={() => remove(p.id)} className="btn btn-ghost btn-icon-sm" style={{ color: 'var(--red)' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
