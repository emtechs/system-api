import { z } from 'zod'

export const YearCreateSchema = z.object({
  year: z.string(),
})
