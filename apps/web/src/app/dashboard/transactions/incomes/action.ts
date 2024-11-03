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
