'use server'
import { ChevronsUpDown } from 'lucide-react'
import { cookies } from 'next/headers'

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getWallets } from '@/http/get-wallets'

import { WalletSwitcher } from './wallet-switcher'

export async function DashboardSidebarHeader() {
  const walletId = cookies().get('wallet')?.value
  const wallets = await getWallets()

  const currentWallet = wallets.find((wallet) => wallet.id === walletId)

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-400 text-sidebar-primary-foreground">
                  C
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Cronota</span>
                  <span className="line-clamp-1 truncate text-xs">
                    {currentWallet ? (
                      <span>{currentWallet.name}</span>
                    ) : (
                      'Selecione uma carteira'
                    )}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <WalletSwitcher wallets={wallets} />
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
