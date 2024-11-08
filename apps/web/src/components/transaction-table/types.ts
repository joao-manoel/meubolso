import { GetTransactionsResponse } from '@/http/get-transactions'
import { GetTransactionsCategorysResponse } from '@/http/get-transactions-categorys'
import { GetWalletResponse } from '@/http/get-wallet'

export interface TransactionTableProps {
  data: GetTransactionsResponse[]
  wallet: GetWalletResponse
  categorys: GetTransactionsCategorysResponse[]
  type: 'INCOME' | 'EXPENSE'
}

export type TransactionWithInstallmentInfo = GetTransactionsResponse & {
  installmentInfo?: {
    id: string
    installment: number
    status: 'paid' | 'pending'
    isRecurring: boolean
    payDate: string
    paidAt?: string
  }
}
