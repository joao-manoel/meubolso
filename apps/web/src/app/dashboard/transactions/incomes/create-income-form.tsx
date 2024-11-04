import { format, startOfToday } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

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
import { cn } from '@/lib/utils'

export default function CreateIncomeForm() {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState<Date | undefined>(startOfToday())
  const [category, setCategory] = useState('')
  const [card, setCard] = useState('')
  const [entryType, setEntryType] = useState<
    'variable' | 'recorrente' | 'parcelado'
  >('variable')
  const [recurrenceType, setRecurrenceType] = useState<'mensal' | 'anual'>(
    'mensal',
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

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold">Receita</h1>
      </header>
      <form className="flex flex-col gap-4 py-2.5">
        <div className="grid grid-cols-[70%_minmax(30%,_1fr)] gap-3">
          <div className="gap-2 space-y-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              placeholder="Digite um titulo"
              name="description"
              id="title"
            />
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
          </div>
        </div>
        <div className="grid grid-cols-[50%_minmax(50%,_1fr)] gap-2">
          <div className="space-y-2">
            <Label htmlFor="category">Categorias</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salario">Salario</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Vencimento</Label>
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
                  {date ? format(date, 'PPP') : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Cartão</Label>
          <Select value={card} onValueChange={(value) => setCard(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cartão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nubank">Nubank</SelectItem>
              <SelectItem value="bb">Banco do Brasil</SelectItem>
            </SelectContent>
          </Select>
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
                onValueChange={(value: 'mensal' | 'anual') =>
                  setRecurrenceType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de recorrência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
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
          <Button className="w-full">Adicionar</Button>
        </div>
      </form>
    </div>
  )
}
