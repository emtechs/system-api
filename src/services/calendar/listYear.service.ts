import { z } from 'zod'
import { prisma } from '../../lib'

const yearSchema = z
  .object({
    id: z.string().uuid(),
    year: z.string(),
    label: z.string().optional(),
  })
  .refine((field) => (field.label = field.year))
  .array()

export const listYearService = async () => {
  const years = await prisma.year.findMany()

  return yearSchema.parse(years)
}
