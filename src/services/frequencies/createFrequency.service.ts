import { prisma } from '../../lib'
import { IFrequencyRequest } from '../../interfaces'
import { FrequencyReturnSchema } from '../../schemas'

export const createFrequencyService = async (
  { date, name, class_id, school_id, year_id, students }: IFrequencyRequest,
  user_id: string,
) => {
  const frequencyData = await prisma.frequency.findFirst({
    where: { date, class_id, school_id, year_id },
  })

  if (frequencyData) return FrequencyReturnSchema.parse(frequencyData)

  const dateData = date.split('/')
  const date_time = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

  const whereData = {
    date_initial: { lte: date_time },
    date_final: { gte: date_time },
    year_id,
  }

  let period_id_ano = ''
  let period_id_bim = ''
  let period_id_sem = ''

  const periodData = await prisma.period.findMany({
    where: { ...whereData },
    select: { id: true, category: true },
  })

  periodData.forEach((el) => {
    const { category, id } = el
    switch (category) {
      case 'ANO':
        period_id_ano = id
        break

      case 'BIMESTRE':
        period_id_bim = id
        break

      case 'SEMESTRE':
        period_id_sem = id
        break
    }
  })

  const frequency = await prisma.frequency.create({
    data: {
      date,
      date_time,
      month: { connect: { name } },
      user: { connect: { id: user_id } },
      class: {
        connectOrCreate: {
          where: {
            class_id_school_id_year_id: {
              class_id,
              school_id,
              year_id,
            },
          },
          create: { class_id, school_id, year_id },
        },
      },
      students: { createMany: { data: students } },
      periods: {
        createMany: {
          data: [
            { period_id: period_id_ano },
            { period_id: period_id_bim },
            { period_id: period_id_sem },
          ],
        },
      },
    },
  })

  return FrequencyReturnSchema.parse(frequency)
}
