import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Devotion',
  description: 'Start each day with God — daily devotionals from Rev. Emmanuel Cosby Oduro and CHARIS PRAYER TIME Ministry.',
}

export default function DevotionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
