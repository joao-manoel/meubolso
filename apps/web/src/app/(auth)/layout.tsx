export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="max-h-screen min-h-screen overflow-hidden">{children}</div>
  )
}
