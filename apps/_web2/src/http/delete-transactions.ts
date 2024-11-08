import { api } from './api-client'

interface DeleteTransactionRequest {
  walletId: string
  transactions: Array<string>
}

export async function deleteTransactions({
  walletId,
  transactions,
}: DeleteTransactionRequest) {
  await api.delete(`wallet/${walletId}/transactions`, {
    json: {
      transactions,
    },
  })
}
