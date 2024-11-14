export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  INVESTMENT = 'INVESTMENT',
}

export type Transactions = {
  id: string
  title: string
  amount: number
  type: TransactionType
  recurrence: 'VARIABLE' | 'MONTH' | 'YEAR'
  payDate: string
  status: 'paid' | 'pending'
  card: { id: string; name: string; brand: string }
  wallet: { id: string; name: string; slug: string }
  installments: Array<{
    id: string
    installment: number
    status: 'paid' | 'pending'
    isRecurring: boolean
    payDate: string
    paidAt?: string
  }>
}
