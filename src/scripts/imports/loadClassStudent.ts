import fs from 'node:fs'
import { parse as csvParse } from 'csv-parse'
import { IClassStudent } from '../../interfaces'
import { env } from '../../env'

export const loadClassStudent = (
  file: Express.Multer.File,
): Promise<IClassStudent[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const classes: IClassStudent[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [class_id, school_id, year_id, student_id] = line
        classes.push({
          class_id,
          school_id,
          year_id,
          student_id,
        })
      })
      .on('end', () => {
        if (env.NODE_ENV === 'dev') fs.promises.unlink(file.path)

        delete classes[0]
        resolve(classes)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
