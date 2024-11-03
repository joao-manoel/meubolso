import {
  IconCardType,
  TransactionStatusType,
  TransactionType,
} from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getTransactions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet/:walletSlug/transactions/:type',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Get personal wallet transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletSlug: z.string(),
            type: z.nativeEnum(TransactionType),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                description: z.string(),
                amount: z.number(),
                type: z.nativeEnum(TransactionType),
                payDate: z.date(),
                status: z.nativeEnum(TransactionStatusType),
                card: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  icon: z.nativeEnum(IconCardType),
                }),
                wallet: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                }),
                installments: z
                  .array(
                    z.object({
                      id: z.string().uuid(),
                      installment: z.number(),
                      status: z.nativeEnum(TransactionStatusType),
                      payDate: z.date().nullish(),
                      paidAt: z.date().nullish(),
                    }),
                  )
                  .optional(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { walletSlug, type } = request.params

        const wallet = await prisma.wallet.findFirst({
          where: {
            slug: walletSlug,
            ownerId: userId,
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found')
        }

        const transactions = await prisma.transaction.findMany({
          select: {
            id: true,
            description: true,
            status: true,
            amount: true,
            type: true,
            payDate: true,
            card: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
            wallet: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            installments: {
              select: {
                id: true,
                installment: true,
                payDate: true,
                paidAt: true,
                status: true,
              },
            },
          },
          where: {
            walletId: wallet.id,
            type,
          },
          orderBy: {
            payDate: 'desc',
          },
        })

        return reply.send(transactions)
      },
    )
}
