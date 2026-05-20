import { createClient } from '@supabase/supabase-js'

// Cookie-free Supabase client for public (non-auth) reads.
// Using this instead of the SSR client lets Next.js cache the page via `revalidate`.
// The SSR cookie client must still be used for auth-gated pages (admin).
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
  )
}
