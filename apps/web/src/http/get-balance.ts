import { api } from './api-client'

interface GetBalanceResponse {
  expensesAmount: number
  incomeAmount: number
  investmentAmount: number
  balanceAmount: number
}

interface GetBalanceRequest {
  walletId: string
  date: string
}

export async function getBalances({ walletId, date }: GetBalanceRequest) {
  const result = await api
    .post(`wallet/${walletId}/balance`, {
      json: {
        date,
      },
      next: {
        tags: ['transactions'],
      },
    })
    .json<GetBalanceResponse>()
  return result
}
