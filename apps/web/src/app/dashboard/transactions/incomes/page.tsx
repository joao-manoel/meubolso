import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getTransactions } from '@/http/get-transactions'

import { TransactionsTable } from '../transaction-table'

export default async function IncomesPage() {
  const walletSlug = cookies().get('wallet')?.value

  if (!walletSlug) {
    redirect('/dashboard')
  }

  const transactions = await getTransactions({
    type: 'INCOME',
    walletSlug,
  })

  return (
    <div className="space-y-2">
      <TransactionsTable data={transactions} />
    </div>
  )
}
