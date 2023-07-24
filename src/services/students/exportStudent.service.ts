import fs from 'node:fs'
import { stringify } from 'csv-stringify'
import { prisma } from '../../lib'
import { env } from '../../env'

export const exportStudentService = async () => {
  const students = await prisma.student.findMany({
    select: { id: true, registry: true, name: true },
  })

  if (env.NODE_ENV === 'dev') {
    const writeStream = fs.createWriteStream('tmp/uploads/estudantes.csv')
    const stringifier = stringify({
      header: true,
      columns: ['id', 'registry', 'name'],
    })
    students.forEach((student) => {
      stringifier.write(Object.values(student))
    })
    stringifier.pipe(writeStream)
  }

  return students
}
