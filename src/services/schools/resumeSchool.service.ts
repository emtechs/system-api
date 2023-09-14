import sortArray from 'sort-array'
import { prisma } from '../../lib'
import { IQuery } from '../../interfaces'

export const resumeSchoolService = async (
  school_id: string,
  year_id: string,
  { name }: IQuery,
) => {
  let where = {}

  if (name)
    where = {
      ...where,
      student: {
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { registry: { contains: name, mode: 'insensitive' } },
        ],
      },
    }

  where = { ...where, school_id, year_id }

  const [students, total] = await Promise.all([
    prisma.classStudent.findMany({
      where,
      select: { class_id: true, student_id: true },
      orderBy: { student: { name: 'asc' } },
    }),
    prisma.classStudent.count({
      where,
    }),
  ])

  const result = await studentArrayResume(students, school_id, year_id)

  return {
    total,
    result: sortArray(result, {
      by: 'infrequency',
      order: 'desc',
    }),
  }
}

const studentArrayResume = async (
  students: {
    class_id: string
    student_id: string
  }[],
  school_id: string,
  year_id: string,
) => {
  const studentsData = students.map((el) =>
    studentResume(el.class_id, el.student_id, school_id, year_id),
  )

  return Promise.all(studentsData).then((student) => {
    return student
  })
}

const studentResume = async (
  class_id: string,
  student_id: string,
  school_id: string,
  year_id: string,
) => {
  let infrequency = 0
  const [classData, studentData, frequencies, frequencyData, absences] =
    await Promise.all([
      prisma.class.findUnique({ where: { id: class_id } }),
      prisma.student.findUnique({ where: { id: student_id } }),
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

  return {
    ...studentData,
    class: classData,
    frequencies,
    infrequency,
    absences,
  }
}
