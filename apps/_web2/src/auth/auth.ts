import { cookies } from 'next/headers'

import { getProfile } from '@/http/get-profile'

export function isAuthenticated() {
  return !!cookies().get('token')?.value
}

export function getCurrentToken() {
  return cookies().get('token')?.value
}

/*
export async function getRights() {
  const token = getCurrentToken()
  if (!token) {
    return null
  }

  try {
    const { user } = await auth()

    if (!user) {
      return null
    }

    const right = transformRight(
      user.username === 'manoel' ? 9 : user.memberGroupId,
    )
    const userId = user.id

    return {
      right,
      userId,
    }
  } catch {}

  return null
}

export async function ability() {
  const rights = await getRights()

  if (!rights) {
    return null
  }

  const ability = defineAbilityFor({
    id: rights.userId,
    role: rights.right,
    __typename: 'User',
  })

  if (!ability) return null

  return ability
} */

export async function auth() {
  const token = getCurrentToken()

  if (!token) {
    return { user: null }
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch {}

  return { user: null }
}
