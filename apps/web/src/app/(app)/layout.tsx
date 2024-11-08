import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/sign-in')
  }
  return <div className="">{children}</div>
}
