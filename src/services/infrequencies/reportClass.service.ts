import { AppError } from '../../errors'
import { IClassReportRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const reportClassService = async (
  { key_class, period_id }: IClassReportRequest,
  isResume?: boolean,
) => {
  let infrequency = 0

  const period = await prisma.period.findUnique({
    where: { id: period_id },
    include: { year: true },
  })

  if (!period) throw new AppError('')

  const { date_initial, date_final } = period

  const [classData, students, frequencyData, frequencies] = await Promise.all([
    prisma.classYear.findUnique({
      where: { key: key_class },
      include: {
        students: {
          select: {
            student_id: true,
          },
          orderBy: { student: { name: 'asc' } },
        },
        class: { select: { id: true, name: true } },
        school: { select: { id: true, name: true } },
      },
    }),
    prisma.classStudent.count({ where: { class_year: { key: key_class } } }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        status: 'CLOSED',
        date_time: { lte: date_final, gte: date_initial },
        class: { key: key_class },
      },
    }),
    prisma.frequency.count({
      where: {
        status: 'CLOSED',
        date_time: { lte: date_final, gte: date_initial },
        class: { key: key_class },
      },
    }),
  ])

  if (!classData) throw new AppError('')

  if (frequencyData._avg.infrequency)
    infrequency = frequencyData._avg.infrequency

  const { class: class_data, school } = classData

  const result = {
    id: class_data.id,
    name: class_data.name,
    school,
    students,
    frequencies,
    infrequency,
    period,
  }

  if (isResume) return { result }

  return {
    result,
    students: await studentArrayReturn(
      classData.students,
      date_initial,
      date_final,
    ),
  }
}

const studentArrayReturn = async (
  students: {
    student_id: string
  }[],
  date_initial: Date,
  date_final: Date,
) => {
  const studentsData = students.map((el) =>
    returnStudent(el.student_id, date_initial, date_final),
  )

  return Promise.all(studentsData).then((school) => {
    return school
  })
}

const returnStudent = async (
  student_id: string,
  date_initial: Date,
  date_final: Date,
) => {
  let infrequency = 0
  const [studentData, freq, presences, justified, absences, frequencies] =
    await Promise.all([
      prisma.student.findUnique({ where: { id: student_id } }),
      prisma.frequencyStudent.aggregate({
        _avg: { value: true },
        where: {
          student_id,
          frequency: {
            status: 'CLOSED',
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'PRESENTED',
          frequency: {
            status: 'CLOSED',
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'JUSTIFIED',
          frequency: {
            status: 'CLOSED',
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'MISSED',
          frequency: {
            status: 'CLOSED',
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: {
            status: 'CLOSED',
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
    ])

  if (freq._avg.value) infrequency = freq._avg.value

  return {
    ...studentData,
    infrequency,
    presences,
    justified,
    absences,
    frequencies,
  }
}
