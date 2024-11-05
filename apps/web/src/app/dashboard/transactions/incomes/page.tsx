import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getTransactions } from '@/http/get-transactions'
import { getTransactionsCategorys } from '@/http/get-transactions-categorys'
import { getWallet } from '@/http/get-wallet'
import { getWalletTransactionsCategorys } from '@/http/get-wallet-transactions-categorys'

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

  const walletCategorys = await getWalletTransactionsCategorys({
    walletId,
    type: 'INCOME',
  })

  const transactionsCategorys = await getTransactionsCategorys({
    type: 'INCOME',
  })

  const categorys = [...walletCategorys, ...transactionsCategorys]

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
