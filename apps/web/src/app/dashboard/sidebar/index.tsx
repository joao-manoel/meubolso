import * as React from 'react'

import {
  Sidebar as Nav,
  SidebarContent,
  SidebarRail,
} from '@/components/ui/sidebar'

import { DashboardNav } from './dashboard-nav'
import { DashboardSidebarFooter } from './dashboard-sidebar-footer'
import { DashboardSidebarHeader } from './dashboard-sidebar-header'
import { FinancialNav } from './financial-nav'
// This is sample data.

export default function Sidebar() {
  return (
    <Nav collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarContent>
        <DashboardNav />
        <FinancialNav />
      </SidebarContent>
      <DashboardSidebarFooter />
      <SidebarRail />
    </Nav>
  )
}
