import {
  Briefcase,
  Building,
  Car,
  DollarSign,
  File,
  Gift,
  GraduationCap,
  Heart,
  Home,
  LucideProps, // Importando o tipo LucideProps para estender as propriedades do ícone
  Music,
  ShoppingCart,
  Store,
  Tag,
  TrendingUp,
  Trophy,
  Utensils,
  Wrench,
} from 'lucide-react'
import React from 'react'

interface CategoryIconProps extends LucideProps {
  icon: string
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  ...props
}) => {
  switch (icon) {
    case 'FOOD':
      return <Utensils {...props} />
    case 'TRANSPORT':
      return <Car {...props} />
    case 'EDUCATION':
      return <GraduationCap {...props} />
    case 'HEALTH':
      return <Heart {...props} />
    case 'LEISURE':
      return <Music {...props} />
    case 'HOUSING':
      return <Home {...props} />
    case 'SERVICES':
      return <Wrench {...props} />
    case 'SHOPPING':
      return <ShoppingCart {...props} />
    case 'OTHER':
      return <Tag {...props} />

    // Categorias de Receita (INCOME)
    case 'SALARY':
      return <DollarSign {...props} />
    case 'FREELANCE':
      return <Briefcase {...props} />
    case 'INVESTMENTS':
      return <TrendingUp {...props} />
    case 'RENT':
      return <Building {...props} />
    case 'PRIZES':
      return <Trophy {...props} />
    case 'GIFTS':
      return <Gift {...props} />
    case 'SALES':
      return <Store {...props} />

    // Ícone padrão
    default:
      return <File {...props} />
  }
}

export default CategoryIcon
