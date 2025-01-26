import { z } from 'zod'

import { LoginFormSchema } from '../validations/auth.validation'

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
