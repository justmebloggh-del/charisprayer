import { createPublicClient } from '@/utils/supabase/public'

export const revalidate = 60
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { BookOpen, Clock } from 'lucide-react'
import type { BlogPost } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devotionals',
  description: 'Faith-building articles and devotionals from Charis Prayer Ministry.',
}

const FALLBACK: BlogPost[] = [
  { id: '1', title: 'The Power of Persistent Prayer', excerpt: 'Jesus taught us that men ought always to pray and not faint. Discover why persistence in prayer moves the heart of God and how to build a daily prayer habit that transforms your life.', content: '', category: 'Prayer', author: 'Rev. Emmanuel Oduro Cosby', status: 'published', views: 1840, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', title: 'Faith That Moves Mountains', excerpt: 'A single mustard seed of faith is all it takes. Explore what real, mountain-moving faith looks like in everyday life and how you can activate it in your own situation.', content: '', category: 'Faith', author: 'Rev. Emmanuel Oduro Cosby', status: 'published', views: 2200, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', title: "Healing Is the Children's Bread", excerpt: "God's will for your healing is clear throughout all of scripture. Learn how to receive your healing through an unshakeable confidence in God's Word and His covenant of health.", content: '', category: 'Healing', author: 'Rev. Emmanuel Oduro Cosby', status: 'published', views: 1560, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', title: 'Intercession: Standing in the Gap', excerpt: 'What does it mean to intercede for another person? This devotional explores the biblical foundations of intercession and how you can become an effective intercessor.', content: '', category: 'Intercession', author: 'Rev. Emmanuel Oduro Cosby', status: 'published', views: 1020, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', title: 'When God Seems Silent', excerpt: 'There are seasons when heaven feels distant and our prayers seem to bounce off the ceiling. This devotional helps you navigate the silence of God with faith and confidence.', content: '', category: 'Faith', author: 'Rev. Emmanuel Oduro Cosby', status: 'published', views: 3100, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', title: 'The Grace to Begin Again', excerpt: "Grace is not just unmerited favour — it is the divine enabling to start fresh. No matter where you are today, God's grace is sufficient to give you a new beginning.", content: '', category: 'Grace', author: 'Rev. Emmanuel Oduro Cosby', status: 'published', views: 2480, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

const catColors: Record<string, string> = {
  Prayer: '#F59E0B', Faith: '#3B82F6', Healing: '#10B981',
  Intercession: '#EF4444', Grace: '#C9A227', Worship: '#EC4899',
}

export default async function BlogPage() {
  let posts: BlogPost[] = FALLBACK

  try {
    const supabase = createPublicClient()
    const result = await Promise.race([
      supabase.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).then((r: { data: BlogPost[] | null }) => r.data),
      new Promise<null>(res => setTimeout(() => res(null), 1500)),
    ])
    if (result && result.length > 0) posts = result
  } catch { /* use fallback */ }

  const [hero, ...rest] = posts

  return (
    <div className="section-spacing">
      <div className="site-container">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
          <span className="section-label">Devotionals & Teaching</span>
          <h1 className="t-h1 font-display">Faith & the Word</h1>
          <p className="t-body" style={{ maxWidth: '480px' }}>
            Devotionals, teachings, and articles to strengthen your faith and deepen your walk with God.
          </p>
        </div>

        {posts.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingBlock: '5rem', color: 'var(--text-3)' }}>
            <BookOpen size={44} />
            <p>No posts yet. Check back soon.</p>
          </div>
        )}

        {/* Hero post */}
        {hero && (
          <Link href={`/blog/${hero.id}`} className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, overflow: 'hidden', marginBottom: '2rem', textDecoration: 'none' }}>
            <div style={{ background: 'var(--surface)', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {hero.cover_url
                ? <img src={hero.cover_url} alt={hero.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={36} style={{ color: 'var(--gold)' }} />
                  </div>
                )
              }
            </div>
            <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: catColors[hero.category] ?? 'var(--gold)' }}>{hero.category}</span>
                <span className="badge badge-gold" style={{ fontSize: '0.5625rem' }}>Featured</span>
              </div>
              <h2 className="t-h2 font-display">{hero.title}</h2>
              <p className="t-body truncate-3">{hero.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-3)', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <span>{hero.author}</span>
                <span>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={11} />{formatDate(hero.created_at)}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {rest.map(post => (
              <Link key={post.id} href={`/blog/${post.id}`} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', textDecoration: 'none' }}>
                {post.cover_url && (
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', background: 'var(--surface)' }}>
                    <img src={post.cover_url} alt={post.title} className="blog-cover-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                  </div>
                )}
                <div style={{ padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: catColors[post.category] ?? 'var(--gold)' }}>{post.category}</span>
                  <h3 className="t-h3 truncate-2" style={{ fontFamily: "'Playfair Display', serif" }}>{post.title}</h3>
                  <p className="t-small truncate-3" style={{ flex: 1 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                    <span>{post.author}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={11} />{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
