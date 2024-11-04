import { api } from './api-client'

type TransactionType = 'INCOME' | 'EXPENSE'

export type GetTransactionsResponse = {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  recurrence: 'VARIABLE' | 'MONTH' | 'YEAR'
  payDate: string
  status: 'paid' | 'pending'
  card: { id: string; name: string; icon: string }
  wallet: { id: string; name: string; slug: string }
  installments: Array<{
    id: string
    installment: number
    status: 'paid' | 'pending'
    payDate: string
    paidAt?: string
  }>
}

interface GetTransactionRequest {
  type: TransactionType
  walletSlug: string
}

export async function getTransactions({
  type,
  walletSlug,
}: GetTransactionRequest) {
  const result = await api
    .get(`wallet/${walletSlug}/transactions/${type}`, {
      next: {
        tags: ['transactions'],
      },
    })
    .json<GetTransactionsResponse[]>()

  return result
}
