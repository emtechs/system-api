import { IFrequencyQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { infrequencyArrayReturn } from '../../scripts'

export const listInfrequencyService = async ({
  school_id,
  year_id,
  class_id,
  student_id,
  category,
}: IFrequencyQuery) => {
  const infrequency = await prisma.period.findMany({
    where: { category, year_id },
    select: { id: true, name: true, date_initial: true, date_final: true },
  })

  const infreq = await infrequencyArrayReturn(
    infrequency,
    year_id,
    school_id,
    class_id,
    student_id,
  )

  const result = []

  infreq.forEach((el) => {
    if (el) result.push(el)
  })

  return { result, total: result.length }
}
