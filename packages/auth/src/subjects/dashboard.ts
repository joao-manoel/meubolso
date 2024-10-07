import { z } from 'zod'

export const dashboardSubject = z.tuple([
  z.literal('view'),
  z.literal('dashboard'),
])

export type DashboardSubject = z.infer<typeof dashboardSubject>
