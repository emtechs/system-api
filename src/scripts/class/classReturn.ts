import { prisma } from '../../lib'

export const classReturn = async (classData: {
  id: string
  name: string
  created_at: Date
}) => {
  const class_id = classData.id

  const [schools, students, frequencies] = await Promise.all([
    prisma.school.count({ where: { classes: { some: { class_id } } } }),
    prisma.student.count({ where: { classes: { some: { class_id } } } }),
    prisma.frequency.count({ where: { class_id, is_open: false } }),
  ])

  return { ...classData, schools, students, frequencies }
}

export const classArrayReturn = async (
  classData: {
    id: string
    name: string
    created_at: Date
  }[],
) => {
  const classes = classData.map((el) => classReturn(el))

  return Promise.all(classes).then((school) => {
    return school
  })
}
