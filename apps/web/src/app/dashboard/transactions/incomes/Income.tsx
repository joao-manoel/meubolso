'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getWallet } from '@/http/get-wallet'

import CreateIncomeForm from './create-income-form'

export default async function Income() {
  const walletSlug = cookies().get('wallet')?.value

  if (!walletSlug) redirect('/dashboard')

  const { card } = await getWallet(walletSlug)

  console.log(card)

  return <CreateIncomeForm UserCard={card} />
}
