import { prisma } from '../../lib'

const classDateReturn = async (
  classDate: {
    key: string
    class: {
      id: string
      name: string
    }
  },
  date: string,
) => {
  const { key, class: classData } = classDate

  let infrequency = 0
  let frequencies = 0

  const frequency = await prisma.frequency.findFirst({
    where: { is_open: false, date, class: { key } },
    select: { infrequency: true },
  })

  if (frequency) {
    infrequency = frequency.infrequency
    frequencies = 1
  }

  return { ...classData, infrequency, frequencies }
}

export const classArrayDateReturn = async (
  classes: {
    key: string
    class: {
      id: string
      name: string
    }
  }[],
  date: string,
) => {
  const classesData = classes.map((el) => classDateReturn(el, date))

  return Promise.all(classesData).then((data) => {
    return data
  })
}
