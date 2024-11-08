import { api } from './api-client'

export interface GetTransactionsCategorysResponse {
  id: string
  title: string
  icon: string
  isCategoryUser: boolean
}

interface GetTransactionsCategorysRequest {
  type: 'INCOME' | 'EXPENSE'
}

export async function getTransactionsCategorys({
  type,
}: GetTransactionsCategorysRequest) {
  const result = await api
    .get(`transactions/${type}/categorys`, {
      next: {
        tags: ['category'],
      },
    })
    .json<GetTransactionsCategorysResponse[]>()

  return result
}
