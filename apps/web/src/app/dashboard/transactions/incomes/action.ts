'use server'
import { revalidateTag } from 'next/cache'

import { deleteTransactions } from '@/http/delete-transaction'

export async function deleteTransactionAction(
  walletId: string,
  transactionId: string,
) {
  await deleteTransactions({
    walletId,
    transactionId,
  })
  revalidateTag('transactions')
}
