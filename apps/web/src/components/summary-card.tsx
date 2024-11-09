import { ReactNode } from 'react'

import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
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
  // const walletId = cookies().get('wallet')?.value

  // const wallet = await getWallet(walletId!)

  // const categorys = await getTransactionsCategorys()

  return (
    <Card className={`${size === 'large' ? 'bg-white bg-opacity-5' : ''}`}>
      <CardHeader className="w-full flex-row items-center gap-2">
        {icon}
        <p
          className={`${size === 'small' ? 'text-muted-foreground' : 'text-white opacity-70'}`}
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
            className={`font-bold ${size === 'small' ? 'text-2xl' : 'text-4xl'}`}
          >
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(amount / 100)}
          </p>
        )}
        {size === 'large' && <Button>Adicionar Transação</Button>}
      </CardContent>
    </Card>
  )
}
