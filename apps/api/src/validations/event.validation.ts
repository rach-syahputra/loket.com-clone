import { z } from 'zod'

const MAX_IMAGE_SIZE = 2048000 //2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const UpdateEventSchema = z.object({
  eventId: z.number({ required_error: 'event id is required' }),
  organizerId: z.number({ required_error: 'organizer id is required' }),
  title: z.string().optional(),
  description: z.string().optional(),
  banner: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      'Image format is not supported'
    )
    .refine((file) => file?.size <= MAX_IMAGE_SIZE, 'Max image size is 2MB')
    .optional(),
  registrationStartDate: z.string().optional(),
  registrationEndDate: z.string().optional(),
  eventStartDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  price: z.number().optional(),
  availableSeats: z.number().optional(),
  locationId: z.number().optional(),
  streetAddress: z.string().optional(),
  categoryId: z.number().optional(),
  ticketType: z.enum(['FREE', 'PAID']).optional()
})
