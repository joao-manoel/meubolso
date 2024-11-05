import { TransactionType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getCategorys(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet/:walletId/:type/categorys',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Get categorys',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string(),
            type: z.nativeEnum(TransactionType),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                icon: z.string(),
                isCategoryUser: z.boolean(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { walletId, type } = request.params

        try {
          const wallet = await prisma.wallet.findFirst({
            where: {
              id: walletId,
              ownerId: userId,
            },
          })

          if (!wallet) {
            throw new BadRequestError('wallet not found.')
          }

          const categorys = await prisma.categorys.findMany({
            where: {
              walletId: wallet.id,
              userId,
              transactionType: type,
            },
            select: {
              id: true,
              title: true,
              icon: true,
              isCategoryUser: true,
            },
          })

          return reply.send(categorys)
        } catch (error) {
          throw new Error('Database error.')
        }
      },
    )
}
