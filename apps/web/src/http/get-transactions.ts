import { api } from './api-client'

type IconCardType =
  | 'CARTEIRA'
  | 'NUBANK'
  | 'BB'
  | 'ITAU'
  | 'SICREDI'
  | 'BRADESCO'
  | 'SANTANDER'
  | 'CAIXA'
  | 'INTER'
  | 'C6BANK'
  | 'NEXT'
  | 'NEON'
  | 'PAN'
  | 'PICPAY'
  | 'INFINITYPAY'
  | 'ITI'
  | 'MERCADOPAGO'
  | 'PAGSEGURO'

type TransactionType = 'INCOME' | 'EXPENSE'
type TransactionStatus = 'paid' | 'pending'

interface CardType {
  id: string
  name: string
  icon: IconCardType
}

interface WalletType {
  id: string
  name: string
  slug: string
}

interface InstallmentsType {
  id: string
  installment: number
  status: TransactionStatus
  payDate?: string
  paidAt?: string
}

export interface GetTransactionsResponse {
  id: string
  description: string
  amount: number
  type: TransactionType
  payDate: string
  status: TransactionStatus
  card: CardType
  wallet: WalletType
  installments: InstallmentsType[]
}

interface GetTransactionRequest {
  type: TransactionType
  walletSlug: string
}

export async function getTransactions({
  type,
  walletSlug,
}: GetTransactionRequest) {
  const result = await api
    .get(`wallet/${walletSlug}/transactions/${type}`, {
      next: {
        tags: ['transactions'],
      },
    })
    .json<GetTransactionsResponse[]>()

  return result
}
