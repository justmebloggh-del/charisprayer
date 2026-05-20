import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import AudioSection from '@/components/home/AudioSection'
import VideoSection from '@/components/home/VideoSection'
import ScheduleSection from '@/components/home/ScheduleSection'
import TestimoniesSection from '@/components/home/TestimoniesSection'
import PrayerCTA from '@/components/home/PrayerCTA'
import FounderSection from '@/components/home/FounderSection'

function Shell({ height = 400 }: { height?: number }) {
  return <div style={{ height, background: 'var(--canvas)' }} />
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<Shell height={460} />}>
        <AudioSection />
      </Suspense>

      <ScheduleSection />

      <Suspense fallback={<Shell height={460} />}>
        <VideoSection />
      </Suspense>

      <Suspense fallback={<Shell height={340} />}>
        <TestimoniesSection />
      </Suspense>

      <PrayerCTA />
      <FounderSection />
    </>
  )
}
