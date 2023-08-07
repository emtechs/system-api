import { AppError } from '../../errors'
import { ISchoolReportRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { reportClassService } from './reportClass.service'

export const reportSchoolService = async ({
  model,
  school_id,
  year_id,
  final,
  initial,
  period_id,
}: ISchoolReportRequest) => {
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

  const [schoolData, frequencies, students, frequencyData] = await Promise.all([
    prisma.school.findUnique({
      where: { id: school_id },
      select: {
        id: true,
        name: true,
        director: { select: { id: true, name: true } },
        classes: {
          where: { year_id },
          select: { key: true },
          orderBy: { class: { name: 'asc' } },
        },
        _count: { select: { classes: { where: { year_id } } } },
      },
    }),
    prisma.frequency.count({
      where: {
        is_open: false,
        date_time: { lte: date_final_data, gte: date_initial_data },
        school_id,
        year_id,
      },
    }),
    prisma.classStudent.count({ where: { school_id, year_id } }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        is_open: false,
        date_time: { lte: date_final_data, gte: date_initial_data },
        school_id,
        year_id,
      },
    }),
  ])

  if (frequencyData._avg.infrequency)
    infrequency = frequencyData._avg.infrequency

  if (!schoolData) throw new AppError('')

  const { _count, classes } = schoolData

  const result = {
    ...schoolData,
    period: period_data,
    frequencies,
    students,
    infrequency,
    classes: _count.classes,
    type: model === 'details' ? 'detalhado' : 'resumido',
  }

  switch (model) {
    case 'details':
      return {
        result,
        classes: await classArrayReturn(classes, period_id, initial, final),
      }

    case 'resume':
      return {
        result,
        classes: await classArrayReturn(
          classes,
          period_id,
          initial,
          final,
          true,
        ),
      }

    default:
      return ''
  }
}

const classArrayReturn = async (
  classes: {
    key: string
  }[],
  period_id?: string,
  initial?: string,
  final?: string,
  isResume?: boolean,
) => {
  const classesData = classes.map((el) =>
    reportClassService(
      { period_id, initial, final, key_class: el.key },
      isResume,
    ),
  )

  return Promise.all(classesData).then((school) => {
    return school
  })
}
