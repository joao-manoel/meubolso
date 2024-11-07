import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getTransactions } from '@/http/get-transactions'
import { getTransactionsCategorys } from '@/http/get-transactions-categorys'
import { getWallet } from '@/http/get-wallet'
import { getWalletTransactionsCategorys } from '@/http/get-wallet-transactions-categorys'

import { TransactionsTable } from '../transaction-table'

export default async function ExpensesPage() {
  const walletId = cookies().get('wallet')?.value

  if (!walletId) {
    redirect('/dashboard')
  }

  try {
    const [transactions, wallet, walletCategorys, transactionsCategorys] =
      await Promise.all([
        getTransactions({
          type: 'EXPENSE',
          walletId,
        }),
        getWallet(walletId),
        getWalletTransactionsCategorys({ walletId, type: 'EXPENSE' }),
        getTransactionsCategorys({ type: 'EXPENSE' }),
      ])

    const categorys = [...walletCategorys, ...transactionsCategorys]
    return (
      <div className="space-y-2">
        <TransactionsTable
          data={transactions}
          wallet={wallet}
          categorys={categorys}
          type="EXPENSE"
        />
      </div>
    )
  } catch (error) {
    redirect('/dashboard')
  }
}
