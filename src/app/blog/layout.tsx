import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devotionals',
  description: 'Faith-building articles and devotionals from Charis Prayer Ministry.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
