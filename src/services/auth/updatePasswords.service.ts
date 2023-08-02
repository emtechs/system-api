import jwt from 'jsonwebtoken'
import { hashSync } from 'bcryptjs'
import { AppError } from '../../errors'
import { IPasswordUpdateRequest } from '../../interfaces'
import { UserReturnSchema } from '../../schemas'
import { prisma, mailGenerator, sendEmail } from '../../lib'
import { env } from '../../env'

export const updatePasswordService = async (
  { password }: IPasswordUpdateRequest,
  id: string,
  token: string,
) => {
  const userFind = await prisma.user.findUnique({ where: { id } })
  if (!userFind) throw new AppError('Invalid link or expired', 400)

  const tokenFind = await prisma.token.findFirst({
    where: { token },
  })
  if (!tokenFind || tokenFind.user_id !== id)
    throw new AppError('Invalid link or expired', 400)

  jwt.verify(token, env.SECRET_KEY, (error) => {
    if (error) throw new AppError(error.message, 400)
  })

  password = hashSync(password, 10)
  const user = await prisma.user.update({
    where: { id },
    data: { password },
  })
  await prisma.token.delete({
    where: { user_id: id },
  })

  if (user.name && user.email) {
    const arrayUserName = user.name.split(' ')
    const emailName =
      arrayUserName.length > 1
        ? arrayUserName[0] + ' ' + arrayUserName[1]
        : arrayUserName[0]

    const emailContent = {
      body: {
        greeting: 'Prezado',
        signature: 'Atenciosamente',
        name: emailName,
        intro:
          'Você recebeu este e-mail porque uma solicitação de redefinição de senha para sua conta foi recebida.',

        outro:
          'Se você não solicitou uma redefinição de senha, por favor nos contate para identificar possiveis brechas de seguranca.',
      },
    }

    const emailBody = mailGenerator.generate(emailContent)
    await sendEmail(user.email, 'Password', emailBody)
  }
  return UserReturnSchema.parse(user)
}
