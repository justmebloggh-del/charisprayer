import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, BookHeart, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import type { Devotion } from '@/lib/types'

export const revalidate = 60

interface Props { params: Promise<{ id: string }> }

// Shared fallback — matches the IDs used on the listing page
const FALLBACK: Devotion[] = [
  {
    id: '1', title: 'The Faithfulness of God in Every Season',
    scripture_reference: 'Lamentations 3:22-23',
    scripture_text: 'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.',
    message: '<p>Every morning you wake up is a declaration of God\'s faithfulness. His mercies are not worn out or depleted — they are freshly given to you today.</p><p>Whatever yesterday looked like, this morning carries new grace, new strength, and new opportunity to encounter the living God. Do not let the weight of yesterday steal the gift of today.</p><p>Let this truth anchor your heart: the God who was faithful yesterday is faithful right now. He has not changed His mind about you. He has not walked away. His love is not contingent on your performance — it is rooted in His eternal character.</p>',
    excerpt: "Every morning you wake up is a declaration of God's faithfulness. His mercies are not worn out — they are freshly given to you today.",
    author: 'Rev. Emmanuel Oduro Cosby', published: true, featured: true, views: 3240,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2', title: 'When You Feel Overwhelmed, Pray',
    scripture_reference: 'Philippians 4:6-7',
    scripture_text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.',
    message: '<p>Anxiety is real, but it does not have to be your final address. God invites you to bring every burden, every fear, every unanswered question into His presence.</p><p>Notice the instruction: in everything — not just the big things, but every little concern that weighs on your heart. God is interested in the details of your life. He cares about what keeps you up at night.</p><p>And when you pray, add thanksgiving. Not because everything is perfect, but because you serve a God who is bigger than your circumstances.</p>',
    excerpt: 'Anxiety is real, but it does not have to be your final address. God invites you to bring every burden into His presence.',
    author: 'Rev. Emmanuel Oduro Cosby', published: true, featured: false, views: 2100,
    created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3', title: 'The Power of a Surrendered Heart',
    scripture_reference: 'Romans 12:1',
    scripture_text: 'I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship.',
    message: '<p>True worship begins not with a song, but with surrender. When you lay your life — your plans, your desires, your agenda — at the feet of Jesus, something supernatural happens.</p><p>Surrender is not weakness. It is the strongest act of faith you can make. It declares: "God, I trust You more than I trust my own understanding."</p>',
    excerpt: 'True worship begins not with a song, but with surrender. When you lay your life at the feet of Jesus, something supernatural happens.',
    author: 'Rev. Emmanuel Oduro Cosby', published: true, featured: false, views: 1870,
    created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '4', title: "God's Promises Are Still Standing",
    scripture_reference: '2 Corinthians 1:20',
    scripture_text: 'For all the promises of God find their Yes in him. That is why it is through him that we utter our Amen to God for his glory.',
    message: '<p>Every promise God has ever made to you is secured in Jesus Christ. Not one word has fallen to the ground. Not one covenant has been broken.</p><p>When you feel like the promise is delayed, remember: delay is not denial. God is working behind the scenes to align all things for your good and His glory.</p>',
    excerpt: 'Every promise God has ever made to you is secured in Jesus Christ. Not one word has fallen to the ground.',
    author: 'Rev. Emmanuel Oduro Cosby', published: true, featured: false, views: 1520,
    created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '5', title: 'Standing in the Gap for Others',
    scripture_reference: 'Ezekiel 22:30',
    scripture_text: 'I looked for someone among them who would build up the wall and stand before me in the gap on behalf of the land so I would not have to destroy it.',
    message: '<p>Intercession is one of the highest callings in the Kingdom of God. To stand before the Lord on behalf of others is a holy and powerful act of love.</p><p>When you intercede, you become a bridge between heaven and the need. You carry someone else\'s burden into the presence of a God who hears, who sees, and who acts.</p>',
    excerpt: 'Intercession is one of the highest callings in the Kingdom. To stand before the Lord on behalf of others is a holy act of love.',
    author: 'Rev. Emmanuel Oduro Cosby', published: true, featured: false, views: 1200,
    created_at: new Date(Date.now() - 345600000).toISOString(), updated_at: new Date().toISOString(),
  },
]

