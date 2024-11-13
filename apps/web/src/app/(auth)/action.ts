'use server'

import { env } from '@mb/env'
import { redirect } from 'next/navigation'

export async function signInWithGoogleAction() {
  const googleSignInURL = new URL(
    'https://accounts.google.com/o/oauth2/v2/auth',
  )

  googleSignInURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
  googleSignInURL.searchParams.set(
    'redirect_uri',
    env.GOOGLE_OAUTH_REDIRECT_URI,
  )
  googleSignInURL.searchParams.set('response_type', 'code')
  googleSignInURL.searchParams.set('scope', 'openid profile email')
  googleSignInURL.searchParams.set('access_type', 'offline')

  redirect(googleSignInURL.toString())
}
