import { TransactionType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getTransactionsCategorys(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transactions/categorys',
      {
        schema: {
          tags: ['Categorys'],
          summary: 'Get Wallet Transactions Categorys',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                icon: z.string(),
                isCategoryUser: z.boolean(),
                transactionType: z.nativeEnum(TransactionType),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        try {
          const categorys = await prisma.categorys.findMany({
            where: {
              OR: [{ isCategoryUser: false }, { userId }],
            },
            select: {
              id: true,
              title: true,
              icon: true,
              isCategoryUser: true,
              transactionType: true,
            },
          })

          return reply.send(categorys)
        } catch (error) {
          throw new Error('Unable to load categories.')
        }
      },
    )
}
