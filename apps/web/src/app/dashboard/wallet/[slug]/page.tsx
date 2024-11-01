import { redirect } from 'next/navigation'

export default async function WalletPage() {
  redirect('/dashboard')
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">Minha Carteira</h1>
    </div>
  )
}
