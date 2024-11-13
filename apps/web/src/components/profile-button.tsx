import { ChevronDown } from 'lucide-react'

import { auth } from '@/auth/auth'
import { getInitials } from '@/utils/format'

import ThemeSwitcher from './theme-switcher'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export default async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
        <Avatar>
          {user?.avatar && (
            <AvatarImage src={user?.avatar} className="rounded-md border" />
          )}
          <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <ThemeSwitcher />
        <Separator />
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">Sair</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
