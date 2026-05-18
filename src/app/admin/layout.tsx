import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Charis Prayer',
  description: 'Manage Charis Prayer platform',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
