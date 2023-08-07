import { IFrequencyUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const updateFrequencyService = async (
  { is_open, finished_at }: IFrequencyUpdateRequest,
  id: string,
) => {
  let infrequency = 0

  const agg = await prisma.frequencyStudent.aggregate({
    _avg: { value: true },
    where: { frequency_id: id },
  })

  if (agg._avg.value) infrequency = agg._avg.value

  const frequency = await prisma.frequency.update({
    where: { id },
    data: { is_open, finished_at, infrequency },
    select: {
      year_id: true,
      class_id: true,
      school_id: true,
      students: { select: { student_id: true } },
    },
  })

  return frequency
}
