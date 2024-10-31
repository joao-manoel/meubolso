import { Plus } from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { getWallets } from '@/http/get-wallets'

export async function SelectWallet() {
  const wallets = await getWallets()

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
          className="cursor-pointer gap-2 p-2"
        >
          {wallet.name}
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
          className="cursor-pointer gap-2 p-2"
        >
          {wallet.name}
        </DropdownMenuItem>
      ))}
      {organizationWallets?.length > 0 && <DropdownMenuSeparator />}

      <DropdownMenuItem className="cursor-pointer gap-2 p-2">
        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
          <Plus className="size-4" />
        </div>
        <div className="font-medium text-muted-foreground">Nova Carteira</div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
