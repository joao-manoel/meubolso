import { z } from 'zod'

export const roleSchema = z.union([
  z.literal('OWNER'),
  z.literal('ADMIN'),
  z.literal('USER'),
])

export type Role = z.infer<typeof roleSchema>
