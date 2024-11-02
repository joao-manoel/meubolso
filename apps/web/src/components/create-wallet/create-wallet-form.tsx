'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { SubscriptionType } from '@/http/get-profile'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { createWalletAction } from './actions'

type CreateWalletFormProps = {
  subscription: SubscriptionType
}

export default function CreateWalletForm({
  subscription,
}: CreateWalletFormProps) {
  const router = useRouter()
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    createWalletAction,
    () => {
      router.push(`/dashboard`)
    },
  )

  return (
    <Card className="w-[380px]">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Criar carteira</CardTitle>
          <CardDescription>
            Crie sua nova carteira em um clique.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success === true && message && (
            <Alert variant="default">
              <AlertTriangle className="size-4" />
              <AlertTitle>Carteira criada com sucesso!</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Não foi possivel criar sua carteira</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome da sua carteira"
                className={`${errors?.name && 'border-red-400'}`}
              />
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors?.name && errors.name[0]}
              </p>
            </div>
            {subscription === 'ACTIVE' && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Tipo de carteira</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="PERSONAL">Personal</SelectItem>
                    <SelectItem value="ORGANIZATIONAL">
                      Organizational
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {(subscription === 'NONE' || subscription === 'CANCELLED') && (
              <div className="flex flex-col space-y-1.5">
                <p className="text-center text-sm text-muted-foreground">
                  Faça upgrade para criar carteiras organizacionais.
                </p>
                <Button variant="outline">🎇 Fazer Upgrade</Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Criar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
