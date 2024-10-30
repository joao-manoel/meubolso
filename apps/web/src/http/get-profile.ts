import { api } from './api-client'

interface GetProfileResponse {
  user: {
    id: number
    name: string
    email?: string | null
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
