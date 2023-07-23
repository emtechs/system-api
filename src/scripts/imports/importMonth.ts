import { IMonth } from '../../interfaces'
import { prisma } from '../../lib'

const verifyMonth = async ({ month, name }: IMonth) => {
  const MonthData = await prisma.month.findUnique({ where: { month } })
  let elem = MonthData
  if (!MonthData) elem = await prisma.month.create({ data: { month, name } })

  return elem
}

export const importMonth = async (months: IMonth[]) => {
  const monthsVerifyParse = months.map((el) => {
    return verifyMonth(el)
  })
  return Promise.all(monthsVerifyParse).then((elem) => {
    return elem
  })
}
