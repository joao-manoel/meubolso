import { z } from 'zod'

export const storeSubject = z.tuple([
  z.union([
    z.literal('view'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('store'),
])

export type StoreSubject = z.infer<typeof storeSubject>
