import { WalletType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getWallets(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallets',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Get personal wallets',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                type: z.nativeEnum(WalletType),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const wallets = await prisma.wallet.findMany({
          select: {
            id: true,
            name: true,
            type: true,
          },
          where: {
            ownerId: userId,
          },
        })

        return reply.send(wallets)
      },
    )
}
