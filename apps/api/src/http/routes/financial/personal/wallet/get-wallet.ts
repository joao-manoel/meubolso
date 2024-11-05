import { IconCardType, WalletType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getWallet(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet/:walletSlug',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Get wallet',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletSlug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
                type: z.nativeEnum(WalletType),
                card: z.array(
                  z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    icon: z.nativeEnum(IconCardType),
                    limit: z.number(),
                  }),
                ),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        try {
          const wallets = await prisma.wallet.findMany({
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              card: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  limit: true,
                },
              },
            },
            where: {
              ownerId: userId,
              type: 'PERSONAL',
            },
          })

          return reply.send(wallets)
        } catch (error) {
          throw new Error('Database error.')
        }
      },
    )
}
