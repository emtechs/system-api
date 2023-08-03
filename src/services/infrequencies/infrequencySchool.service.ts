import { AppError } from '../../errors'
import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { classArrayDateReturn, classArrayPeriodReturn } from '../../scripts'

export const infrequencySchoolService = async (
  school_id: string,
  year_id: string,
  { category, date, name }: ICalendarQuery,
) => {
  const classes = await prisma.classYear.findMany({
    where: { school_id, year_id },
    select: {
      key: true,
      class: { select: { id: true, name: true } },
    },
    orderBy: { class: { name: 'asc' } },
  })

  let result = classes.map((el) => {
    return {
      id: el.class.id,
      name: el.class.name,
      infrequency: 0,
      frequencies: 0,
    }
  })

  if (date) result = await classArrayDateReturn(classes, date)

  if (category) {
    const period = await prisma.period.findFirst({
      where: { year_id, category, name },
    })

    if (!period) throw new AppError('')

    const { date_initial, date_final } = period

    result = await classArrayPeriodReturn(classes, date_initial, date_final)
  }

  return result
}
