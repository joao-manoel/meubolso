import { Plus } from 'lucide-react'
import Link from 'next/link'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { GetWalletsResponse } from '@/http/get-wallets'

interface WalletSwitcherProps {
  wallets: GetWalletsResponse[]
}

export async function WalletSwitcher({ wallets }: WalletSwitcherProps) {
  const personalWallets = wallets.filter((wallet) => wallet.type === 'PERSONAL')

  const organizationWallets = wallets.filter(
    (wallet) => wallet.type === 'ORGANIZATIONAL',
  )

  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      align="start"
      side="bottom"
      sideOffset={4}
    >
      {personalWallets?.length > 0 && (
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Pessoal
        </DropdownMenuLabel>
      )}
      {personalWallets.map((wallet) => (
        <DropdownMenuItem
          key={wallet.name}
          className="line-clamp-1 cursor-pointer gap-2 p-2"
          asChild
        >
          <a href={`/dashboard/wallets/set/${wallet.slug}`}>{wallet.name}</a>
        </DropdownMenuItem>
      ))}
      {personalWallets?.length > 0 && <DropdownMenuSeparator />}

      {organizationWallets?.length > 0 && (
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organização
        </DropdownMenuLabel>
      )}
      {organizationWallets.map((wallet) => (
        <DropdownMenuItem
          key={wallet.name}
          className="line-clamp-1 cursor-pointer gap-2 p-2"
          asChild
        >
          <a href={`/dashboard/wallets/set/${wallet.slug}`}>{wallet.name}</a>
        </DropdownMenuItem>
      ))}
      {organizationWallets?.length > 0 && <DropdownMenuSeparator />}

      <DropdownMenuItem className="cursor-pointer gap-2 p-2" asChild>
        <Link href="/dashboard/wallets/create">
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Nova Carteira</div>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
