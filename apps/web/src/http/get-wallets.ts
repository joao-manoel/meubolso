import { api } from './api-client'

interface GetWalletsResponse {
  name: string
  id: string
  type: 'PERSONAL' | 'ORGANIZATIONAL'
}

export async function getWallets() {
  const result = await api
    .get('wallets', {
      next: {
        tags: ['wallets'],
      },
    })
    .json<GetWalletsResponse[]>()

  return result
}
