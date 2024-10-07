import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  OWNER(_, { can }) {
    can('manage', 'all')
  },
  ADMIN(_, { can }) {
    can(['view'], 'AdminCommands')
    can(['view'], 'ModCommands')
    can(['view'], 'SupportCommands')
    can(['view'], 'dashboard')
    can(['update'], 'User')
  },
  USER(user, { can }) {
    can(['create', 'get'], 'Ticket')
    can(['update', 'delete', 'lock'], 'Ticket', { ownerId: { $eq: user.id } })
  },
}
