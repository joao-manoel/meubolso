import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: z.string(),
    NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI: z.string(),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI:
      process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI,
  },
  emptyStringAsUndefined: true,
})
