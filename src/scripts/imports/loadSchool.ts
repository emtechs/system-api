import fs from 'node:fs'
import { parse as csvParse } from 'csv-parse'
import { ISchool } from '../../interfaces'
import { env } from '../../env'

export const loadSchool = (file: Express.Multer.File): Promise<ISchool[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const schools: ISchool[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [name, director_id] = line
        schools.push({
          name,
          director_id,
        })
      })
      .on('end', () => {
        if (env.NODE_ENV === 'dev') fs.promises.unlink(file.path)

        delete schools[0]
        resolve(schools)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
