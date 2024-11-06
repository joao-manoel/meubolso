import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getTransactions } from '@/http/get-transactions'
import { getTransactionsCategorys } from '@/http/get-transactions-categorys'
import { getWallet } from '@/http/get-wallet'
import { getWalletTransactionsCategorys } from '@/http/get-wallet-transactions-categorys'

import { TransactionsTable } from '../transaction-table'

export default async function IncomesPage() {
  const walletId = cookies().get('wallet')?.value

  if (!walletId && walletId !== 'null' && walletId !== 'undefined') {
    redirect('/dashboard')
  }

  try {
    const [transactions, wallet, walletCategorys, transactionsCategorys] =
      await Promise.all([
        getTransactions({ type: 'INCOME', walletId }),
        getWallet(walletId),
        getWalletTransactionsCategorys({ walletId, type: 'INCOME' }),
        getTransactionsCategorys({ type: 'INCOME' }),
      ])

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
  } catch (error) {
    redirect('/dashboard')
  }
}
