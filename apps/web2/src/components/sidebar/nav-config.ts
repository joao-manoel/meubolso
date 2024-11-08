import { ArrowLeftRight, CirclePlus, Home, Wallet } from 'lucide-react'
import { ComponentType } from 'react'

type ListType = {
  title: string
  url: string
  icon?: ComponentType
  isActive?: boolean
  subMenu?: {
    title: string
    url: string
    icon?: ComponentType
    options?: {
      title: string
      url: string
      icon?: ComponentType
    }[]
  }[]
  options?: {
    title: string
    url: string
    icon?: ComponentType
  }[]
}

export const Dashboard: ListType[] = [
  {
    title: 'Inicio',
    url: '/dashboard',
    icon: Home,
    isActive: true,
  },
]

export const financial: ListType[] = [
  {
    title: 'Transações',
    url: '/dashboard/transactions',
    icon: ArrowLeftRight,
    subMenu: [
      {
        title: 'Receitas',
        url: '/dashboard/transactions/incomes',
        icon: CirclePlus,
      },
      {
        title: 'Despesas',
        url: '/dashboard/transactions/expenses',
        icon: CirclePlus,
      },
    ],
  },
]

export const settings: ListType[] = [
  {
    title: 'Carteiras',
    url: '/dashboard/settings/wallets',
    icon: Wallet,
    subMenu: [
      {
        title: 'Gerenciar',
        url: '/dashboard/settings/wallets',
        icon: CirclePlus,
      },
      {
        title: 'Cartões',
        url: '/dashboard/settings/wallets/cards',
        icon: CirclePlus,
      },
    ],
  },
]
