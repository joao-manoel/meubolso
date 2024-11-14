import { api } from './api-client'

interface CreateCardRequest {
  name: string
  limit: number
  brand: string
  walletId: string
}

interface CreateCardResponse {
  id: string
}

export async function createCard({
  name,
  limit,
  brand,
  walletId,
}: CreateCardRequest) {
  const result = await api
    .post('wallet/card', {
      json: {
        name,
        limit,
        brand,
        walletId,
      },
    })
    .json<CreateCardResponse>()

  return result
}
