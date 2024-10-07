import { z } from 'zod'

export const postSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('delete'),
    z.literal('update'),
  ]),
  z.literal('Post'),
])

export type PostSubject = z.infer<typeof postSubject>
