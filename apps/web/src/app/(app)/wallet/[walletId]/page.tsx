import { redirect } from 'next/navigation'

export default function WalletPage() {
  redirect('/')
  return <h1>Wallet</h1>
}
