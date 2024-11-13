import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    JWT_SECRET: z.string(),
    DATABASE_URL: z.string().optional(),
    PORT: z.coerce.number().default(3333),

    GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
    GOOGLE_OAUTH_CLIENT_ID: z.string(),
    GOOGLE_OAUTH_REDIRECT_URI: z.string(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string(),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
  },
  emptyStringAsUndefined: true,
})
