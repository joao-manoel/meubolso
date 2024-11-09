import { Transactions } from '@/@types/transactionsTypes'

import { api } from './api-client'

interface GetTransactionRequest {
  walletId: string
  month: string
  year: string
  take: number
}

export async function getTransactions({
  walletId,
  month,
  year,
  take,
}: GetTransactionRequest) {
  const result = await api
    .post(`wallet/${walletId}/transactions`, {
      json: {
        month,
        year,
        take,
      },
      next: {
        tags: [`${walletId}/transactions`],
      },
    })
    .json<Transactions[]>()

  return result
}
