import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const verifyClassYear = async (key: string) => {
  const classYear = await prisma.classYear.findUnique({
    where: { key },
    select: {
      class: { select: { id: true, name: true } },
      school: { select: { id: true, name: true } },
      year: { select: { id: true, year: true } },
    },
  })

  if (!classYear) throw new AppError('class not found', 404)

  const { class: classData, school, year } = classYear

  const select = {
    id: classData.id,
    label: classData.name,
  }

  const select_school = {
    id: school.id,
    label: school.name,
  }

  const select_year = {
    id: year.id,
    label: year.year,
  }

  return { select, school: select_school, year: select_year }
}
