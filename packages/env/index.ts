import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string(),
  },
  client: {},
  shared: {
    OAUTH_GOOGLE_CLIENT_ID: z.string(),
    OAUTH_GOOGLE_CLIENT_SECRET: z.string(),
  },
  runtimeEnv: {
    SERVER_PORT: process.env.SERVER_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    OAUTH_GOOGLE_CLIENT_SECRET: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    OAUTH_GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID,
  },
  emptyStringAsUndefined: true,
})
