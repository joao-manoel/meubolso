'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

import {
  Breadcrumb as Bread,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type TBreadcrumbProps = {
  homeElement: ReactNode
  capitalizeLinks?: boolean
}

const translate = (text: string) => {
  switch (text) {
    case 'Dashboard':
      return 'Inicio'
    case 'Settings':
      return 'Configurações'
    case 'Incomes':
      return 'Receitas'
    case 'Expenses':
      return 'Despesas'
    case 'Wallets':
      return 'Carteiras'
    case 'Cards':
      return 'Cartões'
    case 'Transactions':
      return 'Transações'
    default:
      return text
  }
}

const Breadcrumb = ({
  homeElement,
  capitalizeLinks = false,
}: TBreadcrumbProps) => {
  const pathname = usePathname()
  const pathNames = pathname.split('/').filter((path) => path)

  return (
    <Bread>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Link href="/">{homeElement}</Link>
          </BreadcrumbPage>
        </BreadcrumbItem>

        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`
          const isActive = pathname === href
          const itemLink = capitalizeLinks
            ? link.charAt(0).toUpperCase() + link.slice(1)
            : link

          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}

              <BreadcrumbItem>
                <BreadcrumbPage className={isActive ? 'active-class' : ''}>
                  <Link href={href}>{translate(itemLink)}</Link>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Bread>
  )
}

export default Breadcrumb
