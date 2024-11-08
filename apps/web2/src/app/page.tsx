import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header'

export default function DashboardPage() {
  if (isAuthenticated()) {
    redirect('/dashboard')
  }

  redirect('/sign-in')
  return <Header />
}
