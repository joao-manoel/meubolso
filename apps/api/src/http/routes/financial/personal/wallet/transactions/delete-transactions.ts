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
      '/wallet/:walletId/transaction/:transactionId',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Delete transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            transactionId: z.string().uuid(),
            walletId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { walletId, transactionId } = request.params

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

        const transaction = await prisma.transaction.findUnique({
          where: {
            id: transactionId,
            wallet: {
              id: walletId,
              ownerId: userId,
            },
          },
        })

        if (!transaction) {
          throw new BadRequestError('Transaction not found.')
        }

        await prisma.transaction.delete({
          where: {
            id: transaction.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
