import { IFrequencyUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'
import {
  createFrequencyHistory,
  updateClassSchoolInfreq,
  updateSchoolInfreq,
  updateStudentInfreq,
} from '../../scripts'

export const updateFrequencyService = async (
  { status, finished_at }: IFrequencyUpdateRequest,
  id: string,
) => {
  const agg = await prisma.frequencyStudent.aggregate({
    _avg: { value: true },
    where: { frequency_id: id },
  })

  const [frequency, frequencyData] = await Promise.all([
    prisma.frequency.update({
      where: { id },
      data: { status, finished_at, infrequency: agg._avg.value },
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

  const { class_id, periods, school_id, students, year_id } = frequency

  await Promise.all([
    updateSchoolInfreq(school_id, periods),
    updateClassSchoolInfreq(year_id, class_id, school_id, periods),
    updateStudentInfreq(students, periods),
    createFrequencyHistory(
      frequencyData.students,
      frequencyData.user_id,
      finished_at,
    ),
  ])

  return frequency
}
