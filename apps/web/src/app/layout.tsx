import './globals.css'

import type { Metadata } from 'next'

import Providers from './providers'

export const metadata: Metadata = {
  title: 'Cronota',
  description: 'Aplicação de gestão financeira.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-Br" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
