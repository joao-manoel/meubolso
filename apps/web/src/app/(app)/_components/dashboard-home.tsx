import { cookies } from 'next/headers'

import Breadcrumb from '@/components/breadcrumb'
import CreateCardForm from '@/components/create-card-form'
import CreatePersonalWalletForm from '@/components/create-wallet-form'
import ExpensesPerCategory from '@/components/expenses-per-category'
import LastTransactions from '@/components/last-transactions'
import NavigationDate from '@/components/navigation-date'
import SummaryCards from '@/components/summary-cards'
import { TransactionPieChart } from '@/components/transactions-pie-chart'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { getWallet } from '@/http/get-wallet'
import { getWallets } from '@/http/get-wallets'
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

  const wallets = await getWallets()

  if (wallets.length < 1) {
    return (
      <div className="flex h-screen-content items-center justify-center">
        <Card className="flex flex-col items-center justify-center space-y-2 p-10">
          <CardTitle>Vamos criar sua carteira!</CardTitle>
          <CardContent>
            <CreatePersonalWalletForm />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!walletId) {
    return (
      <div className="flex h-screen-content items-center justify-center">
        <p>Selecione uma carteira.</p>
      </div>
    )
  }

  const wallet = await getWallet(walletId)

  if (wallet.card.length < 1) {
    return (
      <div className="flex h-screen-content items-center justify-center">
        <CreateCardForm />
      </div>
    )
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
      <div className="grid grid-cols-[2fr,1fr] gap-6">
        <div className="flex flex-col gap-6">
          <SummaryCards summary={summary} />
          <div className="grid-row-1 grid grid-cols-3 gap-6">
            <TransactionPieChart data={summary} />
            <ExpensesPerCategory
              expensesPerCategory={summary.categorySummary}
            />
          </div>
        </div>

        <div className="h-full w-full">
          <LastTransactions
            lasTransactions={lastTransactions}
            month={month}
            year={year}
          />
        </div>
      </div>
    </>
  )
}
