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
