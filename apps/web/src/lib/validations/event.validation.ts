import { z } from 'zod'

const MAX_IMAGE_SIZE = 2048000 //2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const UpdateEventFormSchema = z.object({
  eventId: z.number({ required_error: 'event id is required' }),
  organizerId: z.number({ required_error: 'organizer id is required' }),
  title: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= 5, {
      message: 'Nama event harus mengandung minimal 5 karakter'
    }),
  description: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= 5, {
      message: 'Deskripsi event harus mengandung minimal 5 karakter'
    }),
  banner: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file || ACCEPTED_IMAGE_TYPES.includes(file?.mimetype || file?.type),
      'Format gambar tidak didukung'
    )
    .refine(
      (file) => !file || file?.size <= MAX_IMAGE_SIZE,
      'Ukuran gambar maksimum adalah 2 MB'
    )
    .optional(),
  registrationStartDate: z.date().optional(),
  registrationEndDate: z.date().optional(),
  eventStartDate: z.date().optional(),
  eventEndDate: z.date().optional(),
  eventStartHour: z.string().optional(),
  eventStartMinute: z.string().optional(),
  eventEndHour: z.string().optional(),
  eventEndMinute: z.string().optional(),
  price: z.coerce.number().optional(),
  availableSeats: z.coerce.number().optional(),
  locationId: z.coerce.number().optional(),
  provinceId: z.coerce.number().optional(),
  city: z.string().optional(),
  streetAddress: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  ticketType: z.string().optional()
})

export const BannerSchema = z
  .any()
  .optional()
  .refine(
    (file) =>
      !file || ACCEPTED_IMAGE_TYPES.includes(file?.mimetype || file?.type),
    'Format gambar tidak didukung'
  )
  .refine(
    (file) => !file || file?.size <= MAX_IMAGE_SIZE,
    'Ukuran gambar maksimum adalah 2 MB'
  )
