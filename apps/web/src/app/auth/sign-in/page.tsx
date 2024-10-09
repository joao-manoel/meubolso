'use client'
import Image from 'next/image'
import Link from 'next/link'

import googleIcon from '@/assets/google-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithGoogleAction } from '../action'

export default function SignInPage() {
  return (
    <div className="space-y-4">
      <form action="" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Senha</Label>
          <Input name="password" type="password" id="password" />

          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <Button className="w-full" type="submit">
          Sign in with e-mail
        </Button>
      </form>
      <Separator />
      <form action={signInWithGoogleAction}>
        <Button className="w-full" type="submit" variant="outline">
          <Image src={googleIcon} alt="google icone" className="mr-2 size-4" />
          Sign in with Google
        </Button>
      </form>
    </div>
  )
}
