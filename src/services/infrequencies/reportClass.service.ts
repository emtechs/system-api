import { AppError } from '../../errors'
import { IClassReportRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const reportClassService = async (
  { key_class, period_id }: IClassReportRequest,
  isResume?: boolean,
) => {
  let infrequency = 0

  const [classData, period, frequencyData] = await Promise.all([
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
        _count: {
          select: {
            students: true,
            frequencies: {
              where: {
                status: 'CLOSED',
                periods: { some: { period_id } },
                class: { key: key_class },
              },
            },
          },
        },
      },
    }),
    prisma.period.findUnique({
      where: { id: period_id },
      include: { year: true },
    }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        status: 'CLOSED',
        periods: { some: { period_id } },
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
    students: classData._count.students,
    frequencies: classData._count.frequencies,
    infrequency,
    period,
  }

  if (isResume) return { result }

  return {
    result,
    students: await studentArrayReturn(classData.students, period_id),
  }
}

const studentArrayReturn = async (
  students: {
    student_id: string
  }[],
  period_id: string,
) => {
  const studentsData = students.map((el) =>
    returnStudent(el.student_id, period_id),
  )

  return Promise.all(studentsData).then((school) => {
    return school
  })
}

const returnStudent = async (student_id: string, period_id: string) => {
  let infrequency = 0
  const [studentData, freq, presences, justified, absences, frequencies] =
    await Promise.all([
      prisma.student.findUnique({ where: { id: student_id } }),
      prisma.frequencyStudent.aggregate({
        _avg: { value: true },
        where: {
          student_id,
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'PRESENTED',
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'JUSTIFIED',
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'MISSED',
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
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
