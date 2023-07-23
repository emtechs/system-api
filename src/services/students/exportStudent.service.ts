import fs from 'node:fs'
import { stringify } from 'csv-stringify'
import { prisma } from '../../lib'
import { env } from '../../env'

export const exportStudentService = async () => {
  const students = await prisma.student.findMany({
    include: {
      classes: { include: { class_year: { include: { school: true } } } },
    },
  })

  const studentsData = students.map((el) => {
    return {
      registry: el.registry,
      name: el.name,
      school: el.classes[0] ? el.classes[0].class_year.school.name : '',
    }
  })

  if (env.NODE_ENV === 'production') {
    const writeStream = fs.createWriteStream('tmp/uploads/estudantes.csv')
    const stringifier = stringify({
      header: true,
      columns: ['registry', 'name', 'school'],
    })
    studentsData.forEach((student) => {
      stringifier.write(Object.values(student))
    })
    stringifier.pipe(writeStream)
  }

  return studentsData
}
