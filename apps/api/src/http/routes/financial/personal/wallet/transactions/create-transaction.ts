import {
  RecurrenceType,
  TransactionStatusType,
  TransactionType,
} from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function createTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/wallet/:walletId/transaction/',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Create transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string().uuid(),
          }),
          body: z.object({
            title: z.string(),
            amount: z.number(),
            type: z.nativeEnum(TransactionType),
            payDate: z.string(),
            recurrence: z.nativeEnum(RecurrenceType),
            categoryId: z.string().uuid(),
            cardId: z.string(),
            status: z.nativeEnum(TransactionStatusType),
            installments: z
              .array(
                z.object({
                  installmente: z.number(),
                  status: z.nativeEnum(TransactionStatusType),
                  payDate: z.string().optional(),
                  paidAt: z.string().optional(),
                }),
              )
              .optional(),
          }),
          response: {
            201: z.object({
              transactionId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { walletId } = request.params

        const {
          title,
          amount,
          payDate,
          cardId,
          type,
          status,
          installments,
          categoryId,
          recurrence,
        } = request.body

        try {
          const wallet = await prisma.wallet.findFirst({
            where: {
              id: walletId,
              ownerId: userId,
            },
          })

          if (!wallet) {
            throw new BadRequestError('Wallet not found.')
          }

          const card = await prisma.card.findUnique({
            where: {
              id: cardId,
              ownerId: userId,
            },
          })

          if (!card) {
            throw new BadRequestError('Card not found.')
          }

          const payDateObj = new Date(payDate)
          if (isNaN(payDateObj.getTime())) {
            throw new BadRequestError('Invalid pay date')
          }

          const transaction = await prisma.transaction.create({
            data: {
              title,
              amount,
              status,
              payDate: payDateObj,
              categoryId,
              recurrence,
              type,
              cardId,
              walletId: wallet.id,
              ...(installments && {
                installments: {
                  create: installments.map((installment) => ({
                    status: installment.status,
                    installment: installment.installmente,
                    payDate: installment.payDate,
                    paidAt: installment.paidAt,
                  })),
                },
              }),
            },
          })

          reply.status(201).send({
            transactionId: transaction.id,
          })
        } catch (err) {
          throw new BadRequestError(
            'Unable to create transaction, please try again later!',
          )
        }
      },
    )
}
