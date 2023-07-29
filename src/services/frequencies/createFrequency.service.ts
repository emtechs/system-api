import { prisma } from '../../lib'
import { IFrequencyRequest } from '../../interfaces'
import { FrequencyReturnSchema } from '../../schemas'

export const createFrequencyService = async (
  { date, name, class_id, school_id, year_id, students }: IFrequencyRequest,
  user_id: string,
) => {
  // const frequencyData = await prisma.frequency.findFirst({
  //   where: { date, class_id, school_id, year_id },
  // })

  // if (frequencyData) return FrequencyReturnSchema.parse(frequencyData)

  const dateData = date.split('/')
  const date_time = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

  const whereData = {
    date_initial: { lte: date_time },
    date_final: { gte: date_time },
    year_id,
  }

  const periodData = await prisma.period.findMany({
    where: { ...whereData },
    select: { id: true },
  })

  return periodData

  // const [{ id: period_id_ano }, { id: period_id_bim }, { id: period_id_sem }] =
  //   await Promise.all([
  //     prisma.period.findFirst({
  //       where: { category: 'ANO', ...whereData },
  //       select: { id: true },
  //     }),
  //     prisma.period.findFirst({
  //       where: { category: 'BIMESTRE', ...whereData },
  //       select: { id: true },
  //     }),
  //     prisma.period.findFirst({
  //       where: { category: 'SEMESTRE', ...whereData },
  //       select: { id: true },
  //     }),
  //   ])

  // const frequency = await prisma.frequency.create({
  //   data: {
  //     date,
  //     date_time,
  //     month: { connect: { name } },
  //     user: { connect: { id: user_id } },
  //     class: {
  //       connectOrCreate: {
  //         where: {
  //           class_id_school_id_year_id: {
  //             class_id,
  //             school_id,
  //             year_id,
  //           },
  //         },
  //         create: { class_id, school_id, year_id },
  //       },
  //     },
  //     students: { createMany: { data: students } },
  //     periods: {
  //       createMany: {
  //         data: [
  //           { period_id: period_id_ano },
  //           { period_id: period_id_bim },
  //           { period_id: period_id_sem },
  //         ],
  //       },
  //     },
  //   },
  // })

  // return FrequencyReturnSchema.parse(frequency)
}
