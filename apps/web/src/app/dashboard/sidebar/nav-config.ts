import {
  ArrowLeftRight,
  CirclePlus,
  CreditCard,
  Home,
  Wallet,
} from 'lucide-react'
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
    url: '/transactions',
    icon: ArrowLeftRight,
    subMenu: [
      {
        title: 'Receitas',
        url: '/transactions/income',
        icon: CirclePlus,
      },
      {
        title: 'Despesas',
        url: '/transactions/expense',
        icon: CirclePlus,
      },
    ],
  },
  {
    title: 'Cartões',
    url: '#',
    icon: CreditCard,
  },
]

export const settings: ListType[] = [
  {
    title: 'Wallets',
    url: '/dashboard/wallets',
    icon: Wallet,
    subMenu: [
      {
        title: 'Gerenciar',
        url: '/dashboard/wallets',
        icon: CirclePlus,
      },
      {
        title: 'Criar Carteira',
        url: '/dashboard/wallets/create',
        icon: CirclePlus,
      },
    ],
  },
]
