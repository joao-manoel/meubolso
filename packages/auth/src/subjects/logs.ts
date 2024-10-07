import { z } from 'zod'

export const logSubject = z.tuple([
  z.union([z.literal('view'), z.literal('update'), z.literal('delete')]),
  z.literal('log'),
])

export type StoreSubject = z.infer<typeof logSubject>
