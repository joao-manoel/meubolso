import { TransactionStatusType, TransactionType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getBalances(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/wallet/:walletId/balance',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Get personal wallet transactions balance',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string(),
          }),
          body: z.object({
            date: z.string(),
          }),
          response: {
            200: z.object({
              incomeAmount: z.number(),
              expensesAmount: z.number(),
              investmentAmount: z.number(),
              balanceAmount: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { walletId } = request.params
        const { date } = request.body

        const wallet = await prisma.wallet.findFirst({
          where: {
            id: walletId,
            ownerId: userId,
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found')
        }

        // Extrai o ano e o mês da string de data fornecida
        const parsedDate = new Date(date)
        const year = parsedDate.getUTCFullYear()
        const month = parsedDate.getUTCMonth()

        // Define o início e o fim do mês com base no ano e mês extraídos
        const startOfMonth = new Date(Date.UTC(year, month, 1))
        const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59))

        const where = {
          payDate: { gte: startOfMonth, lte: endOfMonth },
        }

        const expenses = await prisma.transaction.aggregate({
          where: {
            ...where,
            walletId,
            type: TransactionType.EXPENSE,
            status: TransactionStatusType.paid,
          },
          _sum: { amount: true },
        })

        const income = await prisma.transaction.aggregate({
          where: {
            ...where,
            walletId,
            type: TransactionType.INCOME,
            status: TransactionStatusType.paid,
          },
          _sum: { amount: true },
        })

        const investment = await prisma.transaction.aggregate({
          where: {
            ...where,
            walletId,
            type: TransactionType.INVESTMENT,
            status: TransactionStatusType.paid,
          },
          _sum: { amount: true },
        })

        const expensesAmount = expenses._sum.amount ?? 0

        const incomeAmount = income._sum.amount ?? 0
        const investmentAmount = investment._sum.amount ?? 0
        const balanceAmount = incomeAmount - expensesAmount

        return reply.send({
          incomeAmount,
          expensesAmount,
          investmentAmount,
          balanceAmount,
        })
      },
    )
}
