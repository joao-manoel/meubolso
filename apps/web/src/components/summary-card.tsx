import { cookies } from 'next/headers'
import { ReactNode } from 'react'

import CreateIncomeForm from '@/components/create-transaction-form'
import { getTransactionsCategorys } from '@/http/get-transactions-categorys'
import { getWallet } from '@/http/get-wallet'

import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Skeleton } from './ui/skeleton'

interface SummaryCardProps {
  icon: ReactNode
  title: string
  amount: number
  size?: 'small' | 'large'
  isLoading: boolean
}

export default async function SummaryCard({
  icon,
  title,
  amount,
  size = 'small',
  isLoading,
}: SummaryCardProps) {
  const walletId = cookies().get('wallet')?.value
  const categorys = await getTransactionsCategorys()
  const wallet = await getWallet(walletId!)

  return (
    <Card
      className={`${size === 'large' ? 'bg-zinc-100 dark:bg-zinc-950' : ''}`}
    >
      <CardHeader className="w-full flex-row items-center gap-2">
        {icon}
        <p
          className={`${size === 'small' ? 'text-muted-foreground' : 'text-black opacity-70 dark:text-white'}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        {isLoading ? (
          <Skeleton
            className={`${size === 'large' ? 'h-8 w-64' : 'h-7 w-56'}`}
          />
        ) : (
          <p
            className={`font-bold ${size === 'small' ? 'text-xl' : 'text-3xl'}`}
          >
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(amount / 100)}
          </p>
        )}
        {size === 'large' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Adicionar Receita</Button>
            </DialogTrigger>

            <DialogContent aria-describedby="formulario de adicionar transação">
              <DialogTitle>
                <p className="text-2xl font-bold">Adiciona transação</p>
                <DialogDescription>
                  Adicionar uma nova transação.
                </DialogDescription>
              </DialogTitle>
              <CreateIncomeForm wallet={wallet} categorys={categorys} />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
