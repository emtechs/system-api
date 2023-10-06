import { compareSync } from 'bcryptjs'
import { AppError } from '../../errors'
import { IPasswordUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const verifyPasswordService = async (
  { password }: IPasswordUpdateRequest,
  id: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) throw new AppError('Login or password invalid', 403)

  const passwordMatch = compareSync(password, user.password)

  if (!passwordMatch) throw new AppError('Login or password invalid', 403)
}
