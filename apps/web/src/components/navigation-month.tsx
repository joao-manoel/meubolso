import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from './ui/button'

interface NavigationMonthProps {
  currentDate: Date
  handlePreviousMonth: () => void
  handleNextMonth: () => void
}

export default function NavigationMonth({
  currentDate,
  handlePreviousMonth,
  handleNextMonth,
}: NavigationMonthProps) {
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
