import fs from 'node:fs'
import { stringify } from 'csv-stringify'
import { prisma } from '../../lib'
import { env } from '../../env'

export const exportClassService = async () => {
  const classes = await prisma.class.findMany({
    select: { name: true, id: true },
  })

  if (env.NODE_ENV === 'dev') {
    const writeStream = fs.createWriteStream('tmp/uploads/turmas.csv')
    const stringifier = stringify({
      header: true,
      columns: ['name', 'id'],
    })
    classes.forEach((class_data) => {
      stringifier.write(Object.values(class_data))
    })
    stringifier.pipe(writeStream)
  }

  return classes
}
