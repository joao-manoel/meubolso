import { TransactionWithInstallmentInfo } from '@/components/transaction-table/types'
import { GetTransactionsResponse } from '@/http/get-transactions'

export function CalcParcelas(
  startDate: string,
  endDate: string | null,
): number {
  if (endDate == null) {
    return 1
  }

  const startDateFormatted = new Date(startDate)
  const endDateFormatted = new Date(endDate)

  const mesesInicio =
    startDateFormatted.getMonth() + startDateFormatted.getFullYear() * 12
  const mesesFim =
    endDateFormatted.getMonth() + endDateFormatted.getFullYear() * 12

  const difMeses = mesesFim - mesesInicio
  console.log(mesesInicio, mesesFim)

  return Math.abs(difMeses) + 1
}

export function toCents(value: number): number {
  // Converte para centavos
  return Math.round(value * 100)
}

export const filterTransactions = (
  transactions: GetTransactionsResponse[],
  currentDate: Date,
): TransactionWithInstallmentInfo[] => {
  return transactions.flatMap((transaction) => {
    const transactionDate = new Date(transaction.payDate)
    const isSameMonth = transactionDate.getMonth() === currentDate.getMonth()
    const isSameYear =
      transactionDate.getFullYear() === currentDate.getFullYear()
    const isAfterOrSameAsPayDate =
      currentDate.getFullYear() > transactionDate.getFullYear() ||
      (currentDate.getFullYear() === transactionDate.getFullYear() &&
        currentDate.getMonth() >= transactionDate.getMonth())

    const recurringInstallment = transaction.installments.find(
      (installment) => {
        const installmentDate = new Date(installment.payDate)
        return (
          installment.isRecurring &&
          installmentDate.getMonth() === currentDate.getMonth() &&
          installmentDate.getFullYear() === currentDate.getFullYear()
        )
      },
    )

    if (recurringInstallment) {
      return [
        {
          ...transaction,
          amount: transaction.amount,
          installmentInfo: recurringInstallment,
        },
      ]
    }

    if (
      transaction.recurrence === 'VARIABLE' &&
      transaction.installments.length > 0
    ) {
      return transaction.installments
        .filter((installment) => {
          const installmentDate = new Date(installment.payDate)
          return (
            installmentDate.getMonth() === currentDate.getMonth() &&
            installmentDate.getFullYear() === currentDate.getFullYear()
          )
        })
        .map((installment) => ({
          ...transaction,
          amount: transaction.amount / transaction.installments.length,
          installmentInfo: installment,
        }))
    }

    switch (transaction.recurrence) {
      case 'VARIABLE':
        return isSameMonth && isSameYear ? [transaction] : []

      case 'MONTH':
        return isAfterOrSameAsPayDate ? [transaction] : []

      case 'YEAR':
        return isSameMonth && isAfterOrSameAsPayDate ? [transaction] : []

      default:
        return []
    }
  }) as TransactionWithInstallmentInfo[]
}
