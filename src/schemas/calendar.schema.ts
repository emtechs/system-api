import { z } from 'zod'

export const YearCreateSchema = z.object({
  year: z.string(),
})

export const PeriodReturnSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    label: z.string().optional(),
    category: z.enum(['BIMESTRE', 'SEMESTRE', 'ANO']),
    date_initial: z.date(),
    date_final: z.date(),
    year_id: z.string().uuid(),
  })
  .refine((field) => (field.label = field.name))
  .array()
