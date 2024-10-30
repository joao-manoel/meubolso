import { Sidebar, SidebarContent, SidebarGroup } from '@/components/ui/sidebar'

import { DashboardGroupMenu } from './dashboard-group-menu'
import { SidebarFooter } from './sidebar-footer'
import { SidebarHeader } from './sidebar-header'

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <DashboardGroupMenu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
