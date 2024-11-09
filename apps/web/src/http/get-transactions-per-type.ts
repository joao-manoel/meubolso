import {
  GetTransactionsResponse,
  TransactionType,
} from '@/@types/transactionsTypes'

import { api } from './api-client'

interface GetTransactionRequest {
  type: TransactionType
  walletId: string
}

export async function getTransactionsPerType({
  type,
  walletId,
}: GetTransactionRequest) {
  const result = await api
    .get(`wallet/${walletId}/transactions/type/${type}`, {
      next: {
        tags: [`${walletId}/transactions`],
      },
    })
    .json<GetTransactionsResponse[]>()

  return result
}
