import sortArray from 'sort-array'
import { prisma } from '../../lib'
import { IQuery } from '../../interfaces'
import { AppError } from '../../errors'

export const resumeStudentService = async (
  year_id: string,
  { take, skip, name, school_id, class_id }: IQuery,
) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}
  let where_frequency = {}

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

  if (school_id) where_frequency = { ...where_frequency, school_id }

  if (class_id) where_frequency = { ...where_frequency, class_id }

  where = {
    ...where,
    frequency: { ...where_frequency, year_id },
    value: { gt: 0 },
  }

  const [students, total] = await Promise.all([
    prisma.frequencyStudent.groupBy({
      take,
      skip,
      by: 'student_id',
      where,
      _count: true,
      orderBy: { _count: { value: 'desc' } },
    }),
    prisma.frequencyStudent.groupBy({
      by: 'student_id',
      where,
      _count: true,
      orderBy: { _count: { value: 'desc' } },
    }),
  ])

  const result = await studentArrayResume(students, year_id)

  return {
    total: total.length,
    result: sortArray(result, {
      by: 'infrequency',
      order: 'desc',
    }),
  }
}

const studentArrayResume = async (
  students: {
    student_id: string
  }[],
  year_id: string,
) => {
  const studentsData = students.map((el) =>
    studentResume(el.student_id, year_id),
  )

  return Promise.all(studentsData).then((student) => {
    return student
  })
}

const studentResume = async (student_id: string, year_id: string) => {
  let infrequency = 0
  const [classStudent, studentData] = await Promise.all([
    prisma.classStudent.findFirst({
      where: { year_id, student_id },
      select: {
        class_id: true,
        school_id: true,
        class_year: {
          select: {
            school: { select: { id: true, name: true } },
            class: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.student.findUnique({ where: { id: student_id } }),
  ])

  if (!classStudent) throw new AppError('')

  const { class_id, school_id } = classStudent

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

  return {
    ...studentData,
    school: classStudent.class_year.school,
    class: classStudent.class_year.class,
    frequencies,
    infrequency,
    absences,
  }
}
