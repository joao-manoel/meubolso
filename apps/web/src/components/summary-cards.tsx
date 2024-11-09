'use client'
import { useQuery } from '@tanstack/react-query'
import { addMonths, subMonths } from 'date-fns'
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react'
import { useState } from 'react'

import { getBalances } from '@/http/get-balance'

import Breadcrumb from './breadcrumb'
import NavigationMonth from './navigation-month'
import SummaryCard from './summary-card'
import { TransactionPieChart } from './transactions-pie-chart'

export default function SummaryCards({ walletId }: { walletId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', walletId, currentDate],
    queryFn: () => getBalances({ walletId, date: currentDate.toString() }),
    enabled: !!walletId,
  })

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1))
  }

  return (
    <>
      <header className="flex items-center justify-between px-5 py-5">
        <div>
          <Breadcrumb homeElement="Dashboard" />
        </div>
        <NavigationMonth
          currentDate={currentDate}
          handleNextMonth={handleNextMonth}
          handlePreviousMonth={handlePreviousMonth}
        />
      </header>
      <div className="grid grid-cols-[2fr,1fr] px-5">
        <div className="space-y-6">
          <div className="space-y-6">
            <SummaryCard
              title="Saldo"
              icon={<WalletIcon size={16} />}
              amount={data?.balanceAmount || 0}
              size="large"
              isLoading={isLoading}
            />

            <div className="grid grid-cols-3 gap-6">
              <SummaryCard
                title="Investido"
                icon={<PiggyBankIcon size={14} />}
                amount={data?.investmentAmount || 0}
                isLoading={isLoading}
              />
              <SummaryCard
                title="Receita"
                icon={<TrendingUpIcon size={14} className="text-green-500" />}
                amount={data?.incomeAmount || 0}
                isLoading={isLoading}
              />
              <SummaryCard
                title="Despesa"
                icon={<TrendingDownIcon size={14} className="text-red-500" />}
                amount={data?.expensesAmount || 0}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="grid-row-1 grid grid-cols-3 gap-6">
            {data && (
              <TransactionPieChart
                expensesAmount={data?.expensesAmount || 0}
                incomeAmount={data?.incomeAmount || 0}
                investmentsTotal={data?.investmentAmount || 0}
              />
            )}
          </div>
        </div>

        <div className="w-full">asdsd</div>
      </div>
    </>
  )
}
