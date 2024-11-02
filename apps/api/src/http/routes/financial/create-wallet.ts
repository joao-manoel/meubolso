import { WalletType } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/format'

export async function createWallet(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/wallet',
      {
        schema: {
          body: z.object({
            name: z.string(),
            type: z.nativeEnum(WalletType).optional(),
          }),
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
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

        const { name, type } = request.body

        const slug = createSlug(name)

        try {
          const wallet = await prisma.wallet.create({
            data: {
              ownerId: userId,
              slug,
              name,
              ...(type && { type }),
            },
          })

          reply.status(201).send({
            id: wallet.id,
            name: wallet.name,
            slug: wallet.slug,
          })
        } catch (e) {
          reply.status(500).send({
            error: true,
            message:
              'Ocorreu um erro ao cria a carteira, tente novamente mais tarde!',
          })
        }
      },
    )
}
