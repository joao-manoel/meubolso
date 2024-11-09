import { cookies } from 'next/headers'

import Breadcrumb from '@/components/breadcrumb'
import ExpensesPerCategory from '@/components/ExpensesPerCategory'
import LastTransactions from '@/components/last-transactions'
import NavigationDate from '@/components/navigation-date'
import SummaryCards from '@/components/summary-cards'
import { TransactionPieChart } from '@/components/transactions-pie-chart'
import { getTransactions } from '@/http/getTransactions'
import { walletSummary } from '@/transaction/transactions'

interface DashboardHomeProps {
  month: string
  year: string
}

export default async function DashboardHome({
  month,
  year,
}: DashboardHomeProps) {
  const walletId = cookies().get('wallet')?.value

  if (!walletId) {
    return <div>Selecione uma carteira</div>
  }

  const summary = await walletSummary({
    walletId,
    month,
    year,
  })

  const lastTransactions = await getTransactions({
    walletId,
    month,
    year,
    take: 10,
  })

  return (
    <>
      <header className="flex items-center justify-between px-5 py-5">
        <div>
          <Breadcrumb homeElement="Dashboard" />
        </div>
        <NavigationDate date={`${year}-${month}-01`} />
      </header>
      <div className="grid grid-cols-[2fr,1fr] gap-2 px-5">
        <div className="flex flex-col gap-6 overflow-hidden">
          <SummaryCards summary={summary} />
          <div className="grid-row-1 grid grid-cols-3 gap-6">
            <TransactionPieChart data={summary} />
            <ExpensesPerCategory
              expensesPerCategory={summary.categorySummary}
            />
          </div>
        </div>

        <div className="w-full">
          <LastTransactions lasTransactions={lastTransactions} />
        </div>
      </div>
    </>
  )
}
