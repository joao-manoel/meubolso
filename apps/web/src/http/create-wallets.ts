import { api } from './api-client'

interface CreateWalletRequest {
  name: string
  type?: string
}

interface CreateWalletResponse {
  id: string
  name: string
  slug: string
}

export async function createWallet({ name, type }: CreateWalletRequest) {
  const result = await api
    .post('wallet', {
      json: {
        name,
        ...(type && { type }),
      },
    })
    .json<CreateWalletResponse>()

  return result
}
