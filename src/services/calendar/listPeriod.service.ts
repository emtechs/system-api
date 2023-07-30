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

export const listPeriodService = async ({ key_class, school_id }: IQuery) => {
  let where = {}

  if (key_class)
    where = {
      frequencies: {
        some: { frequency: { status: 'CLOSED', class: { key: key_class } } },
      },
    }

  if (school_id)
    where = {
      frequencies: {
        some: { frequency: { status: 'CLOSED', school_id } },
      },
    }

  const periods = await prisma.period.findMany({
    where,
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return periodSchema.parse(periods)
}
