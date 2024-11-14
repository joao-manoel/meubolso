'use server'
import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { CardBrandType } from '@/@types/cardTypes'
import { createCard } from '@/http/create-card'

const createCardSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Nome do seu cartão precisa ter no minimo 3 caracteres.',
    })
    .max(16, {
      message: 'Nome da sua cartão precisa ter no maximo 16 caracteres.',
    }),
  limit: z
    .string()
    .transform((value) => {
      // Remove "R$" e espaços em branco
      let sanitizedValue = value.replace(/[R$\s]/g, '')

      // Se houver múltiplas vírgulas ou pontos, mantém apenas o último como separador decimal
      const hasComma = sanitizedValue.includes(',')
      const hasDot = sanitizedValue.includes('.')
      if (hasComma || hasDot) {
        sanitizedValue = sanitizedValue.replace(/[.,](?=.*[.,])/g, '')
      }

      // Substitui a vírgula final por ponto, caso seja o separador decimal
      sanitizedValue = sanitizedValue.replace(',', '.')

      // Converte para número e multiplica por 100 para obter centavos
      const numericValue = parseFloat(sanitizedValue) * 100

      return Math.round(numericValue)
    })
    .refine((value) => value > 0, {
      message: 'O valor deve ser positivo.',
    }),
  brand: z.nativeEnum(CardBrandType),
})

export async function createCardAction(data: FormData) {
  const result = createCardSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const walletId = cookies().get('wallet')?.value

  if (!walletId) {
    return { success: false, message: 'Carteira invalida', errors: null }
  }

  const { name, brand, limit } = result.data

  try {
    await createCard({ name, brand, limit, walletId })

    return { success: true, message: 'Cartão criado com sucesso', errors: null }
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
