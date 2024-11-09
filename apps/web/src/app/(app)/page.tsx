import { cookies } from 'next/headers'

import Header from '@/components/header'
import SummaryCards from '@/components/summary-cards'

export default async function Home() {
  const walletId = cookies().get('wallet')?.value
  return (
    <div className="py-4">
      <Header />
      <main className="h-screen">
        <SummaryCards walletId={walletId || ''} />
      </main>
    </div>
  )
}
