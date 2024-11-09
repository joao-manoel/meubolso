import { getSummary } from '@/http/get-summary'

interface walletSummaryProps {
  walletId: string
  year: string
  month: string
}
export async function walletSummary({
  walletId,
  year,
  month,
}: walletSummaryProps) {
  return await getSummary({
    walletId,
    year,
    month,
  })
}
