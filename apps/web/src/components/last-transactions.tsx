import { BadgeDollarSign } from 'lucide-react'
import Link from 'next/link'

import { Transactions, TransactionType } from '@/@types/transactionsTypes'
import { formatCurrency, formatDate } from '@/utils/format'
import { convertTransactionStatus } from '@/utils/utils'

import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
interface LastTransactionsProps {
  lasTransactions: Transactions[]
  month: string
  year: string
}

export default function LastTransactions({
  lasTransactions,
  month,
  year,
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

  const filteredTransactions = lasTransactions.flatMap((transaction) => {
    // Exibir parcelas de transações `VARIABLE`
    if (
      transaction.recurrence === 'VARIABLE' &&
      transaction.installments.length > 0
    ) {
      const relevantInstallments = transaction.installments.filter(
        (installment) => {
          const installmentDate = new Date(installment.payDate)
          return (
            installmentDate.getFullYear() === parseInt(year) &&
            installmentDate.getMonth() + 1 === parseInt(month)
          )
        },
      )

      // Exibe as parcelas relevantes para o mês atual
      if (relevantInstallments.length > 0) {
        return relevantInstallments.map((installment) => ({
          ...transaction,
          id: installment.id,
          title: `${transaction.title} (Parcela ${installment.installment})`,
          payDate: installment.payDate,
          amount: transaction.amount / transaction.installments.length,
          status: installment.status,
        }))
      }
    }

    // Exibir transações `MONTH` em todos os meses, e substituir por `installment` se presente
    if (transaction.recurrence === 'MONTH') {
      const transactionDate = new Date(transaction.payDate)
      const currentDate = new Date(parseInt(year), parseInt(month) - 1)

      // Verifica se o mês e ano atuais são iguais ou posteriores ao `payDate`
      if (
        currentDate.getFullYear() > transactionDate.getFullYear() ||
        (currentDate.getFullYear() === transactionDate.getFullYear() &&
          currentDate.getMonth() >= transactionDate.getMonth())
      ) {
        const monthlyInstallments = transaction.installments.filter(
          (installment) => {
            const installmentDate = new Date(installment.payDate)
            return (
              installmentDate.getFullYear() === parseInt(year) &&
              installmentDate.getMonth() + 1 === parseInt(month)
            )
          },
        )

        // Se houver uma `installment` para o mês, exibe-a no lugar da transação original
        if (monthlyInstallments.length > 0) {
          return monthlyInstallments.map((installment) => ({
            ...transaction,
            id: installment.id,
            title: `${transaction.title}`,
            payDate: installment.payDate,
            amount: transaction.amount / transaction.installments.length,
            status: installment.status,
          }))
        }

        // Caso contrário, exibe a transação original com `payDate` ajustado para o mês atual
        const updatedPayDate = new Date(transactionDate)
        updatedPayDate.setFullYear(parseInt(year))
        updatedPayDate.setMonth(parseInt(month) - 1)

        return [
          {
            ...transaction,
            payDate: updatedPayDate.toISOString().split('T')[0],
          },
        ]
      }

      // Se for um mês anterior ao `payDate` inicial, não exibe a transação
      return []
    }

    // Para outras transações, retorna a transação original
    return [transaction]
  })

  return (
    <ScrollArea className="h-full max-h-screen rounded-md border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Ùltimas Transações</CardTitle>
        <Button variant="outline" className="rounded-full font-bold" asChild>
          <Link href="/transactions">Ver Todas</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredTransactions.length === 0 && (
          <p className="flex items-center justify-center text-sm text-muted-foreground">
            Nenhuma transação cadastrada para esse mês.
          </p>
        )}
        {filteredTransactions.map((transaction) => (
          <div
            className="flex items-center justify-between"
            key={transaction.id}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white bg-opacity-[3%] p-3">
                <BadgeDollarSign size={20} />
              </div>
              <div>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm font-bold">{transaction.title}</p>
                  <Badge
                    variant="secondary"
                    className={`${transaction.status === 'paid' ? 'bg-green-500 hover:bg-green-500' : 'bg-orange-500 hover:bg-orange-500'}`}
                  >
                    {transaction.type === 'INCOME'
                      ? transaction.status === 'paid'
                        ? 'Recebido'
                        : 'Pendente'
                      : convertTransactionStatus(transaction.status)}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  <p>{formatDate(transaction.payDate)}</p>
                </span>
              </div>
            </div>
            <span className={`text-sm font-bold`}>
              <p className={`${getAmountColor(transaction)}`}>
                {getAmountPrefix(transaction)}{' '}
                {formatCurrency(transaction.amount)}
              </p>
            </span>
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  )
}
