import { z } from 'zod'
import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'

const periodSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    label: z.string().optional(),
  })
  .refine((field) => (field.label = field.name))
  .array()

export const listPeriodService = async ({ key_class, student_id }: IQuery) => {
  let where = {}

  if (key_class)
    where = {
      infrequencies_class: { some: { class_year: { key: key_class } } },
    }

  if (student_id) where = { infrequencies_student: { some: { student_id } } }

  const periods = await prisma.period.findMany({
    where,
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return periodSchema.parse(periods)
}
