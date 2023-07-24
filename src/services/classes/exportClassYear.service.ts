import fs from 'node:fs'
import { stringify } from 'csv-stringify'
import { prisma } from '../../lib'
import { env } from '../../env'

export const exportClassYearService = async () => {
  const classes = await prisma.classYear.findMany({
    select: { class_id: true, school_id: true, year_id: true, key: true },
  })

  if (env.NODE_ENV === 'dev') {
    const writeStream = fs.createWriteStream('tmp/uploads/turmas.csv')
    const stringifier = stringify({
      header: true,
      columns: ['class_id', 'school_id', 'year_id', 'key'],
    })
    classes.forEach((class_data) => {
      stringifier.write(Object.values(class_data))
    })
    stringifier.pipe(writeStream)
  }

  return classes
}
