import { auth } from '@/auth/auth'
import CreateWalletForm from '@/components/create-wallet-form'
import { getWallets } from '@/http/get-wallets'

export default async function DashboardPage() {
  const { user } = await auth()
  const wallets = await getWallets()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">👋 Bem-vindo, {user?.name}!</h1>

      <div className="pt-3">
        {wallets.length <= 0 && (
          <>
            <p className="text-sm font-light">
              Você ainda não tem uma carteira, vamos criar uma!
            </p>
            <CreateWalletForm subscription={user?.subscription || 'NONE'} />
          </>
        )}
      </div>
    </div>
  )
}
