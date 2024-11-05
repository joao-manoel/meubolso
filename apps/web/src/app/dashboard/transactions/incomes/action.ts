'use server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { deleteTransactions } from '@/http/delete-transaction'

const deleteTransactionSchema = z.object({
  transactionId: z.string(),
  walletId: z.string(),
})

export async function deleteTransactionAction(data: FormData) {
  const result = deleteTransactionSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { walletId, transactionId } = result.data

  await deleteTransactions({
    walletId,
    transactionId,
  })
  revalidateTag('transactions')

  return { success: true, message: null, errors: null }
}
const createIncomeActionSchema = z.object({
  title: z.string().min(3, 'Titulo tem que ter no minino 3 caracteres.'),
  amount: z.string(),
  categoryId: z.string(),
  payDate: z.string(),
  cardId: z.string(),
  recurrence: z.string().optional(),
  installments: z.string().optional(),
})

export async function createIncomeAction(data: FormData) {
  const result = createIncomeActionSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  console.log(result)

  return { success: false, message: null, errors: null }
}
