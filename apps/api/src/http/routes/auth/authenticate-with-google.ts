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
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const googleOAuthURL = new URL('https://oauth2.googleapis.com/token')

      googleOAuthURL.searchParams.set('client_id', env.OAUTH_GOOGLE_CLIENT_ID)
      googleOAuthURL.searchParams.set(
        'client_secret',
        env.OAUTH_GOOGLE_CLIENT_ID,
      )
      googleOAuthURL.searchParams.set(
        'redirect_uri',
        'http://localhost:3000/sessions/oauth/google',
      )
      googleOAuthURL.searchParams.set('grant_type', 'authorization_code')

      googleOAuthURL.searchParams.set('code', code)

      const googleAcessTokenResponse = await fetch(googleOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const googleAcessTokenData = await googleAcessTokenResponse.json()

      const { access_token: googleAccessToken } = z
        .object({
          acess_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(googleAcessTokenData)

      const googleUserResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleAccessToken}`,
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      )

      const googleUserData = await googleUserResponse.json()

      console.log(googleUserData)

      return reply.status(201).send({ token: code })
    },
  )
}
