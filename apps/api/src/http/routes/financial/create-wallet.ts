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
            wallet: {
              name: wallet.name,
              slug: wallet.slug,
            },
          })
        } catch (e) {
          reply.status(500).send({
            error:
              'Ocorreu um erro ao cria a carteira, tente novamente mais tarde!',
          })
        }
      },
    )
}
