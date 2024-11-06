import { api } from './api-client'

export interface CardType {
  id: string
  name: string
  icon: string
  limit: number
}

export interface GetWalletResponse {
  id: string
  name: string
  slug: string
  type: 'PERSONAL' | 'ORGANIZATIONAL'
  card: CardType[]
}

export async function getWallet(walletId: string) {
  const result = await api
    .get(`wallet/${walletId}`, {
      next: {
        tags: [`${walletId}/wallet`],
      },
    })
    .json<GetWalletResponse>()

  return result
}
