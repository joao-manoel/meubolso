import { z } from 'zod'

export const adminCommands = z.tuple([
  z.literal('view'),
  z.literal('AdminCommands'),
])

export const modCommands = z.tuple([
  z.literal('view'),
  z.literal('ModCommands'),
])

export const supportCommands = z.tuple([
  z.literal('view'),
  z.literal('SupportCommands'),
])

export type AdminCommands = z.infer<typeof adminCommands>
export type ModCommands = z.infer<typeof modCommands>
export type SupportCommands = z.infer<typeof supportCommands>
