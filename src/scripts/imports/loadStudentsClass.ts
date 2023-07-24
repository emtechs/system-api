import fs from 'node:fs'
import { parse as csvParse } from 'csv-parse'
import { IStudentKey } from '../../interfaces'
import { env } from '../../env'

export const loadStudentsClass = (
  file: Express.Multer.File,
): Promise<IStudentKey[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const students: IStudentKey[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [registry, name, key] = line
        students.push({
          registry,
          name,
          key,
        })
      })
      .on('end', () => {
        if (env.NODE_ENV === 'dev') fs.promises.unlink(file.path)

        delete students[0]
        resolve(students)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
