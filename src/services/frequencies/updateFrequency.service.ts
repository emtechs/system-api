import { IFrequencyUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { createFrequencyHistory } from '../../scripts'

export const updateFrequencyService = async (
  { status, finished_at }: IFrequencyUpdateRequest,
  id: string,
) => {
  let infrequency = 0

  const agg = await prisma.frequencyStudent.aggregate({
    _avg: { value: true },
    where: { frequency_id: id },
  })

  if (agg._avg.value) infrequency = agg._avg.value

  const [frequency, frequencyData] = await Promise.all([
    prisma.frequency.update({
      where: { id },
      data: { status, finished_at, infrequency },
      select: {
        year_id: true,
        class_id: true,
        school_id: true,
        students: { select: { student_id: true } },
        periods: { select: { period_id: true } },
      },
    }),
    prisma.frequency.findUnique({
      where: { id },
      select: {
        user_id: true,
        finished_at: true,
        students: { select: { id: true, status: true, justification: true } },
      },
    }),
  ])

  if (frequencyData && finished_at)
    await createFrequencyHistory(
      frequencyData.students,
      frequencyData.user_id,
      finished_at,
    )

  return frequency
}
