import { createPublicClient } from '@/utils/supabase/public'

export const revalidate = 60
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Clock, Eye, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'
import type { BlogPost } from '@/lib/types'

interface Props { params: Promise<{ id: string }> }

// Mirrors the fallback in the listing page — same IDs, same data, with full content
const FALLBACK: BlogPost[] = [
  {
    id: '1',
    title: 'The Power of Persistent Prayer',
    excerpt: 'Jesus taught us that men ought always to pray and not faint. Discover why persistence in prayer moves the heart of God and how to build a daily prayer habit that transforms your life.',
    content: `<p>In Luke 18, Jesus told his disciples a parable to show them that they should always pray and not give up. A widow kept coming before an unjust judge until he finally granted her request. If persistence moved an unjust judge, how much more will it move a loving Father who longs to give good gifts to His children?</p>
<h2>Why Persistence Matters</h2>
<p>Persistent prayer is not about convincing God to change His mind. It is about aligning your heart with His will, deepening your trust in His timing, and demonstrating that your faith is not seasonal. Every prayer you pray is an act of faith — a declaration that you believe God hears you, that He is able, and that His word is true.</p>
<p>When the answer does not come immediately, do not interpret silence as refusal. Often, God is doing more in the unseen than you could ever imagine in the natural. He is preparing you for what He is preparing for you.</p>
<h2>Building a Daily Prayer Habit</h2>
<p>Start small. Five focused minutes of prayer are worth more than an hour of distracted religious ritual. Find a consistent time — early morning, before sleep, during a lunch break — and protect it. Over time, those five minutes will grow into twenty, then into a lifestyle.</p>
<p>Use Scripture as your foundation. Pray the Word back to God. When you pray His promises, you pray with confidence because you know you are praying according to His will.</p>
<p>Keep a prayer journal. Write down your requests and date them. As you look back over answered prayers, your faith will grow stronger for the unanswered ones still in process.</p>
<h2>The Promise of the Persistent</h2>
<p>James 5:16 declares that the effectual, fervent prayer of a righteous man avails much. This is your inheritance. Do not faint. Do not give up. Keep knocking, keep seeking, keep asking — for the God who called you to pray is faithful to answer.</p>`,
    category: 'Prayer',
    author: 'Rev. Emmanuel Cosby Oduro',
    status: 'published',
    views: 1840,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Faith That Moves Mountains',
    excerpt: 'A single mustard seed of faith is all it takes. Explore what real, mountain-moving faith looks like in everyday life and how you can activate it in your own situation.',
    content: `<p>Jesus said in Matthew 17:20, "If you have faith as small as a mustard seed, you can say to this mountain, 'Move from here to there,' and it will move. Nothing will be impossible for you." This is one of the most remarkable statements ever recorded. The Creator of the universe looked His disciples in the eye and told them that faith — even a tiny amount of genuine faith — makes nothing impossible.</p>
<h2>What Mountain-Moving Faith Is Not</h2>
<p>It is not the volume of your declaration. You can shout at a mountain all day long and nothing will happen if faith is absent. Mountain-moving faith is not about the energy of your words — it is about the substance behind them. Hebrews 11:1 defines faith as the substance of things hoped for, the evidence of things not seen. Faith is real. It is tangible in the spiritual realm even when invisible in the natural.</p>
<p>It is not presumption. Presumption says "I will do this because I want it." Faith says "I will receive this because God has promised it." The difference is everything. Always anchor your faith to the Word of God.</p>
<h2>Activating Your Faith Today</h2>
<p>First, identify the promise. What has God said in His Word about your situation? Find the scripture. Read it, meditate on it, speak it aloud. Faith comes by hearing, and hearing by the Word of God (Romans 10:17).</p>
<p>Second, act on what you believe. Faith without action is dead. The woman with the issue of blood pressed through the crowd. The ten lepers walked toward the priest before their healing manifested. Your action does not earn the miracle — it demonstrates that you believe one is coming.</p>
<p>Third, refuse fear. Fear is the opposite of faith. It is faith in the wrong direction — believing that the worst will happen instead of trusting that God is good. When fear rises, counter it with the Word. "God has not given me a spirit of fear, but of power, love, and a sound mind" (2 Timothy 1:7).</p>
<h2>Your Mountain Must Move</h2>
<p>Whatever mountain stands before you today — sickness, debt, broken relationships, unanswered prayers — it is subject to your faith-filled word. You are not speaking to the mountain because you have power. You are speaking because the God who spoke worlds into existence lives in you, and His authority backs every word you release in faith. Speak to your mountain. It must move.</p>`,
    category: 'Faith',
    author: 'Rev. Emmanuel Cosby Oduro',
    status: 'published',
    views: 2200,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: "Healing Is the Children's Bread",
    excerpt: "God's will for your healing is clear throughout all of scripture. Learn how to receive your healing through an unshakeable confidence in God's Word and His covenant of health.",
    content: `<p>In Matthew 15, a Canaanite woman came to Jesus desperate for her daughter's deliverance. Jesus responded with what seemed like a hard word: "It is not good to take the children's bread and throw it to the dogs." But the woman's faith seized upon the truth hidden in His words. She replied, "Yes, Lord, yet even the dogs eat the crumbs that fall from their masters' table." Jesus was moved. Her daughter was healed that same hour.</p>
<p>Do you see what Jesus called healing? The children's bread. Bread is not a luxury. It is sustenance. It belongs on the table. Healing is not a rare miracle reserved for the spiritual elite — it is the covenant right of every child of God.</p>
<h2>The Covenant of Health</h2>
<p>Exodus 15:26 records God's declaration: "I am the Lord who heals you." This is His name — Jehovah Rapha, the God who heals. This name was not given for a season. It is eternal. Isaiah 53:5 prophesies of Christ: "By His stripes we are healed." And 1 Peter 2:24 declares in the perfect tense — past completed action — "by His wounds you have been healed."</p>
<p>Your healing was purchased at the cross. It is already done in the spirit. The challenge is receiving what has already been provided. This is a matter of faith, not of earning or striving.</p>
<h2>How to Receive Your Healing</h2>
<p>Renew your mind with healing scriptures. Doubt cannot coexist with a Word-saturated mind. Read Psalm 103:1-5 aloud daily. Meditate on Isaiah 53:4-5. Let the truth about God's will for your health sink into your spirit until it becomes more real to you than any symptom.</p>
<p>Pray with confidence, not with begging. You are not asking God to do something He is reluctant to do. He already willed your healing two thousand years ago on Calvary. You are receiving what Christ has already purchased. Come boldly to the throne of grace (Hebrews 4:16).</p>
<p>Resist the spirit of infirmity. Luke 13 describes a woman bent over for eighteen years by a spirit of infirmity. Jesus said Satan had bound her. Sickness is not from God. Resist it the same way you would resist any attack of the enemy — with the Word, with prayer, and with unwavering faith.</p>
<h2>Your Healing Belongs to You</h2>
<p>Come to the table. The bread is set. Healing belongs to you as a child of God. Do not let symptoms or circumstances steal what Christ has already paid for. Receive it by faith, walk in it by the Word, and give God the glory for every victory.</p>`,
    category: 'Healing',
    author: 'Rev. Emmanuel Cosby Oduro',
    status: 'published',
    views: 1560,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Intercession: Standing in the Gap',
    excerpt: 'What does it mean to intercede for another person? This devotional explores the biblical foundations of intercession and how you can become an effective intercessor.',
    content: `<p>In Ezekiel 22:30, God searches for someone to stand in the gap: "I looked for someone among them who would build up the wall and stand before me in the gap on behalf of the land so I would not have to destroy it, but I found no one." That verse carries the weight of heaven. God was looking for an intercessor. The question for us today is: will He find one in you?</p>
<h2>What Is Intercession?</h2>
<p>Intercession is the act of praying on behalf of others. It is standing between the need of a person and the provision of God — becoming a bridge through which grace and mercy flow. The word itself comes from the Latin intercedere: to go between. An intercessor goes between. Between heaven and earth. Between God's power and human need.</p>
<p>Jesus is the ultimate intercessor. Romans 8:34 declares that He "is at the right hand of God and is also interceding for us." Hebrews 7:25 says He "always lives to intercede for them." Christ has not stopped praying. And He calls us to join Him in that ministry.</p>
<h2>The Weight of the Call</h2>
<p>Intercession is not casual prayer. It is burden-bearing prayer. Paul said in Romans 9 that he had great sorrow and unceasing anguish in his heart for his brothers. That is the heart of an intercessor — someone who feels the weight of another person's need so deeply that they cannot remain silent before God.</p>
<p>You do not have to manufacture this. Ask the Holy Spirit to give you a burden for intercession. He is the One who helps us in our weakness and intercedes through us with "groanings too deep for words" (Romans 8:26). When you yield to the Spirit in prayer, He will pray through you with precision and power.</p>
<h2>How to Intercede Effectively</h2>
<p>Pray Scripture. Find the promises that apply to the person you are interceding for and pray them back to God. "Lord, you said that if we confess with our mouths and believe in our hearts, we will be saved — I am standing on that promise for my brother."</p>
<p>Pray specifically. Vague prayers get vague results. Name the person. Name the need. Name the specific outcome you are believing for.</p>
<p>Persevere. Daniel prayed for 21 days before the answer broke through (Daniel 10). The battle in the heavenlies was real, but the breakthrough was certain. Do not give up before your answer arrives.</p>
<h2>Your Place at the Wall</h2>
<p>God is still looking for intercessors. Someone in your family, your workplace, your neighbourhood needs you to stand in the gap for them. Take your place at the wall. Heaven is watching, and God is responding to every prayer lifted in faith.</p>`,
    category: 'Intercession',
    author: 'Rev. Emmanuel Cosby Oduro',
    status: 'published',
    views: 1020,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'When God Seems Silent',
    excerpt: 'There are seasons when heaven feels distant and our prayers seem to bounce off the ceiling. This devotional helps you navigate the silence of God with faith and confidence.',
    content: `<p>Every person who has walked seriously with God has experienced it: the season of silence. You pray, and the heavens feel like brass. You open your Bible, and the words seem flat. You worship, and the presence you long for feels distant. You wonder — Has God forgotten me? Did I do something wrong? Is He even listening?</p>
<p>You are in good company. David wrote in Psalm 22: "My God, my God, why have you forsaken me? Why are you so far from saving me, so far from my cries of anguish? I cry out by day, but you do not answer, by night, but I find no rest." The man after God's own heart knew the silence. And yet he did not stop calling out to God.</p>
<h2>What the Silence Is Not</h2>
<p>The silence of God is not the absence of God. He promised in Hebrews 13:5, "Never will I leave you; never will I forsake you." This is an absolute promise. His presence does not fluctuate based on your emotional experience of it. The sun does not stop shining when clouds obscure it. God does not stop working when you cannot perceive it.</p>
<p>The silence is not punishment. Though there are times God allows seasons of waiting to refine and mature us, the silence is not God withholding Himself as a consequence for your failures. He is the Father who runs toward the returning prodigal — He does not hide from repentant hearts.</p>
<h2>What to Do in the Silence</h2>
<p>Keep praying. Do not let silence stop you from speaking to God. This is where persistence becomes everything. The silence is your training ground. Keep showing up. Keep speaking. Your faithfulness in the silence is building a muscle of faith that seasons of breakthrough cannot produce.</p>
<p>Remember His faithfulness. Psalm 77:11-12 records the practice of Asaph in a dark season: "I will remember the deeds of the Lord; yes, I will remember your miracles of long ago." Pull out your journals. Recall the answered prayers, the divine moments, the times He came through against all odds. Faith is fuelled by remembrance.</p>
<p>Trust His character. You may not understand what He is doing, but you know who He is. He is good (Psalm 34:8). He is faithful (Lamentations 3:22-23). He works all things together for the good of those who love Him (Romans 8:28). These truths are not contingent on your circumstances.</p>
<h2>The Breakthrough Is Coming</h2>
<p>Weeping may endure for a night, but joy comes in the morning (Psalm 30:5). The silence always breaks. It is not the end of the story — it is part of it. Hold on. Your morning is coming, and when it does, the silence will make the sound of His voice even sweeter.</p>`,
    category: 'Faith',
    author: 'Rev. Emmanuel Cosby Oduro',
    status: 'published',
    views: 3100,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'The Grace to Begin Again',
    excerpt: "Grace is not just unmerited favour — it is the divine enabling to start fresh. No matter where you are today, God's grace is sufficient to give you a new beginning.",
    content: `<p>One of the most liberating truths in all of Scripture is this: God is the God of the second chance. And the third. And the four hundredth. His grace does not have a limit because His love does not have an end. Lamentations 3:22-23 declares with wonder: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning."</p>
<p>New every morning. Not recycled. Not diminished. Fresh. Unprecedented. The mercies of tomorrow have not yet been spent on today. There is grace waiting for you in the morning that you have never touched before.</p>
<h2>Grace as Divine Enabling</h2>
<p>We often think of grace only as unmerited favour — forgiveness we did not deserve. And that is absolutely true. But grace is also a divine empowerment. The Greek word charis — grace — carries within it the idea of divine ability imparted to human weakness. When Paul said, "My grace is sufficient for you, for my power is made perfect in weakness" (2 Corinthians 12:9), God was not just offering comfort. He was offering capability.</p>
<p>Grace enables you to do what you cannot do on your own. It does not simply forgive the past — it equips you for the future. You do not just receive grace to cover your failures; you receive grace to become the person God designed you to be.</p>
<h2>How to Access Grace for a New Beginning</h2>
<p>Come honestly. Grace flows toward the humble. James 4:6 says "God opposes the proud but shows favour to the humble." You do not need to have everything together before you come to God. Come exactly as you are — broken, tired, ashamed, confused — and let Him meet you there.</p>
<p>Receive forgiveness fully. Do not carry what Christ has already carried. 1 John 1:9 is a settled promise: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness." Notice — He does not say He will forgive most of your sins, or forgive the manageable ones. All unrighteousness. Receive it completely.</p>
<p>Take the first step. A new beginning requires movement. Grace gives you the desire and the ability to move (Philippians 2:13), but you must take the step. Start the new habit. Make the call. Send the message. Write the first page. Whatever your new beginning looks like, take one step today.</p>
<h2>Your Story Is Not Over</h2>
<p>No matter what chapter you are closing, God has more pages left to write. He is the author and finisher of your faith (Hebrews 12:2). He began a good work in you, and He is faithful to complete it (Philippians 1:6). The grace to begin again is not just available — it is abundant, overflowing, and waiting for you today.</p>`,
    category: 'Grace',
    author: 'Rev. Emmanuel Cosby Oduro',
    status: 'published',
    views: 2480,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const catColors: Record<string, string> = {
  Prayer: '#F59E0B', Faith: '#3B82F6', Healing: '#10B981',
  Intercession: '#EF4444', Grace: '#818CF8', Worship: '#EC4899',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const fallback = FALLBACK.find(p => p.id === id)
  try {
    const supabase = createPublicClient()
    const result = await Promise.race([
      supabase.from('blog_posts').select('title, excerpt').eq('id', id).single().then((r: { data: { title: string; excerpt: string } | null }) => r.data),
      new Promise<null>(res => setTimeout(() => res(null), 1500)),
    ])
    if (result) return { title: result.title, description: result.excerpt ?? undefined }
  } catch {}
  return fallback
    ? { title: fallback.title, description: fallback.excerpt }
    : { title: 'Devotional' }
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params

  let post: BlogPost | null = null
  let dbPost: BlogPost | null = null

  try {
    const supabase = createPublicClient()
    dbPost = await Promise.race([
      supabase.from('blog_posts').select('*').eq('id', id).eq('status', 'published').single().then((r: { data: BlogPost | null }) => r.data),
      new Promise<null>(res => setTimeout(() => res(null), 1500)),
    ])
  } catch {}

  post = dbPost ?? FALLBACK.find(p => p.id === id) ?? null

  if (!post) notFound()

  // Siblings for prev/next
  let siblings: { id: string; title: string }[] = []
  try {
    if (dbPost) {
      const supabase = createPublicClient()
      const result = await Promise.race([
        supabase.from('blog_posts').select('id, title').eq('status', 'published').order('created_at', { ascending: false }).limit(20).then((r: { data: { id: string; title: string }[] | null }) => r.data ?? []),
        new Promise<{ id: string; title: string }[]>(res => setTimeout(() => res([]), 1200)),
      ])
      siblings = result ?? []
    }
  } catch {}

  if (!siblings.length) siblings = FALLBACK.map(p => ({ id: p.id, title: p.title }))

  const idx = siblings.findIndex(s => s.id === id)
  const prevPost = idx > 0 ? siblings[idx - 1] : null
  const nextPost = idx < siblings.length - 1 ? siblings[idx + 1] : null

  const color = catColors[post.category] ?? 'var(--gold)'

  // Fire-and-forget view increment (only for real DB rows)
  if (dbPost) {
    import('@/utils/supabase/public').then(({ createPublicClient: mkClient }) => {
      const supabase = mkClient()
      supabase.from('blog_posts').update({ views: (post!.views ?? 0) + 1 }).eq('id', id)
    }).catch(() => {})
  }

  return (
    <div className="section-spacing">
      <div className="site-container-sm">

        <Link href="/blog" className="blog-back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-3)', marginBottom: '2.5rem', transition: 'color 0.15s' }}>
          <ArrowLeft size={15} /> Back to Devotionals
        </Link>

        <article>
          {/* Category */}
          <span style={{ display: 'inline-block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color, marginBottom: '1.25rem' }}>
            {post.category}
          </span>

          <h1 className="t-h1 font-display" style={{ marginBottom: '1.25rem', maxWidth: '700px' }}>{post.title}</h1>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={14} style={{ color: 'var(--gold)' }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)' }}>{post.author}</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-3)' }}>
              <Clock size={13} /> {formatDate(post.created_at)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-3)' }}>
              <Eye size={13} /> {(post.views + (dbPost ? 1 : 0)).toLocaleString()} views
            </span>
          </div>

          {/* Cover image */}
          {post.cover_url && (
            <div style={{ width: '100%', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: '460px' }}>
              <img src={post.cover_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Excerpt pull-quote */}
          <div style={{
            background: 'linear-gradient(135deg, var(--card), rgba(79,70,229,0.04))',
            border: '1px solid var(--border-gold)', borderLeft: `4px solid ${color}`,
            borderRadius: 'var(--r)', padding: '1.5rem 1.75rem', marginBottom: '2.5rem',
          }}>
            <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontStyle: 'italic', fontSize: '1.125rem', color: 'var(--text-2)', lineHeight: 1.8 }}>
              {post.excerpt}
            </p>
          </div>

          {/* Body */}
          <div
            className="prose-ministry"
            style={{ fontSize: '1.0625rem', lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }}
          />
        </article>

        {/* CTA */}
        <div style={{
          marginTop: '3.5rem', padding: '2rem 2.5rem',
          background: 'linear-gradient(135deg, var(--card), rgba(79,70,229,0.04))',
          border: '1px solid var(--border-gold)', borderRadius: 'var(--r-xl)',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: '1.25rem', color: 'var(--text)' }}>
            Has this devotional spoken to you?
          </p>
          <p className="t-body">
            Share your heart with our prayer team — we stand with you in faith for every need.
          </p>
          <Link href="/prayer-request" className="btn btn-gold" style={{ alignSelf: 'flex-start' }}>
            Submit a Prayer Request
          </Link>
        </div>

        {/* Prev / Next */}
        {(prevPost || nextPost) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
            {prevPost ? (
              <Link href={`/blog/${prevPost.id}`} className="blog-nav-link" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', padding: '1.125rem 1.375rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', transition: 'border-color 0.15s' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>← Previous</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }} className="truncate-2">{prevPost.title}</span>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link href={`/blog/${nextPost.id}`} className="blog-nav-link" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', padding: '1.125rem 1.375rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', textAlign: 'right', transition: 'border-color 0.15s' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next →</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }} className="truncate-2">{nextPost.title}</span>
              </Link>
            ) : <div />}
          </div>
        )}
      </div>

      <style>{`.blog-nav-link:hover { border-color: var(--border-gold) !important; }`}</style>
    </div>
  )
}
