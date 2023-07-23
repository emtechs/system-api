import { hashSync } from 'bcryptjs'
import { IUser } from '../../interfaces'
import { prisma } from '../../lib'

const verifyUser = async ({ login, name, cpf }: IUser) => {
  const userData = await prisma.user.findUnique({ where: { login } })
  let user = userData
  if (!userData) {
    const password = hashSync(login.substring(0, 6), 10)

    user = await prisma.user.create({
      data: {
        cpf,
        login,
        name,
        password,
      },
    })
  }

  return user
}

export const importUser = async (users: IUser[]) => {
  const usersVerifyParse = users.map((el) => {
    return verifyUser(el)
  })
  return Promise.all(usersVerifyParse).then((user) => {
    return user
  })
}
