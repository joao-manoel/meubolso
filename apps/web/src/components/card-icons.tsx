import { BBIcon, DefaultCardIcon, NubankIcon } from '@/components/icons'

export const CardIcon = (icon: string) => {
  switch (icon) {
    case 'NUBANK':
      return <NubankIcon />
    case 'BB':
      return <BBIcon />
    default:
      return <DefaultCardIcon />
  }
}
