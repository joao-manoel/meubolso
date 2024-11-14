import fastifyCors from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { env } from '@mb/env'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { authenticateWithGoogle } from './routes/auth/authenticate-with-google'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { createCard } from './routes/financial/personal/wallet/cards/create-card'
import { createWallet } from './routes/financial/personal/wallet/create-wallet'
import { deleteWallet } from './routes/financial/personal/wallet/delete-wallet'
import { getWallet } from './routes/financial/personal/wallet/get-wallet'
import { getWallets } from './routes/financial/personal/wallet/get-wallets'
import { createTransaction } from './routes/financial/personal/wallet/transactions/create-transaction'
import { deleteTransaction } from './routes/financial/personal/wallet/transactions/delete-transactions'
import { getSummarys } from './routes/financial/personal/wallet/transactions/get-summarys'
import { getTransactions } from './routes/financial/personal/wallet/transactions/get-transactions'
import { getTransactionsPerType } from './routes/financial/personal/wallet/transactions/get-transactions-per-type'
import { updatePaymentTransactions } from './routes/financial/personal/wallet/transactions/update-payment-transactions'
import { getTransactionsCategorys } from './routes/financial/transactions/categorys/get-transactions-categorys'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithGoogle)
app.register(getProfile)

app.register(getWallets)
app.register(getWallet)
app.register(createWallet)
app.register(deleteWallet)

app.register(getTransactionsPerType)
app.register(getTransactions)
app.register(deleteTransaction)
app.register(createTransaction)
app.register(getSummarys)

app.register(createCard)

app.register(getTransactionsCategorys)
app.register(updatePaymentTransactions)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`🔥 Server listening on ${env.PORT}`)
})
