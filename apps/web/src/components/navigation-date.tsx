'use client'
import { addMonths, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from './ui/button'

interface NavigationDateProps {
  date: string
}

export default function NavigationDate({ date }: NavigationDateProps) {
  const { push } = useRouter()

  // Extrai ano, mês e dia da string para garantir consistência na criação da data
  const [year, month, day] = date.split('-').map(Number)
  const initialDate = new Date(year, month - 1, day) // mês é indexado em 0

  const [currentDate, setCurrentDate] = useState(initialDate)

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1)
    setCurrentDate(newDate)

    const formattedMonth =
      newDate.getMonth() + 1 < 10
        ? `0${newDate.getMonth() + 1}`
        : newDate.getMonth() + 1

    console.log('Ano:', newDate.getFullYear())
    console.log('Mês:', formattedMonth)
    push(`?month=${formattedMonth}&year=${newDate.getFullYear()}`)
  }

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1)
    setCurrentDate(newDate)

    const formattedMonth =
      newDate.getMonth() + 1 < 10
        ? `0${newDate.getMonth() + 1}`
        : newDate.getMonth() + 1

    console.log('Ano:', newDate.getFullYear())
    console.log('Mês:', formattedMonth)
    push(`?month=${formattedMonth}&year=${newDate.getFullYear()}`)
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-none"
        onClick={handlePreviousMonth}
      >
        <ArrowLeft />
      </Button>
      <div className="flex min-w-20 flex-col items-center justify-center">
        <span className="text-[10px] text-muted-foreground">
          {format(currentDate, 'yyyy', { locale: ptBR })}
        </span>
        <span className="text-[14px] capitalize">
          {format(currentDate, 'MMMM', { locale: ptBR })}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-none"
        onClick={handleNextMonth}
      >
        <ArrowRight />
      </Button>
    </div>
  )
}
