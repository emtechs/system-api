import fs from 'node:fs'
import { stringify } from 'csv-stringify'
import { prisma } from '../../lib'
import { env } from '../../env'

export const exportYearService = async () => {
  const years = await prisma.year.findMany({
    select: { year: true, id: true },
  })

  if (env.NODE_ENV === 'dev') {
    const writeStream = fs.createWriteStream('tmp/uploads/anos.csv')
    const stringifier = stringify({
      header: true,
      columns: ['year', 'id'],
    })
    years.forEach((year) => {
      stringifier.write(Object.values(year))
    })
    stringifier.pipe(writeStream)
  }

  return years
}
