'use client'
import { ChevronRight, UserRoundPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import googleIcon from '@/assets/google-icon.svg'
import FloatingLabelInput from '@/components/FloatingLabelInput'
import GridPattern from '@/components/ui/animated-grid-pattern'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { signInWithGoogleAction } from '../action'

export default function SignUpPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-10 lg:grid lg:grid-cols-[70%_30%] lg:p-0">
      <div className="z-10 overflow-hidden bg-black lg:block">
        <GridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            'inset-x-[-2%] inset-y-[-30%] skew-y-12',
            '',
          )}
        />
      </div>
      <div className="z-50 flex w-full justify-center lg:justify-end">
        <div className="flex max-h-[800px] w-full max-w-md flex-col space-y-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 shadow-lg lg:h-screen lg:max-h-screen lg:rounded-none lg:bg-zinc-900">
          <h1 className="mb-8 mt-16 text-2xl font-bold text-gray-200 max-md:mb-8 max-md:mt-12">
            Acesse sua conta
          </h1>
          <form action="" className="w-full space-y-8">
            <div className="w-full space-y-1">
              <FloatingLabelInput label="Seu email" name="email" type="email" />
            </div>

            <div className="space-y-1">
              <FloatingLabelInput
                label="Sua senha"
                name="password"
                type="password"
              />

              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-foreground text-zinc-300 hover:underline"
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
            className="mt-5 flex w-full items-center gap-6 pt-8 max-md:mt-12 max-sm:flex-col max-sm:items-start max-sm:gap-2 lg:mt-16"
          >
            <span className="relative z-10 flex w-full justify-center whitespace-nowrap text-center text-gray-200">
              <i className="absolute top-[12px] block h-[1px] w-full bg-zinc-950 sm:hidden" />
              <p className="z-20 w-fit bg-zinc-900 pl-2 pr-2 lg:bg-transparent">
                Ou se preferir
              </p>
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
                  Se cadastre-se gratuitamente!
                </span>
              </div>
              <ChevronRight className="ml-auto size-4 self-center text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
