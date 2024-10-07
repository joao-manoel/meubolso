import { z } from 'zod'

export const ticketSchema = z.object({
  __typename: z.literal('Ticket').default('Ticket'),
  id: z.string(),
  ownerId: z.number(),
})

export type User = z.infer<typeof ticketSchema>
