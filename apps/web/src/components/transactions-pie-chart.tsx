'use client'

import { Pie, PieChart } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
  INVESTMENT: {
    label: 'Investido',
    color: '#FFFFFF',
  },
  INCOME: {
    label: 'Receitas',
    color: '#55b02e',
  },
  EXPENSE: {
    label: 'Despesas',
    color: '#e93030',
  },
} satisfies ChartConfig

interface TransactionsPieChartProps {
  incomeAmount: number
  investmentsTotal: number
  expensesAmount: number
}

export function TransactionPieChart({
  incomeAmount,
  investmentsTotal,
  expensesAmount,
}: TransactionsPieChartProps) {
  const chartData = [
    {
      type: chartConfig.INCOME,
      amount: incomeAmount,
      fill: '#55b02e',
    },
    {
      type: chartConfig.EXPENSE,
      amount: expensesAmount,
      fill: '#e93030',
    },
    {
      type: chartConfig.INVESTMENT,
      amount: investmentsTotal,
      fill: '#FFFFFF',
    },
  ]
  return (
    <Card className="flex flex-col">
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
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
