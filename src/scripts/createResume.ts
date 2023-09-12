import { env } from '../env'
import { prisma } from '../lib'

export const createResume = async () => {
  const year_id = env.YEAR

  const students = await prisma.classStudent.findMany({
    where: { year_id },
    select: { class_id: true, school_id: true, student_id: true },
  })

  for (const student of students) {
    let infrequency = 0
    const { class_id, school_id, student_id } = student

    const [frequencies, frequencyData, absences] = await Promise.all([
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: {
            is_open: false,
            class_id,
            school_id,
            year_id,
          },
        },
      }),
      prisma.frequencyStudent.aggregate({
        _avg: { value: true },
        where: {
          student_id,
          frequency: {
            is_open: false,
            class_id,
            school_id,
            year_id,
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'MISSED',
          frequency: {
            is_open: false,
            class_id,
            school_id,
            year_id,
          },
        },
      }),
    ])

    if (frequencyData._avg.value) infrequency = frequencyData._avg.value

    await prisma.abstract.upsert({
      create: {
        absences,
        class_id,
        school_id,
        student_id,
        year_id,
        frequencies,
        infrequency,
      },
      update: { absences, frequencies, infrequency },
      where: {
        class_id_school_id_year_id_student_id: {
          class_id,
          school_id,
          student_id,
          year_id,
        },
      },
    })
  }
}
