import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function deleteTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/wallet/:walletId/transactions',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Delete transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string().uuid(),
          }),
          body: z.object({
            transactions: z.array(z.string().uuid()),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { walletId } = request.params
        const { transactions } = request.body

        const wallet = await prisma.wallet.findUnique({
          where: {
            id: walletId,
            ownerId: userId,
            type: 'PERSONAL',
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found.')
        }

        await prisma.transaction.deleteMany({
          where: {
            id: { in: transactions },
            walletId,
          },
        })

        return reply.status(204).send()
      },
    )
}
