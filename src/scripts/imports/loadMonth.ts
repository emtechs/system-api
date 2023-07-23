import fs from 'node:fs'
import { parse as csvParse } from 'csv-parse'
import { IMonth } from '../../interfaces'
import { env } from '../../env'

export const loadMonth = (file: Express.Multer.File): Promise<IMonth[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const months: IMonth[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [month, name] = line
        months.push({
          month: +month,
          name,
        })
      })
      .on('end', () => {
        if (env.NODE_ENV === 'dev') fs.promises.unlink(file.path)

        delete months[0]
        resolve(months)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
