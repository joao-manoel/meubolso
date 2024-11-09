'use client'

import { PiggyBank, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { Pie, PieChart } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { GetSummaryResponse } from '@/http/get-summary'

import PercentageItem from './percentage-item'

enum TransactionType {
  INVESTMENT = 'INVESTMENT',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

type TransactionPercentageType = {
  [key in TransactionType]: number
}

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: 'Investido ',
    color: '#FFFFFF',
  },
  [TransactionType.INCOME]: {
    label: 'Receitas ',
    color: '#55b02e',
  },
  [TransactionType.EXPENSE]: {
    label: 'Despesas ',
    color: '#e93030',
  },
} satisfies ChartConfig

interface TransactionsPieChartProps {
  data: GetSummaryResponse
}

export function TransactionPieChart({ data }: TransactionsPieChartProps) {
  const chartData = [
    {
      type: TransactionType.INCOME,
      amount: data.incomeTotalAmount,
      fill: '#55b02e',
    },
    {
      type: TransactionType.EXPENSE,
      amount: data.expensesTotalAmount,
      fill: '#e93030',
    },
    {
      type: TransactionType.INVESTMENT,
      amount: data.investmentTotalAmount,
      fill: '#FFFFFF',
    },
  ]

  const typesPercentage: TransactionPercentageType = {
    [TransactionType.INCOME]: Math.round(
      (data.incomeTotalAmount / data.transactionsTotalAmount) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      (data.expensesTotalAmount / data.transactionsTotalAmount) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      (data.investmentTotalAmount / data.transactionsTotalAmount) * 100,
    ),
  }
  return (
    <Card className="flex flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={70}
            />
          </PieChart>
        </ChartContainer>
        <div className="space-y-2">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-[#55b02e]" />}
            title="Receita"
            value={typesPercentage[TransactionType.INCOME]}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-[#e93030]" />}
            title="Despesa"
            value={typesPercentage[TransactionType.EXPENSE]}
          />
          <PercentageItem
            icon={<PiggyBank size={16} className="text-[#ffff]" />}
            title="Investimento"
            value={typesPercentage[TransactionType.INVESTMENT]}
          />
        </div>
      </CardContent>
    </Card>
  )
}
