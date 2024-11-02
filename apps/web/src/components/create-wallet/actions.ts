'use server'
import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { createWallet } from '@/http/create-wallets'

const createWalletSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Nome da sua carteira precisa ter no minimo 3 caracteres.',
    })
    .max(16, {
      message: 'Nome da sua carteira precisa ter no maximo 16 caracteres.',
    }),
  type: z.string().optional(),
})

export async function createWalletAction(data: FormData) {
  const result = createWalletSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, type } = result.data

  try {
    const wallet = await createWallet({
      name,
      ...(type && { type }),
    })

    cookies().set('wallet', wallet.slug, {
      path: '/',
      maxAge: 60 * 60 * 365,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
