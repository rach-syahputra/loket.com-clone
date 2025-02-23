import { getSession, signOut } from 'next-auth/react'

import { API_BASE_URL } from '../constants'

export async function fetchUpdateEvent(eventId: string, data: FormData) {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include',
    body: data
  })

  const event = await response.json()

  if (event.error?.message === 'jwt is expired') await signOut()

  return event
}
