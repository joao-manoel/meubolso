import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cronota',
  description: 'Aplicação de gestão financeira.',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  )
}
