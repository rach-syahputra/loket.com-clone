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
  registrationStartDate: z.date().optional(),
  registrationEndDate: z.date().optional(),
  eventStartDate: z.date().optional(),
  eventEndDate: z.date().optional(),
  eventStartTime: z.string().optional(),
  eventEndTime: z.string().optional(),
  price: z.number().optional(),
  availableSeats: z.number().optional(),
  locationId: z.number().optional(),
  provinceId: z.number().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  categoryId: z.number().optional(),
  ticketType: z.enum(['FREE', 'PAID']).optional()
})
