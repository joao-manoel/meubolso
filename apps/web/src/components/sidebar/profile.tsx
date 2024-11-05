'use server'

import { auth } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/format'

export async function Profile() {
  const { user } = await auth()

  if (!user) {
    return ''
  }
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.avatar} alt="teste" />
        <AvatarFallback className="rounded-lg">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </>
  )
}
