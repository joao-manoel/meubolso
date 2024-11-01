import { Loader2 } from 'lucide-react'
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
  const [, handleSubmit, isPending] = useFormState(createWalletAction)

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Criar carteira</CardTitle>
        <CardDescription>Crie sua nova carteira em um clique.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Nome da sua carteira" />
            </div>
            {subscription === 'ACTIVE' && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Tipo de carteira</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="organizational">
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
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button type="submit">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Criar'}
        </Button>
      </CardFooter>
    </Card>
  )
}
