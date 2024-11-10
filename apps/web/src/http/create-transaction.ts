import { api } from './api-client'

type Installment = {
  installment: number
  status: 'paid' | 'pending'
  payDate: string
  paidAt?: string
}

interface CreateTransactionRequest {
  walletId: string
  title: string
  amount: number
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'
  payDate: string
  recurrence: 'VARIABLE' | 'MONTH' | 'YEAR'
  categoryId: string
  cardId: string
  status: 'paid' | 'pending'
  installments?: Installment[]
}

interface CreateTransactionResponse {
  id: string
}

export async function createTransaction({
  walletId,
  title,
  amount,
  type,
  payDate,
  recurrence,
  categoryId,
  cardId,
  status,
  installments,
}: CreateTransactionRequest) {
  const result = await api
    .post(`wallet/${walletId}/transaction`, {
      json: {
        title,
        amount,
        type,
        payDate,
        recurrence,
        categoryId,
        cardId,
        status,
        ...(installments && { installments }),
      },
    })
    .json<CreateTransactionResponse>()

  return result
}
