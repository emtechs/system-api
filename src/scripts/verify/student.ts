import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const verifyStudent = async (id: string) => {
  const student_id = id

  const [student, years] = await Promise.all([
    prisma.student.findUnique({
      where: { id },
      select: { name: true },
    }),
    prisma.year.findMany({
      where: { classes: { some: { students: { some: { student_id } } } } },
      orderBy: { year: 'desc' },
    }),
  ])

  if (!student) throw new AppError('student not found', 404)

  const select = { id, label: student.name }

  return { select, years }
}
