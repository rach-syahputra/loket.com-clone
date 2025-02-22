import { z } from 'zod'

export const GetEventBySlugSchema = z.object({
  organizerId: z.number({ required_error: 'Organizer ID is required' }),
  slug: z.string({ required_error: 'Slug is required' })
})
