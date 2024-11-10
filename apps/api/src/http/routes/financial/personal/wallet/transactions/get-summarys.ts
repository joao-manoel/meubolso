import {
  RecurrenceType,
  TransactionStatusType,
  TransactionType,
} from '@prisma/client'
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
          OR: [
            {
              payDate: { gte: startOfMonth, lte: endOfMonth },
              walletId,
              status: TransactionStatusType.paid,
            },
            {
              recurrence: RecurrenceType.MONTH,
              walletId,
              installments: {
                some: {
                  status: TransactionStatusType.paid,
                  payDate: { gte: startOfMonth, lte: endOfMonth },
                },
              },
            },
            {
              recurrence: RecurrenceType.VARIABLE,
              walletId,
              installments: {
                some: {
                  status: TransactionStatusType.paid,
                  payDate: { gte: startOfMonth, lte: endOfMonth },
                },
              },
            },
          ],
        }

        const [expenses, income, investment, transactions] = await Promise.all([
          prisma.transaction.aggregate({
            where: {
              ...where,
              type: TransactionType.EXPENSE,
              recurrence: { not: RecurrenceType.VARIABLE },
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: {
              ...where,
              type: TransactionType.INCOME,
              recurrence: { not: RecurrenceType.VARIABLE },
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: {
              ...where,
              type: TransactionType.INVESTMENT,
              recurrence: { not: RecurrenceType.VARIABLE },
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({ where, _sum: { amount: true } }),
        ])

        const variableTransactionsWithInstallments =
          await prisma.transaction.findMany({
            where: {
              walletId,
              recurrence: RecurrenceType.VARIABLE,
              installments: {
                some: {
                  status: TransactionStatusType.paid,
                  payDate: { gte: startOfMonth, lte: endOfMonth },
                },
              },
            },
            include: {
              installments: true,
            },
          })

        let incomeTotalAmount = income._sum.amount ?? 0
        let expensesTotalAmount = expenses._sum.amount ?? 0

        variableTransactionsWithInstallments.forEach((transaction) => {
          const installmentCount = transaction.installments.length
          const installmentAmount = installmentCount
            ? transaction.amount / installmentCount
            : 0

          transaction.installments.forEach((installment) => {
            if (
              installment.status === TransactionStatusType.paid &&
              installment.payDate &&
              installment.payDate >= startOfMonth &&
              installment.payDate <= endOfMonth
            ) {
              if (transaction.type === TransactionType.INCOME) {
                incomeTotalAmount += installmentAmount
              } else if (transaction.type === TransactionType.EXPENSE) {
                expensesTotalAmount += installmentAmount
              }
            }
          })
        })

        const balanceTotalAmount = incomeTotalAmount - expensesTotalAmount

        const formattedCategorySummary = await calculateCategorySummary(
          where,
          transactions._sum.amount ?? 0,
          userId,
        )

        return reply.send({
          transactionsTotalAmount: transactions._sum.amount ?? 0,
          incomeTotalAmount,
          expensesTotalAmount,
          investmentTotalAmount: investment._sum.amount ?? 0,
          balanceTotalAmount,
          categorySummary: formattedCategorySummary,
        })
      },
    )
}
