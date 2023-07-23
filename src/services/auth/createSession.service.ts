import jwt from 'jsonwebtoken'
import { compareSync } from 'bcryptjs'
import { AppError } from '../../errors'
import { prisma } from '../../lib'
import { ISessionRequest } from '../../interfaces'
import { env } from '../../env'

export const createSessionService = async ({
  login,
  password,
}: ISessionRequest): Promise<{
  token: string
}> => {
  const user = await prisma.user.findUnique({
    where: { login },
  })

  if (!user) throw new AppError('Login or password invalid', 403)

  const passwordMatch = compareSync(password, user.password)
  if (!passwordMatch) throw new AppError('Login or password invalid', 403)

  if (!user.is_active)
    throw new AppError(
      'No active account found with the given credentials',
      401,
    )

  const token = jwt.sign({ role: user.role }, env.SECRET_KEY, {
    subject: user.id,
    expiresIn: '7d',
  })

  return { token }
}
