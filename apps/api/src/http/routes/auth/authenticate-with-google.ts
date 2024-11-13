import { env } from '@mb/env'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/session/google',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with Google',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string().optional(),
            message: z.string().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const googleOAuthURL = new URL('https://oauth2.googleapis.com/token')

      googleOAuthURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
      googleOAuthURL.searchParams.set(
        'client_secret',
        env.GOOGLE_OAUTH_CLIENT_SECRET,
      )
      googleOAuthURL.searchParams.set(
        'redirect_uri',
        env.GOOGLE_OAUTH_REDIRECT_URI,
      )
      googleOAuthURL.searchParams.set('grant_type', 'authorization_code')
      googleOAuthURL.searchParams.set('code', code)

      const googleAcessTokenResponse = await fetch(googleOAuthURL.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      })

      if (!googleAcessTokenResponse.ok) {
        return reply.status(googleAcessTokenResponse.status).send({
          message: 'Failed to obtain Google access token',
        })
      }

      const googleAcessTokenData = await googleAcessTokenResponse.json()

      // Validar e extrair o token de acesso
      const { access_token: googleAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('Bearer'),
          scope: z.string(),
        })
        .parse(googleAcessTokenData)

      // Requisição para obter informações do usuário autenticado
      const googleUserResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleAccessToken}`,
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      )

      if (!googleUserResponse.ok) {
        return reply.status(googleUserResponse.status).send({
          message: 'Failed to fetch Google user information',
        })
      }

      const googleUserData = await googleUserResponse.json()

      const {
        id: googleId,
        name,
        email,
        picture: avatarUrl,
      } = z
        .object({
          id: z.string(),
          name: z.string().nullable(),
          email: z.string().nullable(),
          picture: z.string().url(),
        })
        .parse(googleUserData)

      if (email === null) {
        throw new BadRequestError(
          'Your Google account mst have an email to authenticate',
        )
      }

      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GOOGLE',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GOOGLE',
            providerAccountId: googleId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
