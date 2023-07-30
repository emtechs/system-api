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

  const [schoolData, period, frequencies, students, frequencyData, classes] =
    await Promise.all([
      prisma.school.findUnique({
        where: { id: school_id },
        select: {
          id: true,
          name: true,
          director: { select: { id: true, name: true } },
          _count: { select: { classes: { where: { year_id } } } },
        },
      }),
      prisma.period.findUnique({
        where: { id: period_id },
        select: { category: true, id: true, name: true, year: true },
      }),
      prisma.frequency.count({
        where: { status: 'CLOSED', school_id, year_id },
      }),
      prisma.classStudent.count({ where: { school_id, year_id } }),
      prisma.frequency.aggregate({
        _avg: { infrequency: true },
        where: { status: 'CLOSED', school_id, year_id },
      }),
      prisma.classYear.findMany({
        where: { school_id, year_id },
        select: { key: true },
        orderBy: { class: { name: 'asc' } },
      }),
    ])

  if (frequencyData._avg.infrequency)
    infrequency = frequencyData._avg.infrequency

  if (!schoolData || !period) throw new AppError('')

  const { year } = period

  const result = {
    ...schoolData,
    year,
    period,
    frequencies,
    students,
    infrequency,
    classes: schoolData._count.classes,
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
