import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCategorys } from '@/http/get-categorys'
import { getTransactions } from '@/http/get-transactions'
import { getWallet } from '@/http/get-wallet'

import { TransactionsTable } from '../transaction-table'

export default async function IncomesPage() {
  const walletId = cookies().get('wallet')?.value

  if (!walletId) {
    redirect('/dashboard')
  }

  const transactions = await getTransactions({
    type: 'INCOME',
    walletId,
  })

  const wallet = await getWallet(walletId)

  const categorys = await getCategorys({
    walletId,
    type: 'INCOME',
  })

  return (
    <div className="space-y-2">
      <TransactionsTable
        data={transactions}
        wallet={wallet}
        categorys={categorys}
      />
    </div>
  )
}
