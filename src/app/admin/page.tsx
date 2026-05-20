import { createClient } from '@/utils/supabase/server'
import AdminDashboard from './AdminDashboard'

export const metadata = { title: 'Admin Dashboard' }

async function safe<T>(fn: () => Promise<T>, ms = 2000): Promise<T | null> {
  return Promise.race<T | null>([
    (async () => { try { return await fn() } catch { return null } })(),
    new Promise<null>(res => setTimeout(() => res(null), ms)),
  ])
}

export default async function AdminPage() {
  const supabase = await createClient()

  const [prayers, testimonies, posts, audios, videos, devotions, livestreamData, scheduleData] = await Promise.all([
    safe(async () => { const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }); return data ?? [] }),
    safe(async () => { const { data } = await supabase.from('testimonies').select('*').order('created_at', { ascending: false }); return data ?? [] }),
    safe(async () => { const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }); return data ?? [] }),
    safe(async () => { const { data } = await supabase.from('audios').select('*').order('created_at', { ascending: false }); return data ?? [] }),
    safe(async () => { const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false }); return data ?? [] }),
    safe(async () => { const { data } = await supabase.from('devotions').select('*').order('created_at', { ascending: false }); return data ?? [] }),
    safe(async () => { const { data } = await supabase.from('livestream_settings').select('*').eq('id', 1).single(); return data ?? null }),
    safe(async () => { const { data } = await supabase.from('schedule_items').select('*').order('sort_order', { ascending: true }); return data ?? [] }),
  ])

  return (
    <AdminDashboard
      prayers={prayers ?? []}
      testimonies={testimonies ?? []}
      posts={posts ?? []}
      audios={audios ?? []}
      videos={videos ?? []}
      devotions={devotions ?? []}
      livestream={livestreamData ?? null}
      schedule={scheduleData ?? []}
    />
  )
}
