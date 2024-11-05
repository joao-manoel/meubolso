import { api } from './api-client'

export interface GetCategorysResponse {
  id: string
  title: string
  icon: string
  isCategoryUser: boolean
}

interface GetCategorysRequest {
  walletId: string
  type: 'INCOME' | 'EXPENSE'
}

export async function getCategorys({ walletId, type }: GetCategorysRequest) {
  const result = await api
    .get(`wallet/${walletId}/${type}/categorys`, {
      next: {
        tags: ['category'],
      },
    })
    .json<GetCategorysResponse[]>()

  return result
}
