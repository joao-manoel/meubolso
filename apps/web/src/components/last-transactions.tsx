import { BadgeDollarSign } from 'lucide-react'
import Link from 'next/link'

import { Transactions, TransactionType } from '@/@types/transactionsTypes'
import { formatCurrency, formatDate } from '@/utils/format'

import { Button } from './ui/button'
import { CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'

interface LastTransactionsProps {
  lasTransactions: Transactions[]
}

export default function LastTransactions({
  lasTransactions,
}: LastTransactionsProps) {
  const getAmountColor = (transaction: Transactions) => {
    if (transaction.type === TransactionType.EXPENSE) {
      return 'text-red-500'
    }
    if (transaction.type === TransactionType.INCOME) {
      return 'text-green-500'
    }

    return 'text-white'
  }

  const getAmountPrefix = (transaction: Transactions) => {
    if (transaction.type === TransactionType.INCOME) {
      return '+'
    }

    return '-'
  }
  return (
    <ScrollArea className="rounded-md border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Ùltimas Transações</CardTitle>
        <Button variant="outline" className="rounded-full font-bold" asChild>
          <Link href="/transactions">Ver Todas</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {lasTransactions.map((transaction) => (
          <div
            className="flex items-center justify-between"
            key={transaction.id}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white bg-opacity-[3%] p-3">
                <BadgeDollarSign size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">{transaction.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.payDate)}
                </p>
              </div>
            </div>
            <p className={`text-sm font-bold ${getAmountColor(transaction)}`}>
              {getAmountPrefix(transaction)}{' '}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  )
}
