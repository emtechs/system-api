import fs from 'node:fs'
import { stringify } from 'csv-stringify'
import { env } from '../../env'
import { prisma } from '../../lib'

export const exportUserService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      login: true,
      name: true,
      cpf: true,
    },
  })

  if (env.NODE_ENV === 'production') {
    const writeStream = fs.createWriteStream('tmp/uploads/users.csv')
    const stringifier = stringify({
      header: true,
      columns: ['id', 'login', 'name', 'cpf'],
    })

    users.forEach((user) => {
      stringifier.write(Object.values(user))
    })

    stringifier.pipe(writeStream)
  }

  return users
}
