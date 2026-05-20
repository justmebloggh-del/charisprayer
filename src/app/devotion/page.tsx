'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookHeart, Clock, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Devotion } from '@/lib/types'

const FALLBACK: Devotion[] = [
  {
    id: '1', title: 'The Faithfulness of God in Every Season', scripture_reference: 'Lamentations 3:22-23',
    scripture_text: 'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.',
    message: '<p>Every morning you wake up is a declaration of God\'s faithfulness. His mercies are not worn out or depleted — they are freshly given to you today.</p><p>Whatever yesterday looked like, this morning carries new grace, new strength, and new opportunity to encounter the living God. Do not let the weight of yesterday steal the gift of today.</p>',
    excerpt: "Every morning you wake up is a declaration of God's faithfulness. His mercies are not worn out — they are freshly given to you today.",
    author: 'Rev. Emmanuel Cosby Oduro', published: true, featured: true, views: 3240,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2', title: 'When You Feel Overwhelmed, Pray', scripture_reference: 'Philippians 4:6-7',
    scripture_text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.',
    message: '<p>Anxiety is real, but it does not have to be your final address. God invites you to bring every burden, every fear, every unanswered question into His presence.</p>',
    excerpt: 'Anxiety is real, but it does not have to be your final address. God invites you to bring every burden into His presence.',
    author: 'Rev. Emmanuel Cosby Oduro', published: true, featured: false, views: 2100,
    created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3', title: 'The Power of a Surrendered Heart', scripture_reference: 'Romans 12:1',
    scripture_text: 'I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship.',
    message: '<p>True worship begins not with a song, but with surrender. When you lay your life — your plans, your desires, your agenda — at the feet of Jesus, something supernatural happens.</p>',
    excerpt: 'True worship begins not with a song, but with surrender. When you lay your life at the feet of Jesus, something supernatural happens.',
    author: 'Rev. Emmanuel Cosby Oduro', published: true, featured: false, views: 1870,
    created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '4', title: "God's Promises Are Still Standing", scripture_reference: '2 Corinthians 1:20',
    scripture_text: 'For all the promises of God find their Yes in him. That is why it is through him that we utter our Amen to God for his glory.',
    message: '<p>Every promise God has ever made to you is secured in Jesus Christ. Not one word has fallen to the ground. Not one covenant has been broken.</p>',
    excerpt: 'Every promise God has ever made to you is secured in Jesus Christ. Not one word has fallen to the ground.',
    author: 'Rev. Emmanuel Cosby Oduro', published: true, featured: false, views: 1520,
    created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '5', title: 'Standing in the Gap for Others', scripture_reference: 'Ezekiel 22:30',
    scripture_text: 'I looked for someone among them who would build up the wall and stand before me in the gap on behalf of the land so I would not have to destroy it.',
    message: '<p>Intercession is one of the highest callings in the Kingdom of God. To stand before the Lord on behalf of others is a holy and powerful act of love.</p>',
    excerpt: 'Intercession is one of the highest callings in the Kingdom. To stand before the Lord on behalf of others is a holy act of love.',
    author: 'Rev. Emmanuel Cosby Oduro', published: true, featured: false, views: 1200,
    created_at: new Date(Date.now() - 345600000).toISOString(), updated_at: new Date().toISOString(),
  },
]

export default function DevotionPage() {
  const [devotions, setDevotions] = useState<Devotion[]>(FALLBACK)

  useEffect(() => {
    ;(async () => {
      try {
        const { createPublicClient } = await import('@/utils/supabase/public')
        const supabase = createPublicClient()
        const { data } = await supabase
          .from('devotions')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
        if (data && data.length > 0) setDevotions(data as Devotion[])
      } catch {}
    })()
  }, [])

  const [featured, ...rest] = devotions

  return (
    <div className="section-spacing">
      <div className="site-container">

        {/* Page header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <BookHeart size={24} style={{ color: 'var(--gold)' }} />
          </div>
          <span className="section-label">Daily Devotion</span>
          <h1 className="t-h1 font-display">Start Your Day with God</h1>
          <p className="t-body" style={{ maxWidth: '460px' }}>
            Receive fresh inspiration, scripture, and prayerful reflection each morning from CHARIS PRAYER TIME Ministry.
          </p>
        </div>

        {/* Today&apos;s featured devotion */}
        {featured && (
          <Link href={`/devotion/${featured.id}`} style={{ display: 'block', textDecoration: 'none', marginBottom: '2.5rem' }}>
            <div className="card devotion-featured-card" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {/* Image / visual */}
              <div style={{ minHeight: '260px', background: 'linear-gradient(135deg, var(--surface), var(--card))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {featured.featured_image_url ? (
                  <Image
                    src={featured.featured_image_url}
                    alt={featured.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                    <BookHeart size={52} style={{ color: 'var(--gold)', opacity: 0.6 }} />
                    <blockquote style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.7, maxWidth: '300px' }}>
                      &ldquo;{featured.scripture_text?.slice(0, 100)}…&rdquo;
                    </blockquote>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(201,162,39,0.9)', padding: '4px 12px', borderRadius: '999px' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#000', letterSpacing: '0.08em' }}>TODAY&apos;S DEVOTION</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.125rem', justifyContent: 'center' }}>
                {featured.scripture_reference && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{featured.scripture_reference}</span>
                )}
                <h2 className="t-h2 font-display">{featured.title}</h2>
                <p className="t-body truncate-3">{featured.excerpt || featured.message.replace(/<[^>]+>/g, '').slice(0, 180)}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--text-3)' }}>
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{formatDate(featured.created_at)}</span>
                </div>

                <span className="btn btn-gold" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                  <BookOpen size={15} /> Read Devotion
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Archive grid */}
        {rest.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
              Previous Devotions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {rest.map(d => (
                <Link key={d.id} href={`/devotion/${d.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="card devotion-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {d.featured_image_url && (
                      <div style={{ width: '100%', height: '140px', borderRadius: 'var(--r)', overflow: 'hidden', background: 'var(--surface)', flexShrink: 0 }}>
                        <img src={d.featured_image_url} alt={d.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="blog-cover-img" />
                      </div>
                    )}
                    {d.scripture_reference && (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{d.scripture_reference}</span>
                    )}
                    <h3 className="t-h3 truncate-2" style={{ fontFamily: "'Playfair Display', serif" }}>{d.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.7, flex: 1 }} className="truncate-3">
                      {d.excerpt || d.message.replace(/<[^>]+>/g, '').slice(0, 140)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                      <span>{d.author}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} />{formatDate(d.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .devotion-featured-card { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
        .devotion-featured-card:hover { border-color: var(--border-gold); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .devotion-card { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
        .devotion-card:hover { border-color: var(--border-gold); box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
      `}</style>
    </div>
  )
}
