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

export interface GetTransactionsResponse {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  startDate: string
  endDate: string
  status: 'paid' | 'pending'
  card: CardType
  wallet: WalletType
}

interface GetTransactionRequest {
  type: 'INCOME' | 'EXPENSE'
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
