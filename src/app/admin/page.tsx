import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import { logout } from '@/app/login/actions'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Format the user object for the AdminDashboard
  const formattedUser = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || 'Admin User',
    role: user.user_metadata?.role || 'admin',
  }

  return <AdminDashboard user={formattedUser} onLogout={logout} />
}
