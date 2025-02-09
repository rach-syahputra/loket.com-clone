import { getSession } from 'next-auth/react'

import { auth } from '@/auth'
import { handleSignOut } from '@/app/actions/actions'
import {
  EventBySlugJson,
  EventsByOrganizerJson,
  EventStatus,
  OrderType
} from '../interfaces/organizer.interface'
import { BASE_URL } from '../constants'

export async function fetchGetEventsByOrganizer(
  status: EventStatus = 'aktif',
  page: number,
  order: OrderType = 'desc'
): Promise<EventsByOrganizerJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(
    `${BASE_URL}/organizers/events?status=${status}&page=${page.toString()}&order=${order}`,
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

export async function fetchGetEventBySlug(
  slug: string
): Promise<EventBySlugJson> {
  const session = await auth()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/organizers/events/${slug}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const event = await response.json()

  if (event.error?.message === 'jwt is expired') await handleSignOut()

  return event
}
