export function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return initials
}

export function transformTypeWalletText(text: string) {
  switch (text) {
    case 'PERSONAL':
      return 'Pessoal'
    case 'ORGANIZATION':
      return 'Organização'
  }
}

export function formatDate(value: string) {
  const date = new Date(value)

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100)
}
