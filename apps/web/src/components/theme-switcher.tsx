'use client'
import { Check, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  const handleSetTheme = (themeName: string) => {
    setTheme(themeName)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownMenuItem>
          <span>Tema</span>
          <ChevronRight className="ml-auto size-4 text-muted-foreground" />
        </DropdownMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        alignOffset={-200}
        sideOffset={-25}
        className="mx-1 w-[80px]"
      >
        <DropdownMenuItem
          onClick={() => handleSetTheme('system')}
          disabled={theme === 'system' && true}
        >
          Sistema
          {theme === 'system' && (
            <Check className="ml-auto size-4 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSetTheme('dark')}
          disabled={theme === 'dark' && true}
        >
          Escuro
          {theme === 'dark' && (
            <Check className="ml-auto size-4 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSetTheme('light')}
          disabled={theme === 'light' && true}
        >
          Claro
          {theme === 'light' && (
            <Check className="ml-auto size-4 text-muted-foreground" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
