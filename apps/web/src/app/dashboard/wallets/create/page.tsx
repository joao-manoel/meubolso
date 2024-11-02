import { auth } from '@/auth/auth'
import CreateWalletForm from '@/components/create-wallet/create-wallet-form'

export default async function CreateWalletPage() {
  const { user } = await auth()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <CreateWalletForm subscription={user?.subscription || 'NONE'} />
    </div>
  )
}
