import { getSession } from 'next-auth/react'

import { handleSignOut } from '@/app/actions/actions'
import { EventsByOrganizerJson } from '../interfaces/organizer.interface'
import { BASE_URL } from '../constants'

export async function fetchGetEventsByOrganizer(
  status: 'aktif' | 'lalu' = 'aktif'
): Promise<EventsByOrganizerJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(
    `${BASE_URL}/organizers/events?status=${status}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const events = await response.json()

  if (events.error?.message === 'jwt is expired') await handleSignOut()

  return events
}
