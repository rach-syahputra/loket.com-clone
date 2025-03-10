import { ZodSchema } from 'zod'

export const validate = <T>(schema: ZodSchema<T>, data: unknown): T => {
  return schema.parse(data)
}
