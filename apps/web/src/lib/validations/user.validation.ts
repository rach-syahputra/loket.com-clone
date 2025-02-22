import { z } from 'zod'

const MAX_IMAGE_SIZE = 1024000 //1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const UpdateUserFormSchema = z
  .object({
    name: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 3, {
        message: 'Nama harus mengandung minimal 3 karakter'
      }),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine((name) => !name || name.length > 3, {
        message: 'Password baru harus mengandung minimal 6 karakter'
      }),
    confirmNewPassword: z
      .string()
      .optional()
      .refine((name) => !name || name.length > 3, {
        message: 'Password baru harus mengandung minimal 6 karakter'
      }),
    image: z
      .any()
      .optional()
      .refine(
        (file) =>
          !file || ACCEPTED_IMAGE_TYPES.includes(file?.mimetype || file?.type),
        'Format gambar tidak didukung'
      )
      .refine(
        (file) => !file || file?.size <= MAX_IMAGE_SIZE,
        'Ukuran gambar maksimum adalah 1 MB'
      )
  })
  .refine(
    (data) => {
      // If oldPassword exists, newPassword must be required
      if (data.oldPassword && !data.newPassword) {
        return false
      }
      return true
    },
    {
      message: 'Password baru wajib diisi',
      path: ['newPassword']
    }
  )
  .refine(
    (data) => {
      // If newPassword exists, confirmNewPassword must match
      if (
        data.newPassword &&
        data.newPassword.length >= 6 &&
        data.newPassword !== data.confirmNewPassword
      ) {
        return false
      }
      return true
    },
    {
      message: 'Password baru tidak cocok',
      path: ['confirmNewPassword']
    }
  )

export const ProfileImageSchema = z
  .any()
  .optional()
  .refine(
    (file) =>
      !file || ACCEPTED_IMAGE_TYPES.includes(file?.mimetype || file?.type),
    'Format gambar tidak didukung'
  )
  .refine(
    (file) => !file || file?.size <= MAX_IMAGE_SIZE,
    'Ukuran gambar maksimum adalah 1 MB'
  )
