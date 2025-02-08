import { getSession } from 'next-auth/react'

import { BASE_URL } from '../constants'
import { handleSignOut } from '@/app/actions/actions'

export async function fetchUpdateEvent(eventId: string, data: FormData) {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data
  })

  const event = await response.json()

  if (event.error?.message === 'jwt is expired') await handleSignOut()

  return event
}
