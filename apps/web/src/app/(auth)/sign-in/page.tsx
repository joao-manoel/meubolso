'use client'
import Image from 'next/image'

import googleIcon from '@/assets/image/google-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithGoogleAction } from '../action'

export default function SignInPage() {
  return (
    <>
      <form className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
          />
        </div>

        <Button className="w-full" type="submit" disabled>
          Continuar
        </Button>
      </form>

      <form className="mt-4" action={signInWithGoogleAction}>
        <div className="flex flex-col gap-2 space-y-1">
          <Separator />
          <Button variant="outline" className="w-full">
            <Image
              src={googleIcon}
              alt="google icone"
              className="mr-2 size-4"
            />
            <span className="font-medium">Entre com Google</span>
          </Button>
        </div>
      </form>
    </>
  )
}
