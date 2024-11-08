'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import Input from '@/components/Input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useFormState } from '@/hooks/use-form-state'

import { createWalletAction } from './action'

export default function CreatePersonalWalletForm() {
  const router = useRouter()
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    createWalletAction,
    () => {
      router.push(`/dashboard`)
      toast.success('Carteira criada com sucesso!', {
        description: 'Você foi direcionado para a dashboard.',
        action: {
          label: 'Dispensar',
          onClick: () => toast.dismiss(),
        },
      })
    },
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Ops! não foi possivel criar sua carteira!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="default">
          <AlertTriangle className="size-4" />
          <AlertTitle>Carteira criada com sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Input
          name="name"
          id="name"
          label="Nome da carteira"
          className="w-full"
        />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Criar'}
      </Button>
    </form>
  )
}
