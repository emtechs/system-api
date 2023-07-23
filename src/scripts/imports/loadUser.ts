import fs from 'node:fs'
import { parse as csvParse } from 'csv-parse'
import { IUser } from '../../interfaces'
import { env } from '../../env'

export const loadUser = (file: Express.Multer.File): Promise<IUser[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const users: IUser[] = []
    const parseFile = csvParse({ delimiter: ';' })
    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [login, name, cpf] = line
        users.push({
          login,
          name,
          cpf,
        })
      })
      .on('end', () => {
        if (env.NODE_ENV === 'dev') fs.promises.unlink(file.path)

        delete users[0]
        resolve(users)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
