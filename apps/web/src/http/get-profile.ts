import { api } from './api-client'

export type SubscriptionType = 'NONE' | 'ACTIVE' | 'CANCELLED'

interface GetProfileResponse {
  user: {
    id: number
    name: string
    email?: string | null
    subscription: SubscriptionType
  }
}

export async function getProfile() {
  const result = await api
    .get('auth/profile', {
      next: {
        tags: ['profile'],
      },
    })
    .json<GetProfileResponse>()
  return result
}
