import { z } from 'zod'

export const YearCreateSchema = z.object({
  year: z.string(),
})

export const PeriodCreateSchema = z.object({
  name: z.string(),
  category: z.enum(['BIMESTRE', 'SEMESTRE', 'ANO']),
  initial: z.string(),
  final: z.string(),
})

export const PeriodUpdateSchema = z.object({
  initial: z.string(),
  final: z.string(),
})

export const PeriodReturnSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    label: z.string().optional(),
    category: z.enum(['BIMESTRE', 'SEMESTRE', 'ANO']),
    date_initial: z.date(),
    date_final: z.date(),
    year: z.object({
      id: z.string().uuid(),
      year: z.string(),
    }),
  })
  .refine((field) => (field.label = field.name))
  .array()
