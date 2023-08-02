import jwt from 'jsonwebtoken'
import { AppError } from '../../errors'
import { IRecoveryPasswordRequest } from '../../interfaces'
import { prisma, mailGenerator, sendEmail } from '../../lib'
import { env } from '../../env'

export const sendEmailRecoveryService = async ({
  login,
}: IRecoveryPasswordRequest) => {
  try {
    const user = await prisma.user.findUnique({
      where: { login },
    })

    if (!user) throw new AppError('User not found', 404)

    if (!user.is_active)
      throw new AppError(
        'No active account found with the given credentials',
        401,
      )

    if (!user.email) throw new AppError('no email registered')

    let token = await prisma.token.findUnique({ where: { user_id: user.id } })
    if (!token) {
      token = await prisma.token.create({
        data: {
          user_id: user.id,
          token: jwt.sign({}, env.SECRET_KEY, {
            expiresIn: '1h',
          }),
        },
      })
    } else
      token = await prisma.token.update({
        where: { id: token.id },
        data: {
          token: jwt.sign({}, env.SECRET_KEY, {
            expiresIn: '1h',
          }),
        },
      })

    const link = `${env.BASE_URL}/password/${user.id}/${token.token}`

    const arrayUserName = user.name ? user.name.split(' ') : ['']
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

        action: {
          instructions: 'Clique no botão abaixo para redefinir sua senha:',
          button: {
            color: '#006CBE',
            text: 'Redefina sua senha',
            link,
          },
        },

        outro:
          'Se você não solicitou uma redefinição de senha, nenhuma outra ação será necessária de sua parte.',
      },
    }

    const emailBody = mailGenerator.generate(emailContent)

    await sendEmail(user.email, 'Password reset', emailBody)

    return 'password reset link sent to your email account'
  } catch (err) {
    if (err instanceof AppError) throw new AppError(err.message, err.statusCode)

    throw new AppError(
      'Unfortunately, the email could not be sent, we apologize for the inconvenience and ask that you try again later.',
      404,
    )
  }
}
