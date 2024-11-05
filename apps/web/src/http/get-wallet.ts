import { api } from './api-client'

export interface CardType {
  id: string
  name: string
  icon: string
  limit: number
}

export interface GetWalletsResponse {
  id: string
  name: string
  slug: string
  type: 'PERSONAL' | 'ORGANIZATIONAL'
  card: CardType[]
}

export async function getWallet(walletSlug: string) {
  const result = await api
    .get(`wallet/${walletSlug}`, {
      next: {
        tags: ['wallet'],
      },
    })
    .json<GetWalletsResponse>()

  return result
}
