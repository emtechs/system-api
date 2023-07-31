import { prisma } from '../../lib'
import { IPeriodUpdateRequest } from '../../interfaces'

export const updatePeriodService = async (
  { final, initial }: IPeriodUpdateRequest,
  id: string,
) => {
  let dateData: string[]

  dateData = initial.split('/')
  const date_initial = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

  dateData = final.split('/')
  const date_final = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

  const period = await prisma.period.update({
    where: { id },
    data: { date_initial, date_final },
  })

  return period
}
