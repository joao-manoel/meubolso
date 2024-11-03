import { api } from './api-client'

interface DeleteTransactionRequest {
  walletId: string
  transactionId: string
}

export async function deleteTransactions({
  walletId,
  transactionId,
}: DeleteTransactionRequest) {
  await api.delete(`wallet/${walletId}/transaction/${transactionId}`)
}
