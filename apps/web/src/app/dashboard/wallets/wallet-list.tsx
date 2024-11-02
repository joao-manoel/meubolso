'use server'

import { ExternalLink, Trash2, Wallet } from 'lucide-react'
import { cookies } from 'next/headers'

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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getWallets } from '@/http/get-wallets'
import { transformTypeWalletText } from '@/utils/format'

export default async function WalletList() {
  const walletSlugCookie = cookies().get('wallet')?.value
  const wallets = await getWallets()

  const personalWallets = wallets.filter((wallet) => wallet.type === 'PERSONAL')

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Carteiras</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {personalWallets.map((wallet) => {
              return (
                <TableRow key={wallet.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Wallet />
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {wallet.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {transformTypeWalletText(wallet.type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {walletSlugCookie === wallet.slug && (
                        <Button variant="ghost" disabled={true}>
                          <span className="h-2 w-2 animate-ping rounded-full bg-green-400" />
                          Ativo
                        </Button>
                      )}

                      {walletSlugCookie !== wallet.slug && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`/dashboard/wallets/set/${wallet.slug}`}>
                            <ExternalLink />
                            Visualizar
                          </a>
                        </Button>
                      )}

                      {walletSlugCookie !== wallet.slug && (
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button size="sm" variant="destructive">
                              <Trash2 />
                              Deletar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                você tem certeza em deletar carteira{' '}
                                <span className="text-red-500 underline">
                                  {wallet.name}
                                </span>
                                ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isto irá
                                deletar permanentemente sua carteira e todas
                                transações.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button variant="destructive">Continue</Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
