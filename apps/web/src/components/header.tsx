import { Slash } from 'lucide-react'
import Image from 'next/image'

import meuBolsoIcon from '@/assets/image/meu-bolso-icon.svg'

import { OrganizationSwitcher } from './organization-switcher'
import ProfileButton from './profile-button'
import { WalletSwitcher } from './wallet-switcher'
export default function Header() {
  return (
    <div className="border-b px-8 pb-2">
      <div className="mx-auto flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={meuBolsoIcon}
            alt="Meu Bolso"
            className="size-6 dark:invert"
          />
          <Slash className="size-3 -rotate-[24deg] text-border" />
          <OrganizationSwitcher />
          <Slash className="size-3 -rotate-[24deg] text-border" />
          <WalletSwitcher />
        </div>

        <div className="flex items-center gap-4">
          <ProfileButton />
        </div>
      </div>
    </div>
  )
}
