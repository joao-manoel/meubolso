import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

import {
  deleteTransactionAction,
  updatePaymentTransactionsAction,
} from '@/app/dashboard/transactions/action'
import { CardIcon } from '@/components/CardIcon'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
import { Button } from '../ui/button'
import { TransactionWithInstallmentInfo } from './types'
export const columns: ColumnDef<TransactionWithInstallmentInfo>[] = [
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
      const [isDropdownOpen, setIsDropdownOpen] = useState(false)

      const UpdatePayment = ({ status }: { status: 'paid' | 'pending' }) => {
        const selectedTransaction = [
          {
            id: transaction.id,
            recurrence: transaction.recurrence,
            payDate: transaction.payDate,
            status,
            installments:
              transaction.installmentInfo &&
              transaction.recurrence === 'VARIABLE'
                ? [
                    {
                      id: transaction.installmentInfo.id,
                    },
                  ]
                : undefined, // Quando não há parcelas, não incluir o campo installments
          },
        ]

        updatePaymentTransactionsAction({
          walletId: transaction.wallet.id,
          transactions: selectedTransaction,
        })
      }

      const OptionRevokePayment = () => {
        if (
          (transaction.installmentInfo &&
            transaction.installmentInfo.status === 'paid') ||
          (transaction.status === 'paid' && !transaction.installmentInfo)
        ) {
          return (
            <DropdownMenuItem
              onClick={() => UpdatePayment({ status: 'pending' })}
            >
              Cancelar pagamento
            </DropdownMenuItem>
          )
        }
      }

      return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Pagamento</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => UpdatePayment({ status: 'paid' })}>
              Efetuar pagamento
            </DropdownMenuItem>

            {OptionRevokePayment()}

            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deletar {transaction.title}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {transaction.installmentInfo?.id &&
                    transaction.recurrence !== 'MONTH'
                      ? 'Todas parcelas seram deletada. Ela irá excluir permanentemente sua transação.'
                      : 'Esta ação não poderá ser desfeita. Ela irá excluir permanentemente sua transação.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false)
                    }}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    asChild
                    className="bg-transparent p-0 hover:bg-transparent"
                  >
                    <form
                      action={deleteTransactionAction.bind(null, {
                        walletId: transaction.wallet.id,
                        transactions: [transaction.id],
                      })}
                    >
                      <Button
                        variant="destructive"
                        type="submit"
                        className="w-full"
                        onClick={() => {
                          setIsDropdownOpen(false)
                        }}
                      >
                        Excluir
                      </Button>
                    </form>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
