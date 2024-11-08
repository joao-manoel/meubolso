import { api } from './api-client'

export interface GetWalletsResponse {
  id: string
  name: string
  slug: string
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
