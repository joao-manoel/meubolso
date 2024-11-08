'use client'
import { TooltipArrow } from '@radix-ui/react-tooltip'
import {
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
import { ArrowLeft, ArrowRight, Check, ChevronDown, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { filterTransactions } from '@/utils/utils'

import {
  deleteTransactionAction,
  updatePaymentTransactionsAction,
} from '../../app/dashboard/transactions/action'
import CreateIncomeForm from '../../app/dashboard/transactions/create-income-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { columns } from './columns'
import { TransactionTableProps } from './types'

export function TransactionsTable({
  data,
  wallet,
  categorys,
  type,
}: TransactionTableProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const filteredTransactions = useMemo(
    () => filterTransactions(data, currentDate),
    [data, currentDate],
  )

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1))
  }

  const clearSelection = () => {
    setRowSelection({})
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

  const handleConfirmDelete = () => {
    deleteTransactionAction({
      walletId: wallet.id,
      transactions: table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original.id),
    })

    setTimeout(() => {
      clearSelection()
    }, 100)
  }

  const handleUpdatePayment = () => {
    // Mapeia as transações selecionadas para o formato esperado pela action

    const selectedTransactions = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => {
        const transaction = row.original

        return {
          id: transaction.id,
          recurrence: transaction.recurrence,
          payDate: transaction.payDate,
          month: currentDate.getMonth().toString(),
          installments:
            transaction.installmentInfo && transaction.recurrence === 'VARIABLE'
              ? [
                  {
                    id: transaction.installmentInfo.id,
                  },
                ]
              : undefined, // Quando não há parcelas, não incluir o campo installments
        }
      })

    updatePaymentTransactionsAction({
      walletId: wallet.id,
      transactions: selectedTransactions,
    })

    clearSelection()
  }

  return (
    <div className="relative w-full p-2">
      <h1 className="text-2xl font-bold">
        {type === 'INCOME' ? 'Receitas' : 'Despesas'}
      </h1>
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

            <DialogContent aria-describedby="formulario de adicionar transação">
              <DialogTitle>
                <p className="text-2xl font-bold">
                  {type === 'INCOME' ? 'Receita' : 'Despesa'}
                </p>
                <DialogDescription>
                  Adicionar uma nova transação.
                </DialogDescription>
              </DialogTitle>
              <CreateIncomeForm
                wallet={wallet}
                categorys={categorys}
                type={type}
              />
            </DialogContent>
          </Dialog>
        </div>

        {table.getFilteredSelectedRowModel().rows.length >= 1 && (
          <div className="left-20 z-50 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdatePayment}
                  >
                    <Check />
                  </Button>
                  <TooltipContent align="center">
                    <p>Atualizar Status de Pagamento para Concluído</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="outline" size="sm">
                        <Trash />
                      </Button>
                      <TooltipContent align="center">
                        <p>Excluir</p>
                        <TooltipArrow className="TooltipArrow" />
                      </TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Deseja excluir todas as receitas selecionadas?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação é irreversível e excluirá permanentemente todas
                      as transações selecionadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancela</AlertDialogCancel>
                    <AlertDialogAction
                      asChild
                      className="bg-transparent p-0 hover:bg-transparent"
                    >
                      <form action={handleConfirmDelete}>
                        <Button
                          variant="destructive"
                          type="submit"
                          className="w-full"
                        >
                          Confirma
                        </Button>
                      </form>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipProvider>
          </div>
        )}

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
          <div className="flex items-center gap-2">
            <div>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} item(s) selecionado.
            </div>
          </div>
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
