import fs from 'node:fs'
import { stringify } from 'csv-stringify'
import { prisma } from '../../lib'
import { env } from '../../env'

export const exportSchoolService = async () => {
  const schools = await prisma.school.findMany({
    select: { name: true, id: true, director_id: true },
  })

  if (env.NODE_ENV === 'dev') {
    const writeStream = fs.createWriteStream('tmp/uploads/escolas.csv')
    const stringifier = stringify({
      header: true,
      columns: ['name', 'id', 'director_id'],
    })
    schools.forEach((school) => {
      stringifier.write(Object.values(school))
    })
    stringifier.pipe(writeStream)
  }

  return schools
}
