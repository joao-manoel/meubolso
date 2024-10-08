import { env } from '@cro/env'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
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
      try {
        const { code } = request.body

        const googleOAuthURL = new URL('https://oauth2.googleapis.com/token')

        googleOAuthURL.searchParams.set('client_id', env.OAUTH_GOOGLE_CLIENT_ID)
        googleOAuthURL.searchParams.set(
          'client_secret',
          env.OAUTH_GOOGLE_CLIENT_SECRET,
        ) // Corrigir client_secret
        googleOAuthURL.searchParams.set(
          'redirect_uri',
          'http://localhost:3000/sessions/oauth/google',
        )
        googleOAuthURL.searchParams.set('grant_type', 'authorization_code')
        googleOAuthURL.searchParams.set('code', code)

        // Fazer a requisição para obter o token de acesso do Google
        const googleAcessTokenResponse = await fetch(
          googleOAuthURL.toString(),
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
            },
          },
        )

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

        console.log('User Data:', googleUserData)

        // Aqui você pode gerar um token JWT para seu sistema ou gerenciar o login conforme necessário
        return reply.status(201).send({ token: code }) // Troque `code` por um JWT gerado, se necessário
      } catch (error) {
        console.error('Error authenticating with Google:', error)
        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    },
  )
}
