'use client'
import { format, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, CalendarIcon, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CardIcon } from '@/components/CardIcon'
import { CategoryIcon } from '@/components/IconCategorys'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'
import { GetTransactionsCategorysResponse } from '@/http/get-transactions-categorys'
import { GetWalletResponse } from '@/http/get-wallet'
import { cn } from '@/lib/utils'

import { createIncomeAction } from './action'

export interface CreateIncomeFormProps {
  wallet: GetWalletResponse
  categorys: GetTransactionsCategorysResponse[]
}

export default function CreateIncomeForm({
  wallet,
  categorys,
}: CreateIncomeFormProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState<Date>(startOfToday())
  const [category, setCategory] = useState('')
  const [card, setCard] = useState('')
  const [entryType, setEntryType] = useState<
    'variable' | 'recorrente' | 'parcelado'
  >('variable')
  const [recurrenceType, setRecurrenceType] = useState<'MONTH' | 'YEAR'>(
    'MONTH',
  )
  const [installments, setInstallments] = useState<number>(1)

  const installmentOptions = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
      })),
    [],
  )

  const formatCurrency = (input: string) => {
    const digits = input.replace(/\D/g, '')
    const number = parseInt(digits, 10) / 100
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const calculateInstallmentAmount = () => {
    const numericValue = parseFloat(
      amount.replace(/[^\d,]/g, '').replace(',', '.'),
    )
    if (isNaN(numericValue) || installments === 0) return 'R$ 0,00'
    const installmentValue = numericValue / installments
    return installmentValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      setAmount('')
    } else {
      const formatted = formatCurrency(inputValue)
      setAmount(formatted)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate || startOfToday())
  }

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    createIncomeAction,
    () => {
      setTitle('')
      setAmount('')
      setDate(startOfToday())
      setCategory('')
      setCard('')
      setEntryType('variable')
      setRecurrenceType('MONTH')
      setInstallments(1)
    },
  )

  const userTransactionCategorys = categorys.filter(
    (c) => c.isCategoryUser === true,
  )
  const transactionGlobalCategorys = categorys.filter(
    (c) => c.isCategoryUser === false,
  )

  return (
    <div>
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
          <AlertTitle>Receita criada com sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <form className="flex flex-col gap-4 py-2.5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-[70%_minmax(30%,_1fr)] gap-3">
          <div className="gap-2 space-y-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              placeholder="Digite um titulo"
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              id="title"
              value={title}
            />
            {errors?.title && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.title[0]}
              </p>
            )}
          </div>
          <div className="gap-2 space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              name="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
            />
            {errors?.amount && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.amount[0]}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-[50%_minmax(50%,_1fr)] gap-2">
          <div className="space-y-2">
            <Label htmlFor="category">Categorias</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
              name="categoryId"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {userTransactionCategorys.length >= 1 && (
                  <>
                    {userTransactionCategorys.map((c) => (
                      <SelectItem
                        value={c.id}
                        key={c.id}
                        className="flex gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon icon={c.icon} size={15} />
                          <span>{c.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                {userTransactionCategorys && (
                  <>
                    <div className="flex justify-center">
                      <Separator />
                    </div>
                    {transactionGlobalCategorys.map((c) => (
                      <SelectItem value={c.id} key={c.id}>
                        <div className="flex items-center gap-2">
                          <CategoryIcon icon={c.icon} size={15} />
                          <span>{c.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            {errors?.categoryId && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.categoryId[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Vencimento</Label>
            <input
              type="text"
              hidden
              value={format(date, 'yyyy/MM/dd', {
                locale: ptBR,
              })}
              name="payDate"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, 'PPP', {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Cartão</Label>
          {wallet.card ? (
            <Select
              value={card}
              onValueChange={(value) => setCard(value)}
              name="cardId"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cartão" />
              </SelectTrigger>
              <SelectContent>
                {wallet.card.map((card) => (
                  <SelectItem value={card.id} key={card.id}>
                    <div className="flex gap-2">
                      <span>{CardIcon(card.icon)}</span>
                      <span>{card.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-center text-sm">
                Você não tem nenhum cartão cadastrado!
              </span>
              <Button variant="secondary" size="sm">
                Cadastrar um novo cartão
              </Button>
            </div>
          )}
          {errors?.cardId && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.cardId[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Tipo de Lançamento</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={entryType === 'variable' ? 'default' : 'outline'}
                onClick={() => setEntryType('variable')}
              >
                Único
              </Button>
              <Button
                type="button"
                variant={entryType === 'recorrente' ? 'default' : 'outline'}
                onClick={() => setEntryType('recorrente')}
              >
                Recorrente
              </Button>
              <Button
                type="button"
                variant={entryType === 'parcelado' ? 'default' : 'outline'}
                onClick={() => setEntryType('parcelado')}
              >
                Parcelado
              </Button>
            </div>
          </div>

          {entryType === 'recorrente' && (
            <div className="space-y-2">
              <Label htmlFor="recurrenceType">Tipo de Recorrência</Label>
              <Select
                value={recurrenceType}
                onValueChange={(value: 'MONTH' | 'YEAR') =>
                  setRecurrenceType(value)
                }
                name="recurrence"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de recorrência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTH">Mensal</SelectItem>
                  <SelectItem value="YEAR">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {entryType === 'parcelado' && (
            <div className="gap-4 space-y-2">
              <Label htmlFor="installments">Número de Parcelas</Label>
              <div className="grid grid-cols-[70%_minmax(30%,_1fr)]">
                <div className="flex items-center space-x-4">
                  <Select
                    value={installments.toString()}
                    onValueChange={(value) => setInstallments(parseInt(value))}
                    name="installments"
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Selecione o número de parcelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {installmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center text-sm">
                  <p>
                    {installments}x de {calculateInstallmentAmount()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <Button className="w-full">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Adicionar'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
