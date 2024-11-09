import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import { cookies } from 'next/headers'

import { getWallets } from '@/http/get-wallets'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export async function WalletSwitcher() {
  const walletId = cookies().get('wallet')?.value
  const wallets = await getWallets()

  const selectedWallet = wallets.find((w) => w.id === walletId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex max-w-[180px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="line-clamp-1 text-muted-foreground">
          {selectedWallet?.name || 'Selecionar carteira'}
        </span>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuLabel className="text-xs font-thin text-muted-foreground">
          Carteiras
        </DropdownMenuLabel>
        {wallets.map((wallet) => (
          <DropdownMenuItem key={wallet.id}>
            <a href={`/wallet/${wallet.id}`}>{wallet.name}</a>
          </DropdownMenuItem>
        ))}
        <Separator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="rounded-none font-medium">
            <PlusCircle className="size-4 text-muted-foreground" />
            Criar carteira
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
