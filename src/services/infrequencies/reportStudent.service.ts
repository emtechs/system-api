import { AppError } from '../../errors'
import { IStudentReportRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { statusFrequencyPtBr } from '../../scripts'

export const reportStudentService = async ({
  key_class,
  period_id,
  student_id,
}: IStudentReportRequest) => {
  let infrequency = 0

  const period = await prisma.period.findUnique({
    where: { id: period_id },
    include: { year: true },
  })

  if (!period) throw new AppError('')

  const { date_initial, date_final } = period

  const [
    studentData,
    classData,
    frequencies,
    frequencyData,
    presences,
    justified,
    absences,
  ] = await Promise.all([
    prisma.student.findUnique({ where: { id: student_id } }),
    prisma.classYear.findUnique({
      where: { key: key_class },
      include: {
        class: { select: { id: true, name: true } },
        school: { select: { id: true, name: true } },
        frequencies: {
          where: {
            status: 'CLOSED',
            date_time: { lte: date_final, gte: date_initial },
          },
          select: { id: true },
          orderBy: { date_time: 'asc' },
        },
      },
    }),
    prisma.frequencyStudent.count({
      where: {
        student_id,
        frequency: {
          status: 'CLOSED',
          date_time: { lte: date_final, gte: date_initial },
          class: { key: key_class },
        },
      },
    }),
    prisma.frequencyStudent.aggregate({
      _avg: { value: true },
      where: {
        student_id,
        frequency: {
          status: 'CLOSED',
          date_time: { lte: date_final, gte: date_initial },
          class: { key: key_class },
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
          class: { key: key_class },
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
          class: { key: key_class },
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
          class: { key: key_class },
        },
      },
    }),
  ])

  if (!studentData) throw new AppError('')

  if (!classData) throw new AppError('')

  if (frequencyData._avg.value) infrequency = frequencyData._avg.value

  const { id, name, registry } = studentData

  const { class: class_data, school } = classData

  return {
    result: {
      id,
      name,
      registry,
      class: class_data,
      school,
      frequencies,
      infrequency,
      period,
      presences,
      justified,
      absences,
    },
    frequencies: await frequencyArrayReturn(classData.frequencies, student_id),
  }
}

const frequencyArrayReturn = async (
  frequencies: {
    id: string
  }[],
  student_id: string,
) => {
  const frequenciesData = frequencies.map((el) =>
    returnFrequency(el.id, student_id),
  )

  return Promise.all(frequenciesData).then((school) => {
    return school
  })
}

const returnFrequency = async (id: string, student_id: string) => {
  const [frequencyData, frequencyStuData] = await Promise.all([
    prisma.frequency.findUnique({
      where: { id },
      select: {
        id: true,
        date: true,
        user: { select: { id: true, name: true } },
      },
    }),
    prisma.frequencyStudent.findFirst({
      where: { frequency_id: id, student_id },
      select: { status: true, justification: true },
    }),
  ])

  if (!frequencyStuData) throw new AppError('')

  const { justification, status } = frequencyStuData

  return {
    ...frequencyData,
    status: statusFrequencyPtBr(status),
    justification,
  }
}
