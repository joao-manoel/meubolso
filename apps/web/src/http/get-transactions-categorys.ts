import { api } from './api-client'

export interface GetTransactionsCategorysResponse {
  id: string
  title: string
  icon: string
  isCategoryUser: boolean
}

export async function getTransactionsCategorys() {
  const result = await api
    .get(`transactions/categorys`, {
      next: {
        tags: ['category'],
      },
    })
    .json<GetTransactionsCategorysResponse[]>()

  return result
}
