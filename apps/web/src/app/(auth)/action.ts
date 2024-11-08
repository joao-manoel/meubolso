'use server'

import { redirect } from 'next/navigation'

export async function signInWithGoogleAction() {
  const googleSignInURL = new URL(
    'https://accounts.google.com/o/oauth2/v2/auth',
  )

  googleSignInURL.searchParams.set(
    'client_id',
    '185187910671-iajgjvvctddl16hrf9udmk7dde0k309l.apps.googleusercontent.com',
  )
  googleSignInURL.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback',
  )
  googleSignInURL.searchParams.set('response_type', 'code')
  googleSignInURL.searchParams.set('scope', 'openid profile email')
  googleSignInURL.searchParams.set('access_type', 'offline')

  redirect(googleSignInURL.toString())
}
