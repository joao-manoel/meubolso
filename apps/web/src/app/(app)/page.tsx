import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'

import Header from '@/components/header'

import DashboardHome from './_components/dashboard-home'

interface HomeProps {
  searchParams: { month: string; year: string }
}

export default async function DashboardPage({
  searchParams: { month, year },
}: HomeProps) {
  const monthIsInvalid = !month || !isMatch(month, 'MM')

  const date = new Date()

  const currentMonth =
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1

  if (monthIsInvalid) {
    redirect(`/?month=${currentMonth}&year=${date.getFullYear().toString()}`)
  }

  return (
    <div className="py-4">
      <Header />
      <main className="flex flex-col overflow-hidden">
        <DashboardHome month={month} year={year} />
      </main>
    </div>
  )
}
