import { prisma } from '../../lib'
import { IPeriodRequest } from '../../interfaces'

export const createPeriodService = async (
  { category, final, initial, name }: IPeriodRequest,
  year_id: string,
) => {
  let dateData: string[]

  dateData = initial.split('/')
  const date_initial = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

  dateData = final.split('/')
  const date_final = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

  const period = await prisma.period.create({
    data: { category, date_final, date_initial, name, year_id },
  })

  return period
}
