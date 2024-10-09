'use client'
import { ChevronRight, UserRoundPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import googleIcon from '@/assets/google-icon.svg'
import GridPattern from '@/components/ui/animated-grid-pattern'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { signInWithGoogleAction } from '../action'

export default function SignInPage() {
  return (
    <div className="grid h-screen grid-cols-[70%_30%]">
      <div className="bg-black">
        <GridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-30%] skew-y-12',
          )}
        />
      </div>
      <div className="flex justify-center">
        <div className="flex h-screen w-full max-w-md flex-col justify-center space-y-4 shadow-lg">
          <h1 className="mb-8 mt-16 text-2xl font-bold text-gray-200 max-md:mb-8 max-md:mt-12">
            Acesse sua conta
          </h1>
          <form action="" className="w-full space-y-4">
            <div className="w-full space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                name="email"
                type="email"
                id="email"
                placeholder="Seu e-mail"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Senha</Label>
              <Input
                name="password"
                type="password"
                id="password"
                placeholder="Sua senha"
              />

              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-foreground hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              className="AuiButton-root relative inline-flex w-full flex-shrink-0 cursor-pointer items-center justify-center rounded border-none bg-orange-500 px-4 py-3 font-bold text-white transition-colors duration-200 ease-in-out hover:enabled:bg-orange-600 disabled:cursor-not-allowed disabled:select-none disabled:opacity-50 [&_svg]:size-6"
              type="submit"
            >
              <div className="flex flex-1 items-center justify-center gap-2">
                <span className="AuiButton-label px-1 text-base leading-6">
                  Entrar
                </span>
              </div>
            </Button>
          </form>

          <form
            action={signInWithGoogleAction}
            className="mt-16 flex w-full items-center gap-6 pt-8 max-md:mt-12 max-sm:flex-col max-sm:items-start max-sm:gap-2"
          >
            <span className="whitespace-nowrap text-gray-200">
              Ou se preferir
            </span>
            <Button
              className="w-full"
              type="submit"
              variant="outline"
              size="lg"
            >
              <Image
                src={googleIcon}
                alt="google icone"
                className="mr-2 size-4"
              />
              <span className="font-medium">Entre com google</span>
            </Button>
          </form>
          <Separator />
          <Link href="/sign-up">
            <div className="flex w-full gap-4 rounded-md border border-gray-600 bg-zinc-900 px-6 py-4 transition hover:brightness-125">
              <UserRoundPlus className="size-5 text-orange-400" />
              <div className="flex flex-col text-gray-200">
                Não tem uma conta?
                <span className="font-medium text-orange-400">
                  Se cadastre-se gratuitamente
                </span>
              </div>
              <ChevronRight className="ml-auto self-center text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
