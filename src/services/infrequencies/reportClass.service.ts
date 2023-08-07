import { AppError } from '../../errors'
import { IClassReportRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const reportClassService = async (
  { key_class, final, initial, period_id }: IClassReportRequest,
  isResume?: boolean,
) => {
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
        is_open: false,
        date_time: { lte: date_final_data, gte: date_initial_data },
        class: { key: key_class },
      },
    }),
    prisma.frequency.count({
      where: {
        is_open: false,
        date_time: { lte: date_final_data, gte: date_initial_data },
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
    period: period_data,
  }

  if (isResume) return { result }

  return {
    result,
    students: await studentArrayReturn(
      classData.students,
      date_initial_data,
      date_final_data,
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
            is_open: false,
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'PRESENTED',
          frequency: {
            is_open: false,
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'JUSTIFIED',
          frequency: {
            is_open: false,
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          status: 'MISSED',
          frequency: {
            is_open: false,
            date_time: { lte: date_final, gte: date_initial },
          },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: {
            is_open: false,
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
