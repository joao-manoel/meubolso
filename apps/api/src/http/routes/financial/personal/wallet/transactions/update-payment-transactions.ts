import { RecurrenceType, TransactionStatusType } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function updatePaymentTransactions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/wallet/:walletId/update-payment/transactions',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Pay transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string().uuid(),
          }),
          body: z.object({
            transactions: z.array(
              z.object({
                id: z.string().uuid(),
                recurrence: z.nativeEnum(RecurrenceType),
                payDate: z.string().optional(),
                paidAt: z.string().optional(),
                status: z.nativeEnum(TransactionStatusType).optional(),
                installments: z
                  .array(
                    z.object({
                      id: z.string().uuid(),
                    }),
                  )
                  .optional(),
              }),
            ),
          }),
          response: {
            204: z.null(),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
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

          // Process each transaction based on its recurrence type
          for (const transaction of transactions) {
            const payDate = transaction.payDate
              ? new Date(transaction.payDate)
              : new Date()
            const paidAt = transaction.paidAt
              ? new Date(transaction.paidAt)
              : new Date()

            if (
              transaction.recurrence === RecurrenceType.MONTH ||
              transaction.recurrence === RecurrenceType.YEAR
            ) {
              // Determine installment number for recurring transactions
              const installmentCount = await prisma.installments.count({
                where: { transactionId: transaction.id },
              })

              await prisma.installments.create({
                data: {
                  transactionId: transaction.id,
                  installment: installmentCount + 1, // Increment based on existing installments
                  status: transaction.status || TransactionStatusType.paid,
                  payDate,
                  paidAt,
                  isRecurring: transaction.recurrence === RecurrenceType.MONTH,
                },
              })
            } else if (
              transaction.recurrence === RecurrenceType.VARIABLE &&
              !transaction.installments
            ) {
              // Update the transaction directly
              await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                  status: transaction.status || TransactionStatusType.paid,
                  payDate,
                },
              })
            } else if (
              transaction.installments &&
              transaction.recurrence === RecurrenceType.VARIABLE
            ) {
              // Update specific installment if provided
              for (const installment of transaction.installments) {
                await prisma.installments.updateMany({
                  where: {
                    transactionId: transaction.id,
                    id: installment.id,
                  },
                  data: {
                    status: transaction.status || TransactionStatusType.paid,
                    paidAt,
                  },
                })

                const installmentData = await prisma.installments.findMany({
                  where: {
                    transactionId: transaction.id,
                  },
                })

                if (
                  installmentData.every(
                    (installment) =>
                      installment.status === TransactionStatusType.paid,
                  )
                ) {
                  await prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: TransactionStatusType.paid },
                  })
                }
              }
            }
          }

          return reply.status(204).send()
        } catch (error) {
          console.error('Error updating payment transactions:', error)
          return reply
            .status(500)
            .send({ error: 'Failed to update payment transactions' })
        }
      },
    )
}
