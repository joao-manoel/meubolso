import './globals.css'

import type { Metadata } from 'next'

import Providers from './providers'

export const metadata: Metadata = {
  title: 'Meu Bolso',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-Br" suppressHydrationWarning={true}>
      <body cz-shortcut-listen="true">
        <div className="flex flex-col pb-6">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
