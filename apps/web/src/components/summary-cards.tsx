import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react'

import { GetSummaryResponse } from '@/http/get-summary'

import SummaryCard from './summary-card'

interface SummaryCardProps {
  summary: GetSummaryResponse
}

export default function SummaryCards({ summary }: SummaryCardProps) {
  return (
    <div className="space-y-6">
      <SummaryCard
        title="Saldo"
        icon={<WalletIcon size={16} />}
        amount={summary.balanceTotalAmount}
        size="large"
        isLoading={false}
      />

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          title="Investido"
          icon={<PiggyBankIcon size={14} />}
          amount={summary.investmentTotalAmount}
          isLoading={false}
        />
        <SummaryCard
          title="Receita"
          icon={<TrendingUpIcon size={14} className="text-green-500" />}
          amount={summary.incomeTotalAmount}
          isLoading={false}
        />
        <SummaryCard
          title="Despesa"
          icon={<TrendingDownIcon size={14} className="text-red-500" />}
          amount={summary.expensesTotalAmount}
          isLoading={false}
        />
      </div>
    </div>
  )
}
