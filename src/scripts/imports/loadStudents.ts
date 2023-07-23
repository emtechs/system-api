import fs from 'node:fs'
import { parse as csvParse } from 'csv-parse'
import { IStudent } from '../../interfaces'
import { env } from '../../env'

export const loadStudents = (
  file: Express.Multer.File,
  class_id: string,
  school_id: string,
  year_id: string,
): Promise<IStudent[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const students: IStudent[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [registry, name] = line
        students.push({
          registry,
          name,
          class_id,
          school_id,
          year_id,
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

export const loadStudentsAll = (
  file: Express.Multer.File,
): Promise<IStudent[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const students: IStudent[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [registry, name, school_id, class_id, year_id] = line
        students.push({
          registry,
          name,
          school_id,
          class_id,
          year_id,
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
