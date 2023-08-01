import { AppError } from '../../errors'
import { ISchoolReportRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { reportClassService } from './reportClass.service'

export const reportSchoolService = async ({
  model,
  period_id,
  school_id,
  year_id,
}: ISchoolReportRequest) => {
  let infrequency = 0

  const period = await prisma.period.findUnique({
    where: { id: period_id },
    include: { year: true },
  })

  if (!period) throw new AppError('')

  const { date_initial, date_final } = period

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
        status: 'CLOSED',
        date_time: { lte: date_final, gte: date_initial },
        school_id,
        year_id,
      },
    }),
    prisma.classStudent.count({ where: { school_id, year_id } }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        status: 'CLOSED',
        date_time: { lte: date_final, gte: date_initial },
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
    period,
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
        classes: await classArrayReturn(classes, period_id),
      }

    case 'resume':
      return {
        result,
        classes: await classArrayReturn(classes, period_id, true),
      }

    default:
      return ''
  }
}

const classArrayReturn = async (
  classes: {
    key: string
  }[],
  period_id: string,
  isResume?: boolean,
) => {
  const classesData = classes.map((el) =>
    reportClassService({ period_id, key_class: el.key }, isResume),
  )

  return Promise.all(classesData).then((school) => {
    return school
  })
}
