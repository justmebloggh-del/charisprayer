import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Devotion',
  description: 'Start each day with God — daily devotionals from Rev. Emmanuel Oduro Cosby and Charis Prayer Ministry.',
}

export default function DevotionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
