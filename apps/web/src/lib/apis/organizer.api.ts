import { getSession, signOut } from 'next-auth/react'

import { auth } from '@/auth'
import { handleSignOut } from '@/app/actions/actions'
import {
  EventAttendeesJson,
  EventBySlugJson,
  EventsByOrganizerJson,
  EventStatus
} from '../interfaces/organizer.interface'
import { API_BASE_URL } from '../constants'
import { OrderType } from '../interfaces/shared.interface'

export async function fetchGetEventsByOrganizer(
  status: EventStatus = 'aktif',
  page: number,
  order: OrderType = 'desc'
): Promise<EventsByOrganizerJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(
    `${API_BASE_URL}/organizers/events?status=${status}&page=${page.toString()}&order=${order}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    }
  )

  const events = await response.json()

  if (events.error?.message === 'jwt is expired') await signOut()

  return events
}

export async function fetchGetEventBySlug(
  slug: string
): Promise<EventBySlugJson> {
  const session = await auth()
  const token = session?.user.accessToken

  const response = await fetch(`${API_BASE_URL}/organizers/events/${slug}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  })

  const event = await response.json()

  if (event.error?.message === 'jwt is expired') await handleSignOut()

  return event
}

export async function fetchGetEventAttendees(
  slug: string,
  page?: number,
  order: OrderType = 'desc'
): Promise<EventAttendeesJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const url = new URL(`${API_BASE_URL}/organizers/events/${slug}/attendees`)

  if (page) url.searchParams.append('page', page.toString())
  if (order) url.searchParams.append('order', order)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  })

  const attendees = await response.json()

  if (attendees.error?.message === 'jwt is expired') await signOut()

  return attendees
}
