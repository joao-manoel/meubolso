import { api } from './api-client'

interface UpdatePaymentTransactionsRequest {
  walletId: string
  transactions: Array<{
    id: string
    recurrence: 'VARIABLE' | 'MONTH' | 'YEAR'
    payDate: string
    status?: 'paid' | 'pending'
    paidAt?: string
    installments?: Array<{
      id: string
    }>
  }>
}

export async function updatePaymentTransactions({
  walletId,
  transactions,
}: UpdatePaymentTransactionsRequest) {
  await api
    .put(`wallet/${walletId}/update-payment/transactions`, {
      json: {
        transactions,
      },
    })
    .json()
}