async function getDevotionAndSiblings(id: string): Promise<{ devotion: Devotion | null; siblings: { id: string; title: string }[] }> {
  try {
    const { createPublicClient } = await import('@/utils/supabase/public')
    const supabase = createPublicClient()

    const timeout = new Promise<null>(res => setTimeout(() => res(null), 1500))

    const [devotionResult, siblingsResult] = await Promise.all([
      Promise.race([
        supabase.from('devotions').select('*').eq('id', id).eq('published', true).single().then((r: { data: Devotion | null }) => r.data),
        timeout,
      ]),
      Promise.race([
        supabase.from('devotions').select('id, title').eq('published', true).order('created_at', { ascending: false }).limit(20).then((r: { data: { id: string; title: string }[] | null }) => r.data ?? []),
        timeout.then(() => []),
      ]),
    ])

    return {
      devotion: devotionResult as Devotion | null,
      siblings: (siblingsResult ?? []) as { id: string; title: string }[],
    }
  } catch {
    return { devotion: null, siblings: [] }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const fallback = FALLBACK.find(d => d.id === id)
  try {
    const { createPublicClient } = await import('@/utils/supabase/public')
    const supabase = createPublicClient()
    const { data } = await supabase.from('devotions').select('title, excerpt').eq('id', id).single()
    if (data) return { title: (data as { title: string; excerpt?: string }).title, description: (data as { title: string; excerpt?: string }).excerpt ?? undefined }
  } catch {}
  return fallback ? { title: fallback.title, description: fallback.excerpt ?? undefined } : { title: 'Daily Devotion' }
}

export default async function DevotionPostPage({ params }: Props) {
  const { id } = await params

  const { devotion: dbDevotion, siblings: dbSiblings } = await getDevotionAndSiblings(id)

  // Fall back to sample data if DB not available
  const devotion: Devotion | null = dbDevotion ?? FALLBACK.find(d => d.id === id) ?? null
  const siblings = dbSiblings.length > 0
    ? dbSiblings
    : FALLBACK.map(d => ({ id: d.id, title: d.title }))

  if (!devotion) notFound()

  // Fire-and-forget view increment (only for real DB rows)
  if (dbDevotion) {
    import('@/utils/supabase/public').then(({ createPublicClient: mkClient }) => {
      const supabase = mkClient()
      supabase.from('devotions').update({ views: (devotion.views ?? 0) + 1 }).eq('id', id)
    }).catch(() => {})
  }

  const idx = siblings.findIndex(d => d.id === id)
  const prevDevotion = idx > 0 ? siblings[idx - 1] : null
  const nextDevotion = idx < siblings.length - 1 ? siblings[idx + 1] : null

  return (
    <div className="section-spacing">
      <div className="site-container-sm">

        <Link href="/devotion" className="blog-back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-3)', marginBottom: '2.5rem', transition: 'color 0.15s' }}>
          <ArrowLeft size={15} /> Back to Devotions
        </Link>

        <article>
          {devotion.scripture_reference && (
            <span style={{ display: 'inline-block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>
              {devotion.scripture_reference}
            </span>
          )}

          <h1 className="t-h1 font-display" style={{ marginBottom: '1.25rem', maxWidth: '700px' }}>{devotion.title}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookHeart size={14} style={{ color: 'var(--gold)' }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)' }}>{devotion.author}</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-3)' }}>
              <Clock size={13} /> {formatDate(devotion.created_at)}
            </span>
          </div>

          {devotion.featured_image_url && (
            <div style={{ width: '100%', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: '420px', position: 'relative', aspectRatio: '16/7' }}>
              <Image
                src={devotion.featured_image_url}
                alt={devotion.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          )}

          {devotion.scripture_text && (
            <div style={{
              background: 'linear-gradient(135deg, var(--card), rgba(201,162,39,0.04))',
              border: '1px solid var(--border-gold)', borderLeft: '4px solid var(--gold)',
              borderRadius: 'var(--r)', padding: '1.5rem 1.75rem', marginBottom: '2.5rem',
            }}>
              <blockquote style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontStyle: 'italic', fontSize: '1.125rem', color: 'var(--text-2)', lineHeight: 1.8 }}>
                &ldquo;{devotion.scripture_text}&rdquo;
              </blockquote>
              {devotion.scripture_reference && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gold)' }}>— {devotion.scripture_reference}</p>
              )}
            </div>
          )}

          <div
            className="prose-ministry"
            style={{ fontSize: '1.0625rem', lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: devotion.message || `<p>${devotion.excerpt ?? ''}</p>` }}
          />
        </article>

        {/* Prayer CTA */}
        <div style={{
          marginTop: '3.5rem', padding: '2rem 2.5rem',
          background: 'linear-gradient(135deg, var(--card), rgba(201,162,39,0.04))',
          border: '1px solid var(--border-gold)', borderRadius: 'var(--r-xl)',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: '1.25rem', color: 'var(--text)' }}>
            A Prayer for Today
          </p>
          <p className="t-body">
            Lord, let your Word take root in my heart today. Give me the strength to walk in faith and the grace to trust you in every season. Amen.
          </p>
          <Link href="/prayer-request" className="btn btn-gold" style={{ alignSelf: 'flex-start' }}>
            Submit a Prayer Request
          </Link>
        </div>

        {/* Prev / Next */}
        {(prevDevotion || nextDevotion) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
            {prevDevotion ? (
              <Link href={`/devotion/${prevDevotion.id}`} className="devotion-nav-link" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', padding: '1.125rem 1.375rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', transition: 'border-color 0.15s' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>← Previous</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }} className="truncate-2">{prevDevotion.title}</span>
              </Link>
            ) : <div />}
            {nextDevotion ? (
              <Link href={`/devotion/${nextDevotion.id}`} className="devotion-nav-link" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', padding: '1.125rem 1.375rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', textAlign: 'right', transition: 'border-color 0.15s' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next →</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }} className="truncate-2">{nextDevotion.title}</span>
              </Link>
            ) : <div />}
          </div>
        )}
      </div>

      <style>{`.devotion-nav-link:hover { border-color: var(--border-gold) !important; }`}</style>
    </div>
  )
}
