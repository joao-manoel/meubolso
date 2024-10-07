import { z } from 'zod'

import { ticketSchema } from '../models/ticket'

export const ticketSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('lock'),
    z.literal('delete'),
    z.literal('update'),
  ]),
  z.union([z.literal('Ticket'), ticketSchema]),
])

export type PostSubject = z.infer<typeof ticketSubject>
