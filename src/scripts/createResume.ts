import { env } from '../env'
import { prisma } from '../lib'

export const createResume = async () => {
  const year_id = env.YEAR

  const students = await prisma.classStudent.findMany({
    where: { year_id },
    select: { class_id: true, school_id: true, student_id: true },
  })

  await studentArrayResume(students, year_id)
}

const studentArrayResume = async (
  students: {
    class_id: string
    school_id: string
    student_id: string
  }[],
  year_id: string,
) => {
  const studentsData = students.map((el) =>
    studentResume(el.class_id, el.school_id, el.student_id, year_id),
  )

  return Promise.all(studentsData).then((student) => {
    return student
  })
}

const studentResume = async (
  class_id: string,
  school_id: string,
  student_id: string,
  year_id: string,
) => {
  let infrequency = 0
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
