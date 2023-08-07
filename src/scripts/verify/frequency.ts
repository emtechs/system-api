import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const verifyFrequency = async (id: string) => {
  const frequency = await prisma.frequency.findUnique({
    where: { id },
    select: {
      date: true,
      is_open: true,
      class: {
        select: {
          school: { select: { id: true, name: true } },
          class: { select: { name: true } },
        },
      },
    },
  })

  if (!frequency) throw new AppError('frequency not found', 404)

  const { class: classData, school } = frequency.class

  const select = {
    id,
    label: `${classData.name} - ${frequency.date}`,
    is_open: frequency.is_open,
  }

  const select_school = {
    id: school.id,
    label: school.name,
  }

  return { select, school: select_school }
}
