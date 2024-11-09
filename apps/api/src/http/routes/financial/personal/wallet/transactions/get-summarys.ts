import { TransactionStatusType, TransactionType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { getMonthInterval } from '@/utils/utils'

// Função auxiliar para calcular o resumo de categoria
const calculateCategorySummary = async (
  where: object,
  transactionsTotalAmount: number,
  userId: string,
) => {
  const categorySummary = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      ...where,
      category: {
        OR: [{ isCategoryUser: false }, { userId }],
      },
    },
    _sum: { amount: true },
  })

  const categoryIds = categorySummary.map((item) => item.categoryId)
  const categories = await prisma.categorys.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, title: true },
  })

  return categorySummary.map((item) => {
    const category = categories.find((cat) => cat.id === item.categoryId)
    const totalAmount = item._sum.amount ?? 0
    const percentageOfTotal = transactionsTotalAmount
      ? (totalAmount / transactionsTotalAmount) * 100
      : 0

    return {
      category: category?.title || 'Unknown',
      totalAmount,
      percentageOfTotal: Math.round(percentageOfTotal),
    }
  })
}

export async function getSummarys(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet/:walletId/summary/:year/:month',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Get wallet transactions and category breakdown',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string(),
            month: z.string(),
            year: z.string(),
          }),
          response: {
            200: z.object({
              transactionsTotalAmount: z.number(),
              incomeTotalAmount: z.number(),
              expensesTotalAmount: z.number(),
              investmentTotalAmount: z.number(),
              balanceTotalAmount: z.number(),
              categorySummary: z.array(
                z.object({
                  category: z.string(),
                  totalAmount: z.number(),
                  percentageOfTotal: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { walletId, month, year } = request.params

        const wallet = await prisma.wallet.findFirst({
          where: {
            id: walletId,
            ownerId: userId,
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found')
        }

        const { startOfMonth, endOfMonth } = getMonthInterval(year, month)
        const where = {
          payDate: { gte: startOfMonth, lte: endOfMonth },
          walletId,
          status: TransactionStatusType.paid,
        }

        // Calcular somas para diferentes tipos de transação
        const [expenses, income, investment, transactions] = await Promise.all([
          prisma.transaction.aggregate({
            where: { ...where, type: TransactionType.EXPENSE },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: { ...where, type: TransactionType.INCOME },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: { ...where, type: TransactionType.INVESTMENT },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({ where, _sum: { amount: true } }),
        ])

        const transactionsTotalAmount = transactions._sum.amount ?? 0
        const incomeTotalAmount = income._sum.amount ?? 0
        const expensesTotalAmount = expenses._sum.amount ?? 0
        const investmentTotalAmount = investment._sum.amount ?? 0
        const balanceTotalAmount = incomeTotalAmount - expensesTotalAmount

        const formattedCategorySummary = await calculateCategorySummary(
          where,
          transactionsTotalAmount,
          userId,
        )

        return reply.send({
          transactionsTotalAmount,
          incomeTotalAmount,
          expensesTotalAmount,
          investmentTotalAmount,
          balanceTotalAmount,
          categorySummary: formattedCategorySummary,
        })
      },
    )
}
