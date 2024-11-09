import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'

import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function OrganizationSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="line-clamp-1 text-muted-foreground">João Manoel</span>
        <Badge className="text-[8px] text-muted-foreground" variant="secondary">
          FREE
        </Badge>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-thin text-muted-foreground">
            Conta pessoal
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-none bg-zinc-800 font-medium">
            <span className="line-clamp-1">João Manoel</span>
            <Check className="ml-auto size-4 text-muted-foreground" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <span className="text-xs font-thin text-muted-foreground">
              Organização
            </span>
            <Badge
              className="bg-green-900 text-[8px] text-white hover:bg-green-900"
              variant="default"
            >
              EM BREVE
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-none font-medium" disabled>
            <PlusCircle className="size-4 text-muted-foreground" />
            Criar organização
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
