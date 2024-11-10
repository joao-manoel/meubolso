import { CategorySummaryType } from '@/http/get-summary'

import { CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { ScrollArea } from './ui/scroll-area'

interface ExpensesPerCategoryProps {
  expensesPerCategory: CategorySummaryType
}

export default function ExpensesPerCategory({
  expensesPerCategory,
}: ExpensesPerCategoryProps) {
  return (
    <ScrollArea className="col-span-2 max-h-[420px] rounded-md border">
      <CardHeader>
        <CardTitle className="font-bold">Gastos por Categoria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {expensesPerCategory.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex w-full justify-between">
              <p className="text-sm font-bold">{category.category}</p>
              <p className="text-sm font-bold">{category.percentageOfTotal}%</p>
            </div>
            <Progress value={category.percentageOfTotal} />
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  )
}
