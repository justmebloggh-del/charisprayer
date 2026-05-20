import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import AudioSection from '@/components/home/AudioSection'
import VideoSection from '@/components/home/VideoSection'
import ScheduleSection from '@/components/home/ScheduleSection'
import TestimoniesSection from '@/components/home/TestimoniesSection'
import PrayerCTA from '@/components/home/PrayerCTA'
import FounderSection from '@/components/home/FounderSection'
import { createPublicClient } from '@/utils/supabase/public'

export const revalidate = 60
import type { Audio, Video, Testimony, LivestreamSettings } from '@/lib/types'

// Wraps any async call: resolves null on error OR after `ms` ms — never hangs.
async function safe<T>(fn: () => Promise<T>, ms = 1500): Promise<T | null> {
  return Promise.race<T | null>([
    (async () => { try { return await fn() } catch { return null } })(),
    new Promise<null>(res => setTimeout(() => res(null), ms)),
  ])
}

function Shell({ height = 400 }: { height?: number }) {
  return <div style={{ height, background: 'var(--canvas)' }} />
}

export default async function HomePage() {
  let audios: Audio[] = []
  let videos: Video[] = []
  let testimonies: Testimony[] = []
  let livestream: LivestreamSettings | null = null

  try {
    const supabase = createPublicClient()

    // All queries run in parallel, each capped at 3.5 s.
    const [a, v, t, s] = await Promise.all([
      safe<Audio[]>(async () => {
        const { data } = await supabase.from('audios').select('*').order('created_at', { ascending: false }).limit(12)
        return data ?? []
      }),
      safe<Video[]>(async () => {
        const { data } = await supabase.from('videos').select('*').eq('archived', false).order('featured', { ascending: false }).order('created_at', { ascending: false }).limit(6)
        return data ?? []
      }),
      safe<Testimony[]>(async () => {
        const { data } = await supabase.from('testimonies').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(6)
        return data ?? []
      }),
      safe<LivestreamSettings | null>(async () => {
        const { data } = await supabase.from('livestream_settings').select('*').eq('id', 1).single()
        return data ?? null
      }),
    ])

    if (a?.length) audios      = a
    if (v?.length) videos      = v
    if (t?.length) testimonies = t
    if (s)         livestream  = s
  } catch { /* components use built-in fallbacks */ }

  return (
    <>
      <Hero livestream={livestream} />

      <Suspense fallback={<Shell height={460} />}>
        <AudioSection tracks={audios.length ? audios : undefined} />
      </Suspense>

      <ScheduleSection />

      <Suspense fallback={<Shell height={460} />}>
        <VideoSection videos={videos.length ? videos : undefined} />
      </Suspense>

      <Suspense fallback={<Shell height={340} />}>
        <TestimoniesSection testimonies={testimonies.length ? testimonies : undefined} />
      </Suspense>

      <PrayerCTA />
      <FounderSection />
    </>
  )
}
