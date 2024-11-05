import { IconCardType, WalletType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getWallet(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet/:walletId',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Get wallet',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string(),
          }),
          response: {
            200: z.object({
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
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { walletId } = request.params

        try {
          const wallet = await prisma.wallet.findFirst({
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
              id: walletId,
              type: 'PERSONAL',
            },
          })

          if (!wallet) {
            throw new BadRequestError('Wallet not found.')
          }

          return reply.send({
            id: wallet.id,
            name: wallet.name,
            slug: wallet.slug,
            type: wallet.type,
            card: wallet.card,
          })
        } catch (error) {
          throw new Error('Database error.')
        }
      },
    )
}
