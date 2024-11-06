'use client'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { addMonths, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { CardIcon } from '@/components/CardIcon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GetTransactionsResponse } from '@/http/get-transactions'
import { GetTransactionsCategorysResponse } from '@/http/get-transactions-categorys'
import { GetWalletResponse } from '@/http/get-wallet'

import CreateIncomeForm from './incomes/create-income-form'

interface TransactionTableProps {
  data: GetTransactionsResponse[]
  wallet: GetWalletResponse
  categorys: GetTransactionsCategorysResponse[]
}

type TransactionWithInstallmentInfo = GetTransactionsResponse & {
  installmentInfo?: {
    id: string
    installment: number
    status: 'paid' | 'pending'
    isRecurring: boolean
    payDate: string
    paidAt?: string
  }
}

const filterTransactions = (
  transactions: GetTransactionsResponse[],
  currentDate: Date,
): TransactionWithInstallmentInfo[] => {
  return transactions.flatMap((transaction) => {
    const transactionDate = new Date(transaction.payDate)
    const isSameMonth = transactionDate.getMonth() === currentDate.getMonth()
    const isSameYear =
      transactionDate.getFullYear() === currentDate.getFullYear()
    const isAfterOrSameAsPayDate =
      currentDate.getFullYear() > transactionDate.getFullYear() ||
      (currentDate.getFullYear() === transactionDate.getFullYear() &&
        currentDate.getMonth() >= transactionDate.getMonth())

    // Verificar se há um installment recorrente pago para o mês atual
    const recurringInstallment = transaction.installments.find(
      (installment) =>
        installment.isRecurring &&
        new Date(installment.payDate).getMonth() === currentDate.getMonth() &&
        new Date(installment.payDate).getFullYear() ===
          currentDate.getFullYear(),
    )

    if (recurringInstallment) {
      return [
        {
          ...transaction,
          amount: transaction.amount,
          installmentInfo: recurringInstallment,
        },
      ]
    }

    // Exibir installments específicos para transações não-recorrentes (não são MONTH ou YEAR)
    if (
      transaction.recurrence === 'VARIABLE' &&
      transaction.installments.length > 0
    ) {
      return transaction.installments
        .filter((installment) => {
          const installmentDate = new Date(installment.payDate)
          return (
            installmentDate.getMonth() === currentDate.getMonth() &&
            installmentDate.getFullYear() === currentDate.getFullYear()
          )
        })
        .map((installment) => ({
          ...transaction,
          amount: transaction.amount / transaction.installments.length,
          installmentInfo: installment,
        }))
    }

    // Exibir a transação pai se não houver installment pago para o mês atual
    switch (transaction.recurrence) {
      case 'VARIABLE':
        // Exibir apenas no mês e ano exatos do `payDate` sem recorrência ou parcelas
        return isSameMonth && isSameYear ? [transaction] : []

      case 'MONTH':
        // Exibir a transação pai a partir do `payDate` para todos os meses subsequentes
        return isAfterOrSameAsPayDate ? [transaction] : []

      case 'YEAR':
        // Exibir a transação pai apenas no mês de `payDate` para anos subsequentes
        return isSameMonth && isAfterOrSameAsPayDate ? [transaction] : []

      default:
        return []
    }
  }) as TransactionWithInstallmentInfo[]
}

const columns: ColumnDef<TransactionWithInstallmentInfo>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.installmentInfo
          ? `${row.getValue('title')} ${row.original.recurrence === 'VARIABLE' ? `(Parcela ${row.original.installmentInfo.installment})` : ''}`
          : row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount')) / 100

      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status de Pagamento',
    cell: ({ row }) => {
      const status =
        row.original.installmentInfo?.status || row.getValue('status')
      return (
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${status === 'pending' ? 'bg-orange-400' : 'bg-green-400'}`}
          />
          <span className="capitalize">
            {status === 'pending' ? 'Aguardando' : 'Pago'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'installments',
    header: 'Parcelas',
    cell: ({ row }) => {
      const installmentInfo = row.original.installmentInfo
      if (installmentInfo && installmentInfo.isRecurring === false) {
        return `${installmentInfo.installment}/${row.original.installments.length}`
      }
      return '1x'
    },
  },
  {
    accessorKey: 'payDate',
    header: 'Vencimento',
    cell: ({ row }) => {
      const date =
        row.original.installmentInfo?.payDate || row.getValue('payDate')
      return format(new Date(date || ''), 'dd/MM/yyyy')
    },
  },
  {
    accessorKey: 'card',
    header: 'Cartão',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2 capitalize">
          {CardIcon(row.original.card.icon)}
          {row.original.card.name}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TransactionsTable({
  data,
  wallet,
  categorys,
}: TransactionTableProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const filteredTransactions = useMemo(
    () => filterTransactions(data, currentDate),
    [currentDate],
  )

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1))
  }

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full p-2">
      <h1 className="text-2xl font-bold">Receitas</h1>
      <div className="flex items-center gap-2 py-4">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Encontrar receita..."
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Adicionar Receita</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>
                <h1 className="text-2xl font-bold">Receita</h1>
              </DialogTitle>
              <CreateIncomeForm wallet={wallet} categorys={categorys} />
            </DialogContent>
          </Dialog>
        </div>

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Ocultar <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
