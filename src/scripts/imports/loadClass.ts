import fs from 'node:fs'
import { parse as csvParse } from 'csv-parse'
import { IClass } from '../../interfaces'
import { env } from '../../env'

export const loadClasses = (file: Express.Multer.File): Promise<IClass[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const classes: IClass[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [name] = line
        classes.push({
          name,
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
