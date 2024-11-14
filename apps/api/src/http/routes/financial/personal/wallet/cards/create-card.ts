import { BrandCardType } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function createCard(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/wallet/card',
      {
        schema: {
          body: z.object({
            name: z.string(),
            brand: z.nativeEnum(BrandCardType),
            limit: z.number(),
            walletId: z.string().uuid(),
          }),
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              id: z.string(),
            }),

            500: z.object({
              error: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { name, brand, limit, walletId } = request.body

        try {
          const walletExist = await prisma.wallet.findFirst({
            where: {
              id: walletId,
              ownerId: userId,
            },
          })

          if (!walletExist) {
            throw new BadRequestError('Carteira não encontrada!')
          }

          const card = await prisma.card.create({
            data: {
              name,
              brand,
              limit: Number(limit) * 100,
              walletId,
              ownerId: userId,
            },
          })

          reply.status(201).send({
            id: card.id,
          })
        } catch (e) {
          reply.status(500).send({
            error: true,
            message:
              'Ocorreu um erro ao cria seu cartão, tente novamente mais tarde!',
          })
        }
      },
    )
}
