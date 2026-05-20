import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { AudioProvider } from '@/context/AudioContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GlobalAudioPlayer from '@/components/ui/GlobalAudioPlayer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Charis Prayer', template: '%s | Charis Prayer' },
  description: 'Where Grace Meets Prayer — A global prayer ministry led by Rev. Emmanuel Oduro Cosby.',
  keywords: ['prayer', 'ministry', 'church', 'devotional', 'intercession', 'worship', 'livestream'],
  openGraph: {
    type: 'website',
    siteName: 'Charis Prayer',
    description: 'Where Grace Meets Prayer — Daily prayer, devotions, and worship.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
      </head>
      <body>
        <AudioProvider>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>{children}</main>
          <Footer />
          <GlobalAudioPlayer />
        </AudioProvider>
      </body>
    </html>
  )
}
