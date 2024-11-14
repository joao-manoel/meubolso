'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

import { CardBrandType } from '@/@types/cardTypes'
import { createCardAction } from '@/actions/card-actions'
import { Button } from '@/components/ui/button'
import { useFormState } from '@/hooks/use-form-state'

import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const cardBrands = [
  'CARTEIRA',
  'NUBANK',
  'BB',
  'ITAU',
  'SICREDI',
  'BRADESCO',
  'SANTANDER',
  'CAIXA',
  'INTER',
  'C6BANK',
  'NEXT',
  'NEON',
  'PAN',
  'PICPAY',
  'INFINITYPAY',
  'ITI',
  'MERCADOPAGO',
  'PAGSEGURO',
]

export default function CreateCardForm() {
  const [cardName, setCardName] = useState('')
  const [cardBrand, setCardBrand] = useState<CardBrandType>(
    CardBrandType.CARTEIRA,
  )
  const [cardLimit, setCardLimit] = useState('')

  const formatCurrency = (input: string) => {
    const digits = input.replace(/\D/g, '')
    const number = parseInt(digits, 10) / 100
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      setCardLimit('')
    } else {
      const formatted = formatCurrency(inputValue)
      setCardLimit(formatted)
    }
  }

  const handleCardBrandChange = (value: string) => {
    setCardBrand(value as CardBrandType)
  }

  const router = useRouter()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    createCardAction,
    () => {
      router.push(`/`)
      toast.success('Cartão criado com sucesso!', {
        action: {
          label: 'Dispensar',
          onClick: () => toast.dismiss(),
        },
      })
    },
  )

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Cadastro de Cartão</CardTitle>
      </CardHeader>

      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Ops! não foi possivel criar sua receita!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="default">
          <AlertTriangle className="size-4" />
          <AlertTitle>Cartão criada com sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Nome do Cartão</Label>
            <Input
              id="cardName"
              value={cardName}
              name="name"
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Digite o nome do cartão"
            />
            {errors?.name && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.name[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardBrand">Bandeira do Cartão</Label>
            <Select
              value={cardBrand}
              onValueChange={handleCardBrandChange}
              name="brand"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a bandeira" />
              </SelectTrigger>
              <SelectContent>
                {cardBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.brand && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.brand[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardLimit">Limite do Cartão</Label>
            <Input
              id="cardLimit"
              name="limit"
              value={cardLimit}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
            />
            {errors?.limit && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.limit[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Cadastrar Cartão'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
