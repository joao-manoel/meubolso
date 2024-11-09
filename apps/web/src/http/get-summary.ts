import { api } from './api-client'
export type CategorySummaryType = Array<{
  category: string
  totalAmount: number
  percentageOfTotal: number
}>

export interface GetSummaryResponse {
  expensesTotalAmount: number
  incomeTotalAmount: number
  investmentTotalAmount: number
  balanceTotalAmount: number
  transactionsTotalAmount: number
  categorySummary: CategorySummaryType
}

interface GetSummaryRequest {
  walletId: string
  year: string
  month: string
}

export async function getSummary({ walletId, year, month }: GetSummaryRequest) {
  const result = await api
    .get(`wallet/${walletId}/summary/${year}/${month}`, {
      next: {
        tags: ['transactions'],
      },
    })
    .json<GetSummaryResponse>()
  return result
}
