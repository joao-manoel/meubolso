import { api } from './api-client'

interface DeleteWalletRequest {
  walletId: string
}

export async function deleteWallet({ walletId }: DeleteWalletRequest) {
  await api.delete(`wallet/${walletId}`)
}
