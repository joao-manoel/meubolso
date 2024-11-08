import { auth } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getWallets } from '@/http/get-wallets'

import CreatePersonalWalletForm from '../settings/wallets/create-personal-wallet-form'

export default async function DashboardPage() {
  const { user } = await auth()
  const wallets = await getWallets()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">👋 Bem-vindo, {user?.name}!</h1>

      <div className="pt-3">
        {wallets.length <= 0 && (
          <>
            <Card className="w-[380px]">
              <CardHeader className="item flex flex-col items-center justify-center">
                <CardTitle>Cria Carteira</CardTitle>
                <CardDescription>
                  Você ainda não tem uma carteira, vamos criar uma!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreatePersonalWalletForm />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
