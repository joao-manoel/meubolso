import { api } from './api-client'

export interface GetWalletTransactionsCategorysResponse {
  id: string
  title: string
  icon: string
  isCategoryUser: boolean
}

interface GetWalletTransactionsCategorysRequest {
  walletId: string
  type: 'INCOME' | 'EXPENSE'
}

export async function getWalletTransactionsCategorys({
  walletId,
  type,
}: GetWalletTransactionsCategorysRequest) {
  const result = await api
    .get(`wallet/${walletId}/transactions/${type}/categorys`, {
      next: {
        tags: ['category'],
      },
    })
    .json<GetWalletTransactionsCategorysResponse[]>()

  return result
}
