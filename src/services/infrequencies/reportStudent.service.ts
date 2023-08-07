import { AppError } from '../../errors'
import { IStudentReportRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { statusFrequencyPtBr } from '../../scripts'

export const reportStudentService = async ({
  key_class,
  student_id,
  final,
  initial,
  period_id,
}: IStudentReportRequest) => {
  let infrequency = 0
  let date_initial_data = new Date()
  let date_final_data = new Date()
  let period_data = {}

  if (initial && final) {
    let dateData: string[]

    dateData = initial.split('/')
    date_initial_data = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

    dateData = final.split('/')
    date_final_data = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
    period_data = {
      year: {
        year: dateData[2],
      },
      name: dateData[2],
      category: 'PERSONALIZADO',
      date_initial: date_initial_data,
      date_final: date_final_data,
    }
  }

  if (period_id) {
    const period = await prisma.period.findUnique({
      where: { id: period_id },
      include: { year: true },
    })

    if (!period) throw new AppError('')

    const { date_initial, date_final } = period

    date_initial_data = date_initial
    date_final_data = date_final
    period_data = period
  }

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
            is_open: false,
            date_time: { lte: date_final_data, gte: date_initial_data },
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
          is_open: false,
          date_time: { lte: date_final_data, gte: date_initial_data },
          class: { key: key_class },
        },
      },
    }),
    prisma.frequencyStudent.aggregate({
      _avg: { value: true },
      where: {
        student_id,
        frequency: {
          is_open: false,
          date_time: { lte: date_final_data, gte: date_initial_data },
          class: { key: key_class },
        },
      },
    }),
    prisma.frequencyStudent.count({
      where: {
        student_id,
        status: 'PRESENTED',
        frequency: {
          is_open: false,
          date_time: { lte: date_final_data, gte: date_initial_data },
          class: { key: key_class },
        },
      },
    }),
    prisma.frequencyStudent.count({
      where: {
        student_id,
        status: 'JUSTIFIED',
        frequency: {
          is_open: false,
          date_time: { lte: date_final_data, gte: date_initial_data },
          class: { key: key_class },
        },
      },
    }),
    prisma.frequencyStudent.count({
      where: {
        student_id,
        status: 'MISSED',
        frequency: {
          is_open: false,
          date_time: { lte: date_final_data, gte: date_initial_data },
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
      period: period_data,
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
