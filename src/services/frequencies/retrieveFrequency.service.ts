import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const retrieveFrequencyService = async (id: string) => {
  const frequency = await prisma.frequency.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      date_time: true,
      is_open: true,
      created_at: true,
      finished_at: true,
      infrequency: true,
      _count: { select: { students: true } },
      class: {
        select: {
          class: { select: { id: true, name: true } },
          school: { select: { id: true, name: true } },
        },
      },
      user: { select: { id: true, name: true } },
    },
  })

  if (!frequency) throw new AppError('')

  const { class: classData, _count } = frequency

  return {
    ...frequency,
    total_students: _count.students,
    school: classData.school,
    class: classData.class,
  }
}
