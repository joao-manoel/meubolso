import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import {
  adminCommands,
  modCommands,
  supportCommands,
} from './subjects/commands'
import { dashboardSubject } from './subjects/dashboard'
import { postSubject } from './subjects/post'
import { storeSubject } from './subjects/store'
import { ticketSubject } from './subjects/ticket'
import { userSubject } from './subjects/user'

const appAbilitiesSchema = z.union([
  userSubject,
  postSubject,
  ticketSubject,
  dashboardSubject,
  storeSubject,
  modCommands,
  adminCommands,
  supportCommands,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  return ability
}
